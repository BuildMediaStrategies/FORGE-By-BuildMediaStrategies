import { useState } from 'react';
import { Receipt, Plus } from 'lucide-react';

type FilterTab = 'all' | 'draft' | 'sent' | 'paid';

export function InvoicesPage() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const invoices: any[] = [];

  const filterTabs: { id: FilterTab; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'draft', label: 'Draft' },
    { id: 'sent', label: 'Sent' },
    { id: 'paid', label: 'Paid' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1
            className="text-2xl sm:text-3xl font-black"
            style={{
              background: 'linear-gradient(135deg, #A30E15 0%, #780A0F 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Invoices
          </h1>
          <p className="text-[#666666] mt-1 font-medium">Billing for recruitment and survey work</p>
        </div>
        <button className="neumorphic-button flex items-center gap-2 px-6 py-3 font-semibold">
          <Plus className="w-5 h-5" />
          New Invoice
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
              activeFilter === tab.id
                ? 'neumorphic-button'
                : 'text-[#666666] hover:text-white hover:bg-[#A30E15]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {invoices.length === 0 ? (
        <div className="neumorphic-card border border-[#e5e5e5] bg-white">
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="neumorphic-icon-box p-6 mb-6">
              <Receipt className="w-12 h-12 text-[#A30E15]" />
            </div>
            <h2 className="text-2xl font-black text-black mb-2">No Invoices Yet</h2>
            <p className="text-[#666666] mb-6 max-w-md">
              Create your first invoice
            </p>
            <button className="neumorphic-button flex items-center gap-2 px-8 py-3 font-semibold">
              <Plus className="w-5 h-5" />
              Create First Invoice
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        </div>
      )}
    </div>
  );
}
