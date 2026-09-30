import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Download, FileText } from 'lucide-react';

export default function Reports() {
  return (
    <div className="space-y-6 max-w-4xl">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-text-main mb-1">Reports</h1>
        <p className="text-text-muted text-sm">Generate a clear summary of your household spending.</p>
      </header>

      <Card className="p-6">
        <h3 className="font-medium text-text-main mb-4">Report Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Select label="Date range">
            <option>Last 30 days</option>
            <option>This month</option>
            <option>Last month</option>
            <option>This year</option>
            <option>Custom range...</option>
          </Select>
          <Select label="Report type">
            <option>Comprehensive summary</option>
            <option>Expenses only</option>
            <option>Income vs Expenses</option>
            <option>Category breakdown</option>
          </Select>
          <Select label="Category filter">
            <option>All categories</option>
            <option>Housing</option>
            <option>Food</option>
            <option>Transportation</option>
          </Select>
          <Select label="Account">
            <option>All accounts</option>
            <option>Joint Checking</option>
            <option>Personal Credit Card</option>
          </Select>
        </div>
        
        <div className="flex gap-3 pt-4 border-t border-border">
          <Button>Generate report</Button>
        </div>
      </Card>

      <Card className="p-0 overflow-hidden bg-muted-background/30 border-dashed">
        <div className="p-12 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full bg-surface border border-border flex items-center justify-center text-text-muted mb-4">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="font-medium text-text-main mb-1">No report generated</h3>
          <p className="text-sm text-text-muted max-w-sm mb-6">
            Configure your settings above and click generate to see a preview of your financial report.
          </p>
          
          <div className="flex gap-3">
            <Button variant="secondary" disabled>
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            <Button variant="secondary" disabled>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
