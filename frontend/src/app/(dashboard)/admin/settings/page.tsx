'use client';

import Card from '@/components/ui/Card';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-5 max-w-xl">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 text-sm mt-0.5">Platform configuration and preferences.</p>
      </div>

      <Card>
        <div className="space-y-4">
          {[
            { label: 'Platform Name', value: 'FundiConnect' },
            { label: 'Country', value: 'Tanzania' },
            { label: 'Currency', value: 'TZS (Tanzanian Shilling)' },
            { label: 'Support Email', value: 'support@fundiconnect.co.tz' },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <span className="text-sm text-gray-500">{label}</span>
              <span className="text-sm font-medium text-gray-900">{value}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <p className="text-sm text-gray-400 text-center py-4">Advanced settings coming soon.</p>
      </Card>
    </div>
  );
}
