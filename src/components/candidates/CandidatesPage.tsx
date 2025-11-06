import { useState } from 'react';
import { Users, Plus } from 'lucide-react';

type FilterTab = 'all' | 'screening' | 'interviewing' | 'placed';

export function CandidatesPage() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const candidates: any[] = [];

  const filterTabs: { id: FilterTab; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'screening', label: 'Screening' },
    { id: 'interviewing', label: 'Interviewing' },
    { id: 'placed', label: 'Placed' }
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
            Candidates
          </h1>
          <p className="text-[#666666] mt-1 font-medium">Profiles, pipeline, and status tracking</p>
        </div>
        <button className="neumorphic-button flex items-center gap-2 px-6 py-3 font-semibold">
          <Plus className="w-5 h-5" />
          Add Candidate
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

      {candidates.length === 0 ? (
        <div className="neumorphic-card border border-[#e5e5e5] bg-white">
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="neumorphic-icon-box p-6 mb-6">
              <Users className="w-12 h-12 text-[#A30E15]" />
            </div>
            <h2 className="text-2xl font-black text-black mb-2">No Candidates Yet</h2>
            <p className="text-[#666666] mb-6 max-w-md">
              Add your first candidate to the pipeline
            </p>
            <button className="neumorphic-button flex items-center gap-2 px-8 py-3 font-semibold">
              <Plus className="w-5 h-5" />
              Add First Candidate
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
