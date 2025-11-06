import { LayoutDashboard, Briefcase, Users, Building2, ClipboardList, FileText, Receipt, BarChart3, Settings, Bell, LogOut } from 'lucide-react';

interface PillNavigationProps {
  activePage: string;
  onNavigate: (page: string) => void;
  userEmail: string;
  onLogout: () => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'roles', label: 'Roles', icon: Briefcase },
  { id: 'candidates', label: 'Candidates', icon: Users },
  { id: 'clients', label: 'Clients', icon: Building2 },
  { id: 'surveys', label: 'Surveys', icon: ClipboardList },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'invoices', label: 'Invoices', icon: Receipt },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function PillNavigation({ activePage, onNavigate, userEmail, onLogout }: PillNavigationProps) {
  const initials = userEmail
    .split('@')[0]
    .slice(0, 2)
    .toUpperCase();

  return (
    <nav className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-full px-4">
      <div className="neumorphic-pill flex items-center justify-between px-6 h-[70px]" style={{ minWidth: '800px' }}>
        <div className="flex items-center gap-2">
          <span
            className="text-[24px] font-black tracking-tight"
            style={{
              background: 'linear-gradient(135deg, #A30E15 0%, #780A0F 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            HAMILTON NEXUS
          </span>
        </div>

        <div className="flex items-center gap-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center gap-2 px-5 py-2.5 text-[16px] font-semibold transition-all duration-200 ${
                  isActive
                    ? 'neumorphic-button'
                    : 'text-[#666666] hover:text-white hover:bg-[#A30E15] rounded-full'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <button className="neumorphic-button relative p-2 text-[#000000] hover:text-white transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#A30E15] rounded-full"></span>
          </button>

          <div className="relative group">
            <button className="flex items-center gap-2 hover:bg-[#A30E15] hover:text-white px-2 py-1 rounded-full transition-colors">
              <div className="w-9 h-9 border border-[#e5e5e5] rounded-full bg-[#f5f5f5] flex items-center justify-center">
                <span className="text-black text-xs font-bold">{initials}</span>
              </div>
            </button>

            <div className="absolute right-0 mt-2 w-56 neumorphic-card border border-[#e5e5e5] bg-white rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 shadow-lg">
              <div className="p-4 border-b border-[#e5e5e5]">
                <p className="font-semibold text-black">Account</p>
                <p className="text-xs text-[#666666] font-normal">{userEmail}</p>
              </div>
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-2 px-4 py-3 text-[#000000] hover:bg-[#A30E15] hover:text-white transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
