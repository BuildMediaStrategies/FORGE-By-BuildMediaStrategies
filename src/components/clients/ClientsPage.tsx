import { Building2, Plus } from 'lucide-react';

export function ClientsPage() {
  const clients: any[] = [];

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
            Clients
          </h1>
          <p className="text-[#666666] mt-1 font-medium">Company contacts and placements</p>
        </div>
        <button className="neumorphic-button flex items-center gap-2 px-6 py-3 font-semibold">
          <Plus className="w-5 h-5" />
          Add Client
        </button>
      </div>

      {clients.length === 0 ? (
        <div className="neumorphic-card border border-[#e5e5e5] bg-white">
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="neumorphic-icon-box p-6 mb-6">
              <Building2 className="w-12 h-12 text-[#A30E15]" />
            </div>
            <h2 className="text-2xl font-black text-black mb-2">No Clients Yet</h2>
            <p className="text-[#666666] mb-6 max-w-md">
              Add your first client company
            </p>
            <button className="neumorphic-button flex items-center gap-2 px-8 py-3 font-semibold">
              <Plus className="w-5 h-5" />
              Add First Client
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
