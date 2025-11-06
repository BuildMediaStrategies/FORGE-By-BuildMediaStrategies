import { useState } from 'react';
import { Briefcase, Plus } from 'lucide-react';

type FilterTab = 'all' | 'active' | 'planning' | 'completed';

export function JobsPage() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const jobs: any[] = [];

  const filterTabs: { id: FilterTab; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'active', label: 'Active' },
    { id: 'planning', label: 'Planning' },
    { id: 'completed', label: 'Completed' }
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
            Jobs
          </h1>
          <p className="text-[#e5e5e5] mt-1 font-medium">Manage your scaffolding projects</p>
        </div>
        <button className="neumorphic-button flex items-center gap-2 px-6 py-3 text-white font-semibold">
          <Plus className="w-5 h-5" />
          New Job
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
              activeFilter === tab.id
                ? 'neumorphic-button text-white'
                : 'text-[#e5e5e5] hover:text-white hover:bg-[#780A0F]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {jobs.length === 0 ? (
        <div className="neumorphic-card border border-[#2d2d2d] bg-[#1a1a1a]">
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="neumorphic-icon-box p-6 mb-6">
              <Briefcase className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-2xl font-black text-white mb-2">No Jobs Yet</h2>
            <p className="text-[#e5e5e5] mb-6 max-w-md">
              Create your first scaffolding project
            </p>
            <button className="neumorphic-button flex items-center gap-2 px-8 py-3 text-white font-semibold">
              <Plus className="w-5 h-5" />
              Create First Job
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
