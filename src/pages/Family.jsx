import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Plus, User, Mail } from 'lucide-react';
import { Badge } from '../components/ui/Badge';

const members = [
  { id: 1, name: 'Akshat', role: 'Owner', shared: 31200, initials: 'AK', isCurrentUser: true },
  { id: 2, name: 'Parent', role: 'Member', shared: 29500, initials: 'P', isCurrentUser: false },
];

export default function Family() {
  return (
    <div className="space-y-6 max-w-4xl">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-text-main mb-1">Household</h1>
          <p className="text-text-muted text-sm">Manage shared expenses and household spending.</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Invite member
        </Button>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <Card className="p-6">
          <p className="text-sm text-text-muted mb-2">Total household spending</p>
          <p className="text-3xl font-semibold text-text-main">₹60,700</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-text-muted mb-2">Active members</p>
          <p className="text-3xl font-semibold text-text-main">2</p>
        </Card>
      </div>

      <h3 className="font-medium text-text-main mb-4">Members</h3>
      
      <div className="space-y-3">
        {members.map(member => (
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
              <p className="font-medium text-text-main">₹{member.shared.toLocaleString()}</p>
              <p className="text-xs text-text-muted mt-1">shared spending this month</p>
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
          Share your PocketLedger household with up to 4 other members on the Family plan. Private expenses remain private.
        </p>
        <Button variant="secondary">Send invitation</Button>
      </Card>
    </div>
  );
}
