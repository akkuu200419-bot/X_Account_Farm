import { NavLink } from 'react-router-dom';

const NAV_ITEMS = [
  { path: '/analytics',     label: 'ANALYTICS' },
  { path: '/device-mgr',    label: 'DEVICE_MGR' },
  { path: '/live-log',      label: 'LIVE_LOG' },
  { path: '/credentials',   label: 'CREDENTIALS' },
  { path: '/post-actions',  label: 'POST_ACTIONS' },
  { path: '/outlook-farm',  label: 'OUTLOOK_FARM' },
  { path: '/tw-pwa-farm',   label: 'DEVICE_LOGIN_FARM' },
  { path: '/login-farm',    label: 'BROWSER_LOGIN_FARM' },
];

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-[#0a0e1a]/95 backdrop-blur-sm border-b border-[#1e2d3d]">
      {/* Top glow line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#00ff41]/50 to-transparent" />

      <div className="max-w-[1600px] mx-auto px-4 flex items-center h-12 gap-6">
        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[#00ff41] font-mono font-bold text-sm tracking-widest select-none">
            ⬡ CYBERFARM
          </span>
        </div>

        {/* Divider */}
        <div className="w-px h-5 bg-[#1e2d3d]" />

        {/* Nav links — scrollable on small screens */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none flex-1 min-w-0">
          {NAV_ITEMS.map(({ path, label }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `relative shrink-0 px-2.5 py-1 text-[10px] font-mono font-medium tracking-widest transition-all duration-200 rounded-sm whitespace-nowrap ${
                  isActive
                    ? 'text-[#00ff41]'
                    : 'text-[#8b949e] hover:text-[#e6edf3]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-px bg-[#00ff41] shadow-[0_0_6px_#00ff41]" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Status indicator */}
        <div className="shrink-0 flex items-center gap-1.5 ml-auto">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00ff41] shadow-[0_0_6px_#00ff41] animate-pulse" />
          <span className="text-[#00ff41] font-mono text-[10px] tracking-widest hidden sm:block">
            SYSTEM ONLINE
          </span>
        </div>
      </div>
    </nav>
  );
}
