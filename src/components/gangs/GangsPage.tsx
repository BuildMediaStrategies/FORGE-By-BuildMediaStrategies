import { Users, Plus } from 'lucide-react';

export function GangsPage() {
  const gangs: any[] = [];

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
            Gangs
          </h1>
          <p className="text-[#e5e5e5] mt-1 font-medium">Organize your team into work crews</p>
        </div>
        <button className="neumorphic-button flex items-center gap-2 px-6 py-3 text-white font-semibold">
          <Plus className="w-5 h-5" />
          Create Gang
        </button>
      </div>

      {gangs.length === 0 ? (
        <div className="neumorphic-card border border-[#2d2d2d] bg-[#1a1a1a]">
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="neumorphic-icon-box p-6 mb-6">
              <Users className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-2xl font-black text-white mb-2">No Gangs Yet</h2>
            <p className="text-[#e5e5e5] mb-6 max-w-md">
              Create crews to organize your team
            </p>
            <button className="neumorphic-button flex items-center gap-2 px-8 py-3 text-white font-semibold">
              <Plus className="w-5 h-5" />
              Create First Gang
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
