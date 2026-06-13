import { sparklineData, credentials, devices } from '../data/mockData';

function Sparkline({ data }: { data: number[] }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 80;
  const h = 32;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  });
  const polyline = pts.join(' ');
  const area = `0,${h} ${polyline} ${w},${h}`;

  return (
    <svg width={w} height={h} className="overflow-visible">
      <defs>
        <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill="url(#sparkGrad)" />
      <polyline points={polyline} fill="none" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle
        cx={(data.length - 1) / (data.length - 1) * w}
        cy={h - ((data[data.length - 1] - min) / range) * h}
        r="2.5"
        fill="#22d3ee"
      />
    </svg>
  );
}

export default function AnalyticsHeader() {
  const totalAccounts = credentials.length;
  const twoFaCount = credentials.filter((c) => c.twoFaSecret).length;
  const activeDevices = devices.filter((d) => d.status === 'available').length;
  const successRate = 96;

  const stats = [
    {
      label: 'Total Accounts Created',
      value: totalAccounts,
      sub: '+3 today',
      color: 'text-cyan-400',
      borderColor: 'border-cyan-500/30',
      glowColor: 'shadow-cyan-900/30',
    },
    {
      label: '2FA Enabled',
      value: twoFaCount,
      sub: `${Math.round((twoFaCount / totalAccounts) * 100)}% coverage`,
      color: 'text-emerald-400',
      borderColor: 'border-emerald-500/30',
      glowColor: 'shadow-emerald-900/30',
    },
    {
      label: 'Active Devices',
      value: activeDevices,
      sub: `${devices.length} total`,
      color: 'text-blue-400',
      borderColor: 'border-blue-500/30',
      glowColor: 'shadow-blue-900/30',
    },
    {
      label: 'Success Rate',
      value: `${successRate}%`,
      sub: 'last 7 days',
      color: 'text-violet-400',
      borderColor: 'border-violet-500/30',
      glowColor: 'shadow-violet-900/30',
      sparkline: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`relative bg-[#0d1117] border ${stat.borderColor} rounded-xl p-4 shadow-lg ${stat.glowColor} overflow-hidden`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
          <p className="text-xs text-gray-500 font-medium tracking-wide uppercase mb-1">{stat.label}</p>
          <div className="flex items-end justify-between gap-2">
            <div>
              <p className={`text-3xl font-bold ${stat.color} leading-none`}>{stat.value}</p>
              <p className="text-xs text-gray-600 mt-1">{stat.sub}</p>
            </div>
            {stat.sparkline && (
              <div className="opacity-80">
                <Sparkline data={sparklineData} />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
