import crypto from 'node:crypto';
import dns from 'node:dns/promises';
import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, 'data');
const DB_PATH = path.join(DATA_DIR, 'auth-db.json');

await loadEnvFile();

const PORT = Number(process.env.AUTH_PORT || process.env.PORT || 4000);
const CLIENT_ORIGINS = new Set(
  (process.env.CLIENT_ORIGINS || process.env.CLIENT_ORIGIN || 'http://localhost:5173,http://localhost:5174,http://localhost:5175')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
);
const SESSION_COOKIE = 'pl_session';
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;
const OTP_TTL_MS = 1000 * 60 * 10;
const MIN_PASSWORD_LENGTH = 12;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const dbDefault = {
  users: [],
  sessions: [],
  otps: [],
  loginAttempts: []
};

let writeQueue = Promise.resolve();

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

async function loadEnvFile() {
  try {
    const raw = await fs.readFile(path.join(process.cwd(), '.env'), 'utf8');
    for (const line of raw.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const index = trimmed.indexOf('=');
      if (index === -1) continue;
      const key = trimmed.slice(0, index).trim();
      const value = trimmed.slice(index + 1).trim().replace(/^['"]|['"]$/g, '');
      if (key && process.env[key] === undefined) process.env[key] = value;
    }
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
}

function jsonResponse(res, status, body, headers = {}) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    ...headers
  });
  res.end(JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 1024 * 32) {
        reject(new Error('Request body is too large.'));
        req.destroy();
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error('Invalid JSON body.'));
      }
    });
    req.on('error', reject);
  });
}

async function readDb() {
  try {
    const raw = await fs.readFile(DB_PATH, 'utf8');
    return { ...dbDefault, ...JSON.parse(raw) };
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.writeFile(DB_PATH, JSON.stringify(dbDefault, null, 2));
    return structuredClone(dbDefault);
  }
}

async function writeDb(db) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  writeQueue = writeQueue.then(() => fs.writeFile(DB_PATH, JSON.stringify(db, null, 2)));
  return writeQueue;
}

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    emailVerified: user.emailVerified,
    createdAt: user.createdAt
  };
}

function normalizeEmail(email = '') {
  return String(email).trim().toLowerCase();
}

function hash(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function sign(value) {
  const secret = process.env.AUTH_SECRET || 'local-dev-change-this-secret';
  return crypto.createHmac('sha256', secret).update(value).digest('base64url');
}

function signedToken(value) {
  return `${value}.${sign(value)}`;
}

function verifySignedToken(token = '') {
  const [value, signature] = token.split('.');
  if (!value || !signature) return null;
  const expected = sign(value);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  return value;
}

async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('base64url');
  const pepper = process.env.PASSWORD_PEPPER || '';
  const derivedKey = await new Promise((resolve, reject) => {
    crypto.scrypt(password + pepper, salt, 64, { N: 16384, r: 8, p: 1 }, (error, key) => {
      if (error) reject(error);
      else resolve(key.toString('base64url'));
    });
  });
  return `scrypt$${salt}$${derivedKey}`;
}

async function verifyPassword(password, storedHash) {
  const [, salt, key] = String(storedHash).split('$');
  if (!salt || !key) return false;
  const pepper = process.env.PASSWORD_PEPPER || '';
  const candidate = await new Promise((resolve, reject) => {
    crypto.scrypt(password + pepper, salt, 64, { N: 16384, r: 8, p: 1 }, (error, derived) => {
      if (error) reject(error);
      else resolve(derived.toString('base64url'));
    });
  });
  const a = Buffer.from(candidate);
  const b = Buffer.from(key);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function validatePassword(password = '') {
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }
  if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password)) {
    return 'Password must include uppercase, lowercase, and a number.';
  }
  return null;
}

async function isDeliverableEmail(email) {
  if (!EMAIL_RE.test(email) || email.length > 254) return false;
  const domain = email.split('@')[1];
  try {
    const mx = await dns.resolveMx(domain);
    if (mx.length > 0) return true;
  } catch {
    // Try host records below; some valid domains accept mail without explicit MX.
  }
  try {
    const records = await dns.resolve(domain);
    return records.length > 0;
  } catch {
    return false;
  }
}

function cookieHeader(sessionToken, expiresAt) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${SESSION_COOKIE}=${sessionToken}; HttpOnly; SameSite=Lax; Path=/; Expires=${new Date(expiresAt).toUTCString()}${secure}`;
}

function clearCookieHeader() {
  return `${SESSION_COOKIE}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`;
}

function parseCookies(req) {
  return Object.fromEntries(
    String(req.headers.cookie || '')
      .split(';')
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const index = part.indexOf('=');
        return [part.slice(0, index), decodeURIComponent(part.slice(index + 1))];
      })
  );
}

function clientIp(req) {
  return String(req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown').split(',')[0].trim();
}

function cleanDb(db) {
  const now = Date.now();
  db.sessions = db.sessions.filter((session) => session.expiresAt > now);
  db.otps = db.otps.filter((otp) => otp.expiresAt > now && otp.attempts < 5);
  db.loginAttempts = db.loginAttempts.filter((attempt) => now - attempt.at < 1000 * 60 * 15);
}

function isRateLimited(db, key, maxAttempts = 8) {
  const now = Date.now();
  const attempts = db.loginAttempts.filter((attempt) => attempt.key === key && now - attempt.at < 1000 * 60 * 15);
  return attempts.length >= maxAttempts;
}

function recordAttempt(db, key) {
  db.loginAttempts.push({ key, at: Date.now() });
}

async function sendOtpEmail(email, otp) {
  const from = process.env.AUTH_EMAIL_FROM;
  const subject = 'Your PocketLedger verification code';
  const text = `Your PocketLedger verification code is ${otp}. It expires in 10 minutes.`;

  if (!from) {
    throw new HttpError(503, 'Email delivery is not configured. Add AUTH_EMAIL_FROM and a free email provider API key to .env.');
  }

  if (process.env.RESEND_API_KEY) {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ from, to: email, subject, text })
    });
    if (!response.ok) throw new Error(`Resend email failed with ${response.status}.`);
    return { provider: 'resend' };
  }

  if (process.env.SENDGRID_API_KEY) {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email }] }],
        from: { email: from.match(/<(.+)>/)?.[1] || from },
        subject,
        content: [{ type: 'text/plain', value: text }]
      })
    });
    if (!response.ok) throw new Error(`SendGrid email failed with ${response.status}.`);
    return { provider: 'sendgrid' };
  }

  if (process.env.BREVO_API_KEY) {
    const senderMatch = from.match(/^(.*)<(.+)>$/);
    const senderName = senderMatch?.[1]?.trim() || 'PocketLedger';
    const senderEmail = senderMatch?.[2]?.trim() || from;
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': process.env.BREVO_API_KEY,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        sender: { name: senderName, email: senderEmail },
        to: [{ email }],
        subject,
        textContent: text
      })
    });
    if (!response.ok) throw new Error(`Brevo email failed with ${response.status}.`);
    return { provider: 'brevo' };
  }

  throw new HttpError(503, 'Email delivery is not configured. Add RESEND_API_KEY, SENDGRID_API_KEY, or BREVO_API_KEY to .env.');
}

async function createSession(db, userId) {
  const sessionId = crypto.randomBytes(32).toString('base64url');
  const expiresAt = Date.now() + SESSION_TTL_MS;
  db.sessions.push({
    idHash: hash(sessionId),
    userId,
    createdAt: Date.now(),
    expiresAt
  });
  return { token: signedToken(sessionId), expiresAt };
}

async function getCurrentUser(req, db) {
  const token = parseCookies(req)[SESSION_COOKIE];
  const sessionId = verifySignedToken(token);
  if (!sessionId) return null;
  const session = db.sessions.find((item) => item.idHash === hash(sessionId) && item.expiresAt > Date.now());
  if (!session) return null;
  const user = db.users.find((item) => item.id === session.userId);
  return user ? { user, session } : null;
}

function assertSameOrigin(req) {
  if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') return true;
  const origin = req.headers.origin;
  return !origin || CLIENT_ORIGINS.has(origin);
}

function corsOrigin(req) {
  const origin = req.headers.origin;
  return CLIENT_ORIGINS.has(origin) ? origin : [...CLIENT_ORIGINS][0];
}

async function handleRegister(req, res, db) {
  const body = await readBody(req);
  const name = String(body.name || '').trim();
  const email = normalizeEmail(body.email);
  const password = String(body.password || '');

  if (name.length < 2 || name.length > 80) {
    return jsonResponse(res, 400, { error: 'Please enter your full name.' });
  }
  const passwordError = validatePassword(password);
  if (passwordError) return jsonResponse(res, 400, { error: passwordError });
  if (!(await isDeliverableEmail(email))) {
    return jsonResponse(res, 400, { error: 'Please use a valid email address that can receive mail.' });
  }
  if (db.users.some((user) => user.email === email)) {
    return jsonResponse(res, 409, { error: 'An account already exists for this email.' });
  }

  const otp = crypto.randomInt(100000, 999999).toString();
  const pendingId = crypto.randomUUID();
  db.otps = db.otps.filter((item) => item.email !== email);
  db.otps.push({
    pendingId,
    email,
    name,
    passwordHash: await hashPassword(password),
    otpHash: hash(otp),
    attempts: 0,
    createdAt: Date.now(),
    expiresAt: Date.now() + OTP_TTL_MS
  });
  try {
    await sendOtpEmail(email, otp);
  } catch (error) {
    db.otps = db.otps.filter((item) => item.email !== email);
    await writeDb(db);
    throw error;
  }
  await writeDb(db);
  return jsonResponse(res, 201, {
    message: 'Verification code sent. Check your email to finish creating your account.',
    email,
    pendingId
  });
}

async function handleVerify(req, res, db) {
  const body = await readBody(req);
  const email = normalizeEmail(body.email);
  const code = String(body.code || '').replace(/\D/g, '');
  const pending = db.otps.find((item) => item.email === email);

  if (!pending || pending.expiresAt < Date.now()) {
    return jsonResponse(res, 400, { error: 'That verification code expired. Please create the account again.' });
  }
  if (pending.attempts >= 5) {
    return jsonResponse(res, 429, { error: 'Too many verification attempts. Please request a new code.' });
  }
  pending.attempts += 1;
  if (hash(code) !== pending.otpHash) {
    await writeDb(db);
    return jsonResponse(res, 400, { error: 'Invalid verification code.' });
  }
  if (db.users.some((user) => user.email === email)) {
    db.otps = db.otps.filter((item) => item.email !== email);
    await writeDb(db);
    return jsonResponse(res, 409, { error: 'An account already exists for this email.' });
  }

  const user = {
    id: crypto.randomUUID(),
    name: pending.name,
    email,
    passwordHash: pending.passwordHash,
    emailVerified: true,
    createdAt: new Date().toISOString()
  };
  db.users.push(user);
  db.otps = db.otps.filter((item) => item.email !== email);
  const session = await createSession(db, user.id);
  await writeDb(db);

  return jsonResponse(res, 201, { user: publicUser(user) }, { 'Set-Cookie': cookieHeader(session.token, session.expiresAt) });
}

async function handleLogin(req, res, db) {
  const body = await readBody(req);
  const email = normalizeEmail(body.email);
  const password = String(body.password || '');
  const rateKey = `${clientIp(req)}:${email}`;

  if (isRateLimited(db, rateKey)) {
    return jsonResponse(res, 429, { error: 'Too many login attempts. Please wait a few minutes and try again.' });
  }

  const user = db.users.find((item) => item.email === email);
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    recordAttempt(db, rateKey);
    await writeDb(db);
    return jsonResponse(res, 401, { error: 'Email or password is incorrect.' });
  }
  if (!user.emailVerified) {
    return jsonResponse(res, 403, { error: 'Please verify your email before signing in.' });
  }

  const session = await createSession(db, user.id);
  db.loginAttempts = db.loginAttempts.filter((attempt) => attempt.key !== rateKey);
  await writeDb(db);
  return jsonResponse(res, 200, { user: publicUser(user) }, { 'Set-Cookie': cookieHeader(session.token, session.expiresAt) });
}

async function handleLogout(req, res, db) {
  const token = parseCookies(req)[SESSION_COOKIE];
  const sessionId = verifySignedToken(token);
  if (sessionId) db.sessions = db.sessions.filter((session) => session.idHash !== hash(sessionId));
  await writeDb(db);
  return jsonResponse(res, 200, { ok: true }, { 'Set-Cookie': clearCookieHeader() });
}

async function handleRequest(req, res) {
  try {
    if (req.method === 'OPTIONS') {
      res.writeHead(204, {
        'Access-Control-Allow-Origin': corsOrigin(req),
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
      });
      return res.end();
    }

    if (!req.url.startsWith('/api/auth')) return jsonResponse(res, 404, { error: 'Not found.' });
    if (!assertSameOrigin(req)) return jsonResponse(res, 403, { error: 'Invalid request origin.' });

    const db = await readDb();
    cleanDb(db);

    if (req.method === 'POST' && req.url === '/api/auth/register') return await handleRegister(req, res, db);
    if (req.method === 'POST' && req.url === '/api/auth/verify') return await handleVerify(req, res, db);
    if (req.method === 'POST' && req.url === '/api/auth/login') return await handleLogin(req, res, db);
    if (req.method === 'POST' && req.url === '/api/auth/logout') return await handleLogout(req, res, db);
    if (req.method === 'GET' && req.url === '/api/auth/me') {
      const current = await getCurrentUser(req, db);
      return jsonResponse(res, 200, { user: current ? publicUser(current.user) : null });
    }

    return jsonResponse(res, 404, { error: 'Not found.' });
  } catch (error) {
    console.error(error);
    if (error instanceof HttpError) {
      return jsonResponse(res, error.status, { error: error.message });
    }
    return jsonResponse(res, 500, { error: 'Something went wrong. Please try again.' });
  }
}

http.createServer(handleRequest).listen(PORT, () => {
  console.info(`[auth] PocketLedger auth server listening on http://localhost:${PORT}`);
  if (!process.env.AUTH_SECRET) console.warn('[auth] Set AUTH_SECRET in .env before production use.');
});
