import { Briefcase, Package, Users, UserCheck, Plus, Sparkles, CheckCircle2, TrendingUp, FileText } from 'lucide-react';

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
      icon: CheckCircle2,
      description: 'System initialized successfully',
      timeAgo: 'Just now'
    },
    {
      icon: Users,
      description: 'Team workspace created',
      timeAgo: '2 minutes ago'
    },
    {
      icon: Briefcase,
      description: 'Dashboard setup completed',
      timeAgo: '5 minutes ago'
    },
    {
      icon: FileText,
      description: 'Database schema configured',
      timeAgo: '10 minutes ago'
    },
    {
      icon: TrendingUp,
      description: 'Analytics tracking enabled',
      timeAgo: '15 minutes ago'
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
          <p className="text-[#666666] mt-1 font-medium">Monitor your scaffolding projects and work orders</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Jobs"
          value={0}
          icon={Briefcase}
        />
        <StatCard
          title="Pending Equipment Orders"
          value={0}
          icon={Package}
        />
        <StatCard
          title="Active Gangs"
          value={0}
          icon={Users}
        />
        <StatCard
          title="Team Members"
          value={0}
          icon={UserCheck}
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <button className="neumorphic-button flex items-center gap-2 px-6 py-3 font-semibold">
          <Plus className="w-5 h-5" />
          New Job
        </button>
        <button className="neumorphic-button flex items-center gap-2 px-6 py-3 font-semibold">
          <Plus className="w-5 h-5" />
          New Equipment Order
        </button>
      </div>

      <div
        className="neumorphic-card border border-[#e5e5e5] bg-white overflow-hidden"
      >
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="neumorphic-icon-box p-3">
              <Sparkles className="w-6 h-6 text-[#A30E15]" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-black text-black mb-1">AI Insights</h3>
              <p className="text-base font-semibold text-black mb-2">All systems running smoothly</p>
              <p className="text-sm text-[#666666]">No urgent insights</p>
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
