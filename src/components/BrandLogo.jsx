import React from 'react';

export default function BrandLogo({ className = 'h-24 w-24', alt = 'PocketLedger Expense Manager' }) {
  return <img src="/brand/pocketledger-logo.png" className={`object-contain ${className}`} alt={alt} />;
}
