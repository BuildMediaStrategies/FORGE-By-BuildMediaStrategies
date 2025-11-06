import { Briefcase, ClipboardList, Users, Building2, Plus, TrendingUp, Receipt } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
}

function StatCard({ title, value, icon: Icon }: StatCardProps) {
  return (
    <div className="neumorphic-card border border-[#e5e5e5] bg-white transition-all duration-200 cursor-pointer hover:scale-[1.02] hover:border-[#A30E15]">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="neumorphic-icon-box p-3">
            <Icon className="w-6 h-6 text-[#A30E15]" />
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-[32px] font-black text-black">{value}</p>
          <p className="text-sm font-semibold text-[#666666] uppercase tracking-wide">{title}</p>
        </div>
      </div>
    </div>
  );
}

interface ActivityItemProps {
  icon: React.ElementType;
  description: string;
  timeAgo: string;
}

function ActivityItem({ icon: Icon, description, timeAgo }: ActivityItemProps) {
  return (
    <div className="flex items-start gap-4 py-4">
      <div className="neumorphic-icon-box p-2 mt-1">
        <Icon className="w-4 h-4 text-[#A30E15]" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-black">{description}</p>
        <p className="text-xs text-[#666666] mt-1">{timeAgo}</p>
      </div>
    </div>
  );
}

export function DashboardPage() {
  const recentActivities = [
    {
      icon: Briefcase,
      description: 'New role posted: Senior Developer',
      timeAgo: '2 hours ago'
    },
    {
      icon: Users,
      description: 'Candidate moved to interviewing stage',
      timeAgo: '5 hours ago'
    },
    {
      icon: ClipboardList,
      description: 'Survey project completed',
      timeAgo: '1 day ago'
    },
    {
      icon: Receipt,
      description: 'Invoice sent to client',
      timeAgo: '2 days ago'
    },
    {
      icon: TrendingUp,
      description: 'Monthly targets on track',
      timeAgo: '3 days ago'
    }
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
            Dashboard
          </h1>
          <p className="text-[#666666] mt-1 font-medium">Overview of recruitment and survey operations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Roles"
          value={0}
          icon={Briefcase}
        />
        <StatCard
          title="Candidates in Pipeline"
          value={0}
          icon={Users}
        />
        <StatCard
          title="Active Surveys"
          value={0}
          icon={ClipboardList}
        />
        <StatCard
          title="Client Companies"
          value={0}
          icon={Building2}
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <button className="neumorphic-button flex items-center gap-2 px-6 py-3 font-semibold">
          <Plus className="w-5 h-5" />
          New Role
        </button>
        <button className="neumorphic-button flex items-center gap-2 px-6 py-3 font-semibold">
          <Plus className="w-5 h-5" />
          New Survey
        </button>
      </div>

      <div
        className="neumorphic-card border border-[#e5e5e5] bg-white overflow-hidden"
      >
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="neumorphic-icon-box p-3">
              <TrendingUp className="w-6 h-6 text-[#A30E15]" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-black text-black mb-1">Business Insights</h3>
              <p className="text-base font-semibold text-black mb-2">Performance tracking active</p>
              <p className="text-sm text-[#666666]">Ready to track recruitment and survey metrics</p>
            </div>
          </div>
        </div>
      </div>

      <div className="neumorphic-card border border-[#e5e5e5] bg-white">
        <div className="p-6">
          <h3 className="text-lg font-bold text-black mb-4">Recent Activity</h3>
          <div className="divide-y divide-[#e5e5e5]">
            {recentActivities.map((activity, index) => (
              <ActivityItem
                key={index}
                icon={activity.icon}
                description={activity.description}
                timeAgo={activity.timeAgo}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
