import { LayoutDashboard, Briefcase, Users, Sparkles, Bell, LogOut, FileImage, LogIn } from 'lucide-react';

interface PillNavigationProps {
  activePage: string;
  onNavigate: (page: string) => void;
  userEmail: string;
  onLogout: () => void;
  onDevLogin?: () => void;
  isAuthenticated?: boolean;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'jobs', label: 'Jobs', icon: Briefcase },
  { id: 'equipment', label: 'Equipment', icon: Briefcase },
  { id: 'drawings', label: 'Drawings', icon: FileImage },
  { id: 'gangs', label: 'Gangs', icon: Users },
  { id: 'ai', label: 'AI', icon: Sparkles },
];

export function PillNavigation({ activePage, onNavigate, userEmail, onLogout, onDevLogin, isAuthenticated }: PillNavigationProps) {
  const initials = userEmail
    .split('@')[0]
    .slice(0, 2)
    .toUpperCase();

  const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  return (
    <nav className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-full px-4">
      <div className="neumorphic-pill flex items-center justify-between px-6 h-[70px]" style={{ minWidth: '800px' }}>
        <div className="flex items-center gap-2">
          <span className="text-[32px] font-black text-white tracking-tight">FORGE</span>
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
                    : 'text-[#e5e5e5] hover:text-white hover:bg-[#252525] rounded-full'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          {isDev && !isAuthenticated && onDevLogin && (
            <button
              onClick={onDevLogin}
              className="neumorphic-button flex items-center gap-2 px-4 py-2 text-white text-sm font-semibold"
            >
              <LogIn className="w-4 h-4" />
              Quick Login (Dev)
            </button>
          )}
          <button className="neumorphic-button relative p-2 text-[#e5e5e5] hover:text-white transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full"></span>
          </button>

          <div className="relative group">
            <button className="flex items-center gap-2 hover:bg-[#252525] px-2 py-1 rounded-full transition-colors">
              <div className="w-9 h-9 border border-[#2d2d2d] rounded-full bg-[#2d2d2d] flex items-center justify-center">
                <span className="text-white text-xs font-bold">{initials}</span>
              </div>
            </button>

            <div className="absolute right-0 mt-2 w-56 neumorphic-card border border-[#2d2d2d] bg-[#1a1a1a] rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div className="p-4 border-b border-[#2d2d2d]">
                <p className="font-semibold text-white">Account</p>
                <p className="text-xs text-[#e5e5e5] font-normal">{userEmail}</p>
              </div>
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-2 px-4 py-3 text-[#e5e5e5] hover:bg-[#252525] hover:text-white transition-colors"
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
