import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { Plus, Mail } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { useLedger } from '../context/LedgerContext';

const blankInvite = { name: '', email: '' };

export default function Family() {
  const { members, monthlySpending, inviteMember, formatMoney } = useLedger();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(blankInvite);
  const [error, setError] = useState('');

  const submitInvite = (event) => {
    event.preventDefault();
    try {
      inviteMember(form);
      setForm(blankInvite);
      setError('');
      setIsModalOpen(false);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-text-main mb-1">Household</h1>
          <p className="text-text-muted text-sm">Manage shared expenses and household spending.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Invite member
        </Button>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <Card className="p-6">
          <p className="text-sm text-text-muted mb-2">Total household spending</p>
          <p className="text-3xl font-semibold text-text-main">{formatMoney(monthlySpending)}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-text-muted mb-2">Active members</p>
          <p className="text-3xl font-semibold text-text-main">{members.length}</p>
        </Card>
      </div>

      <h3 className="font-medium text-text-main mb-4">Members</h3>

      <div className="space-y-3">
        {members.map((member) => (
          <Card key={member.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-muted-background flex items-center justify-center text-text-main font-medium">
                {member.initials}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-text-main">{member.name}</h3>
                  {member.isCurrentUser && <Badge variant="default">You</Badge>}
                </div>
                <p className="text-xs text-text-muted mt-1">{member.role}</p>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <p className="font-medium text-text-main">{member.email}</p>
              <p className="text-xs text-text-muted mt-1">shared household access</p>
            </div>
          </Card>
        ))}
      </div>

      <Card className="mt-8 p-6 bg-muted-background/30 border-dashed text-center">
        <div className="w-12 h-12 rounded-full bg-surface border border-border flex items-center justify-center text-text-muted mx-auto mb-4">
          <Mail className="w-6 h-6" />
        </div>
        <h3 className="font-medium text-text-main mb-1">Invite more members</h3>
        <p className="text-sm text-text-muted max-w-sm mx-auto mb-4">
          Add household members so shared spending can be organized in one place.
        </p>
        <Button variant="secondary" onClick={() => setIsModalOpen(true)}>Send invitation</Button>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Invite Member">
        <form className="space-y-4" onSubmit={submitInvite}>
          {error && <p className="text-sm text-status-danger bg-status-danger/10 px-3 py-2 rounded-sm">{error}</p>}
          <Input label="Name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
          <Input label="Email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
          <div className="pt-4 flex justify-end gap-3 border-t border-border mt-6">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Add member</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
