import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, Legend, RadarChart,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { TrendingUp, Users, Smartphone, Activity, Zap, Clock, ThumbsUp, Repeat2, MessageSquare, Rocket } from 'lucide-react';
import { devices, credentials, outlooks } from '../data/mockData';

// ── existing data generators ─────────────────────────────────────────────────
const getDeviceUsageData = () => devices.map(d => ({
  name: d.serial.slice(-6),
  usage: d.used,
  capacity: d.cap,
}));

const getPlatformDistribution = () => {
  const twitter = credentials.filter(c => c.handle?.includes('@')).length;
  return [
    { name: 'Twitter/X', value: twitter, color: '#1DA1F2' },
    { name: 'Instagram', value: 5, color: '#E1306C' },
    { name: 'Facebook', value: 4, color: '#4267B2' },
  ];
};

const getActivityOverTime = () => [
  { hour: '00:00', actions: 12, success: 10, failed: 2 },
  { hour: '04:00', actions: 8,  success: 7,  failed: 1 },
  { hour: '08:00', actions: 45, success: 42, failed: 3 },
  { hour: '12:00', actions: 89, success: 85, failed: 4 },
  { hour: '16:00', actions: 120,success: 112,failed: 8 },
  { hour: '20:00', actions: 67, success: 63, failed: 4 },
];

const getSuccessRateData = () => [
  { platform: 'Twitter', rate: 94, accounts: 15 },
  { platform: 'Instagram', rate: 87, accounts: 5 },
  { platform: 'Facebook', rate: 91, accounts: 4 },
];

const getPerformanceMetrics = () => [
  { metric: 'Speed',       value: 85 },
  { metric: 'Reliability', value: 92 },
  { metric: 'Accuracy',    value: 88 },
  { metric: 'Uptime',      value: 99 },
  { metric: 'Response',    value: 76 },
];

const getWeeklyTrend = () => [
  { day: 'Mon', likes: 45, reposts: 23, comments: 12 },
  { day: 'Tue', likes: 52, reposts: 28, comments: 15 },
  { day: 'Wed', likes: 61, reposts: 35, comments: 18 },
  { day: 'Thu', likes: 48, reposts: 22, comments: 14 },
  { day: 'Fri', likes: 72, reposts: 41, comments: 22 },
  { day: 'Sat', likes: 89, reposts: 55, comments: 31 },
  { day: 'Sun', likes: 67, reposts: 38, comments: 24 },
];

// ── Post Actions data generators ─────────────────────────────────────────────
const getPostActionsDaily = () => [
  { day: 'Mon', likes: 45, reposts: 23, comments: 12, all3: 6 },
  { day: 'Tue', likes: 52, reposts: 28, comments: 15, all3: 8 },
  { day: 'Wed', likes: 61, reposts: 35, comments: 18, all3: 9 },
  { day: 'Thu', likes: 48, reposts: 22, comments: 14, all3: 5 },
  { day: 'Fri', likes: 72, reposts: 41, comments: 22, all3: 11 },
  { day: 'Sat', likes: 89, reposts: 55, comments: 31, all3: 14 },
  { day: 'Sun', likes: 67, reposts: 38, comments: 24, all3: 10 },
];

const getPostActionSuccessRates = () => [
  { action: 'Like',         rate: 94, done: 341, failed: 21, color: '#f472b6' },
  { action: 'Repost',       rate: 89, done: 178, failed: 22, color: '#00d4ff' },
  { action: 'Comment',      rate: 72, done: 89,  failed: 34, color: '#f59e0b' },
  { action: 'Like + Repost',rate: 91, done: 112, failed: 11, color: '#00ff41' },
  { action: 'All 3',        rate: 68, done: 42,  failed: 20, color: '#e879f9' },
];

const getPostActionsBreakdown = () => [
  { name: 'Like',          value: 341, color: '#f472b6' },
  { name: 'Repost',        value: 178, color: '#00d4ff' },
  { name: 'Comment',       value: 89,  color: '#f59e0b' },
  { name: 'Like+Repost',   value: 112, color: '#00ff41' },
  { name: 'All 3',         value: 42,  color: '#e879f9' },
];

const getPostActionsHourly = () => [
  { hour: '00', likes: 4,  reposts: 2,  comments: 1  },
  { hour: '04', likes: 2,  reposts: 1,  comments: 0  },
  { hour: '08', likes: 28, reposts: 14, comments: 8  },
  { hour: '10', likes: 45, reposts: 22, comments: 13 },
  { hour: '12', likes: 38, reposts: 19, comments: 11 },
  { hour: '14', likes: 52, reposts: 26, comments: 16 },
  { hour: '16', likes: 61, reposts: 31, comments: 19 },
  { hour: '18', likes: 43, reposts: 21, comments: 12 },
  { hour: '20', likes: 31, reposts: 15, comments: 7  },
  { hour: '22', likes: 18, reposts: 8,  comments: 4  },
];

const recentPostActions = [
  { time: '16:47:03', action: 'LIKE',    account: '@OliviaMartj6b', target: '@nasa/status/20650',    outcome: 'liked',                ok: true  },
  { time: '16:46:51', action: 'REPOST',  account: '@NoraMartinez',  target: '@techcrunch/status/4',  outcome: 'reposted',             ok: true  },
  { time: '16:46:38', action: 'COMMENT', account: '@PriyaShar8m',   target: '@elonmusk/status/1',    outcome: 'commented',            ok: true  },
  { time: '16:45:12', action: 'ALL 3',   account: '@RajPatel_x3m',  target: '@verge/status/8823',    outcome: 'liked+reposted+commented', ok: true },
  { time: '16:44:55', action: 'COMMENT', account: '@MariaGarcia7q', target: '@nasa/status/20650',    outcome: 'composer-not-found',   ok: false },
  { time: '16:43:41', action: 'LIKE',    account: '@AmaraOsei_bot', target: '@techcrunch/status/4',  outcome: 'already-liked',        ok: false },
  { time: '16:42:30', action: 'REPOST',  account: '@JamesLee_auto', target: '@elonmusk/status/1',    outcome: 'already-reposted',     ok: false },
  { time: '16:41:18', action: 'LIKE',    account: '@YukiTanaka_k',  target: '@verge/status/8823',    outcome: 'liked',                ok: true  },
];

// ── Component ─────────────────────────────────────────────────────────────────
export default function Analytics() {
  const [timeRange, setTimeRange] = useState('week');
  const [paTimeRange, setPaTimeRange] = useState('week');

  const deviceData      = getDeviceUsageData();
  const platformData    = getPlatformDistribution();
  const activityData    = getActivityOverTime();
  const successData     = getSuccessRateData();
  const performanceData = getPerformanceMetrics();
  const weeklyData      = getWeeklyTrend();
  const paDaily         = getPostActionsDaily();
  const paSuccessRates  = getPostActionSuccessRates();
  const paBreakdown     = getPostActionsBreakdown();
  const paHourly        = getPostActionsHourly();

  const totalAccounts  = credentials.length;
  const activeDevices  = devices.filter(d => d.status === 'available').length;
  const totalActions   = activityData.reduce((sum, d) => sum + d.actions, 0);
  const avgSuccessRate = Math.round(successData.reduce((sum, d) => sum + d.rate, 0) / successData.length);

  const totalLikes    = paDaily.reduce((s, d) => s + d.likes, 0);
  const totalReposts  = paDaily.reduce((s, d) => s + d.reposts, 0);
  const totalComments = paDaily.reduce((s, d) => s + d.comments, 0);
  const totalAll3     = paDaily.reduce((s, d) => s + d.all3, 0);

  const tooltipStyle = { backgroundColor: '#0d1117', border: '1px solid #1e2d3d', borderRadius: '8px', fontSize: 12 };
  const labelStyle   = { color: '#e6edf3' };

  return (
    <div className="min-h-screen bg-[#0a0e1a] p-6 space-y-8">

      {/* ── Header ─────────────────────────────────────────── */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Analytics Dashboard</h1>
        <p className="text-[#8b949e] text-sm font-mono">Real-time performance metrics and activity insights</p>
      </div>

      {/* ── KPI Cards ──────────────────────────────────────── */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-[#00ff41]/20 to-[#00ff41]/5 border border-[#00ff41]/30 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <Users className="text-[#00ff41]" size={24} />
            <span className="text-[#00ff41] text-xs font-mono bg-[#00ff41]/10 px-2 py-1 rounded">+12%</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{totalAccounts}</div>
          <div className="text-[#8b949e] text-sm font-mono">Total Accounts</div>
        </div>

        <div className="bg-gradient-to-br from-[#00d4ff]/20 to-[#00d4ff]/5 border border-[#00d4ff]/30 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <Smartphone className="text-[#00d4ff]" size={24} />
            <span className="text-[#00d4ff] text-xs font-mono bg-[#00d4ff]/10 px-2 py-1 rounded">{activeDevices}/{devices.length}</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{activeDevices}</div>
          <div className="text-[#8b949e] text-sm font-mono">Active Devices</div>
        </div>

        <div className="bg-gradient-to-br from-yellow-400/20 to-yellow-400/5 border border-yellow-400/30 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <Activity className="text-yellow-400" size={24} />
            <span className="text-yellow-400 text-xs font-mono bg-yellow-400/10 px-2 py-1 rounded">24h</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{totalActions}</div>
          <div className="text-[#8b949e] text-sm font-mono">Actions Today</div>
        </div>

        <div className="bg-gradient-to-br from-blue-400/20 to-blue-400/5 border border-blue-400/30 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <Zap className="text-blue-400" size={24} />
            <span className="text-blue-400 text-xs font-mono bg-blue-400/10 px-2 py-1 rounded">avg</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{avgSuccessRate}%</div>
          <div className="text-[#8b949e] text-sm font-mono">Success Rate</div>
        </div>
      </div>

      {/* ── Activity + Platform Row ─────────────────────────── */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-[#0d1117] border border-[#1e2d3d] rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white font-mono font-bold">Activity Over Time</h2>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-[#020408] border border-[#1e2d3d] rounded px-3 py-1 text-[#e6edf3] font-mono text-sm"
            >
              <option value="day">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={activityData}>
              <defs>
                <linearGradient id="colorActions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00ff41" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#00ff41" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#00d4ff" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2d3d" />
              <XAxis dataKey="hour" stroke="#8b949e" fontSize={12} />
              <YAxis stroke="#8b949e" fontSize={12} />
              <Tooltip contentStyle={tooltipStyle} labelStyle={labelStyle} />
              <Area type="monotone" dataKey="actions" stroke="#00ff41" fill="url(#colorActions)" strokeWidth={2} />
              <Area type="monotone" dataKey="success" stroke="#00d4ff" fill="url(#colorSuccess)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#0d1117] border border-[#1e2d3d] rounded-xl p-6">
          <h2 className="text-white font-mono font-bold mb-6">Platform Distribution</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={platformData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
                {platformData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 mt-4 justify-center">
            {platformData.map((p) => (
              <div key={p.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }} />
                <span className="text-[#8b949e] text-xs font-mono">{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Device + Weekly + Radar Row ────────────────────── */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-[#0d1117] border border-[#1e2d3d] rounded-xl p-6">
          <h2 className="text-white font-mono font-bold mb-6">Device Usage</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={deviceData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2d3d" />
              <XAxis type="number" stroke="#8b949e" fontSize={12} />
              <YAxis dataKey="name" type="category" stroke="#8b949e" fontSize={11} width={60} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="usage"    fill="#00ff41" radius={[0, 4, 4, 0]} />
              <Bar dataKey="capacity" fill="#1e2d3d" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#0d1117] border border-[#1e2d3d] rounded-xl p-6">
          <h2 className="text-white font-mono font-bold mb-6">Weekly Activity</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2d3d" />
              <XAxis dataKey="day" stroke="#8b949e" fontSize={12} />
              <YAxis stroke="#8b949e" fontSize={12} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
              <Line type="monotone" dataKey="likes"    stroke="#f472b6" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="reposts"  stroke="#00d4ff" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="comments" stroke="#f59e0b" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#0d1117] border border-[#1e2d3d] rounded-xl p-6">
          <h2 className="text-white font-mono font-bold mb-6">Performance Metrics</h2>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={performanceData}>
              <PolarGrid stroke="#1e2d3d" />
              <PolarAngleAxis dataKey="metric" stroke="#8b949e" fontSize={12} />
              <PolarRadiusAxis stroke="#1e2d3d" fontSize={10} />
              <Radar name="Performance" dataKey="value" stroke="#00d4ff" fill="#00d4ff" fillOpacity={0.3} />
              <Tooltip contentStyle={tooltipStyle} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Platform Success Rates ──────────────────────────── */}
      <div className="bg-[#0d1117] border border-[#1e2d3d] rounded-xl p-6">
        <h2 className="text-white font-mono font-bold mb-6">Platform Success Rates</h2>
        <div className="space-y-5">
          {successData.map((item) => (
            <div key={item.platform}>
              <div className="flex justify-between mb-2">
                <span className="text-[#e6edf3] font-mono text-sm">{item.platform}</span>
                <span className="text-[#8b949e] font-mono text-sm">{item.rate}% ({item.accounts} accounts)</span>
              </div>
              <div className="h-3 bg-[#1e2d3d] rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${item.rate}%`, background: 'linear-gradient(90deg, #00ff41, #00d4ff)' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════
          POST ACTIONS ANALYTICS
      ════════════════════════════════════════════════════════ */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="h-px flex-1 bg-[#1e2d3d]" />
          <span className="text-[#00ff41] font-mono font-bold text-xs uppercase tracking-[0.2em] px-3">
            Post Actions Analytics
          </span>
          <div className="h-px flex-1 bg-[#1e2d3d]" />
        </div>

        {/* Post Actions KPI Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-pink-500/20 to-pink-500/5 border border-pink-500/30 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <ThumbsUp className="text-pink-400" size={22} />
              <span className="text-pink-400 text-xs font-mono bg-pink-500/10 px-2 py-1 rounded">this week</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{totalLikes}</div>
            <div className="text-[#8b949e] text-sm font-mono">Likes Done</div>
          </div>

          <div className="bg-gradient-to-br from-[#00d4ff]/20 to-[#00d4ff]/5 border border-[#00d4ff]/30 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <Repeat2 className="text-[#00d4ff]" size={22} />
              <span className="text-[#00d4ff] text-xs font-mono bg-[#00d4ff]/10 px-2 py-1 rounded">this week</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{totalReposts}</div>
            <div className="text-[#8b949e] text-sm font-mono">Reposts Done</div>
          </div>

          <div className="bg-gradient-to-br from-amber-400/20 to-amber-400/5 border border-amber-400/30 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <MessageSquare className="text-amber-400" size={22} />
              <span className="text-amber-400 text-xs font-mono bg-amber-400/10 px-2 py-1 rounded">this week</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{totalComments}</div>
            <div className="text-[#8b949e] text-sm font-mono">Comments Done</div>
          </div>

          <div className="bg-gradient-to-br from-fuchsia-500/20 to-fuchsia-500/5 border border-fuchsia-500/30 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <Rocket className="text-fuchsia-400" size={22} />
              <span className="text-fuchsia-400 text-xs font-mono bg-fuchsia-500/10 px-2 py-1 rounded">all 3</span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{totalAll3}</div>
            <div className="text-[#8b949e] text-sm font-mono">All-3 Sessions</div>
          </div>
        </div>

        {/* Post Actions Charts Row 1 */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          {/* Daily Stacked Bar */}
          <div className="col-span-2 bg-[#0d1117] border border-[#1e2d3d] rounded-xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-white font-mono font-bold">Daily Actions Breakdown</h2>
              <select
                value={paTimeRange}
                onChange={(e) => setPaTimeRange(e.target.value)}
                className="bg-[#020408] border border-[#1e2d3d] rounded px-3 py-1 text-[#e6edf3] font-mono text-sm"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={paDaily} barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2d3d" />
                <XAxis dataKey="day" stroke="#8b949e" fontSize={12} />
                <YAxis stroke="#8b949e" fontSize={12} />
                <Tooltip contentStyle={tooltipStyle} labelStyle={labelStyle} />
                <Legend wrapperStyle={{ fontSize: 12, color: '#8b949e' }} />
                <Bar dataKey="likes"    fill="#f472b6" stackId="a" radius={[0,0,0,0]} name="Likes"    />
                <Bar dataKey="reposts"  fill="#00d4ff" stackId="a" radius={[0,0,0,0]} name="Reposts"  />
                <Bar dataKey="comments" fill="#f59e0b" stackId="a" radius={[0,0,0,0]} name="Comments" />
                <Bar dataKey="all3"     fill="#e879f9" stackId="a" radius={[4,4,0,0]} name="All 3"    />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Action Type Breakdown Donut */}
          <div className="bg-[#0d1117] border border-[#1e2d3d] rounded-xl p-6">
            <h2 className="text-white font-mono font-bold mb-4">Action Type Mix</h2>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={paBreakdown} cx="50%" cy="50%" innerRadius={45} outerRadius={72} paddingAngle={3} dataKey="value">
                  {paBreakdown.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(val: number) => [val, 'actions']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-2">
              {paBreakdown.map(d => (
                <div key={d.name} className="flex items-center gap-1.5 min-w-0">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                  <span className="text-[10px] font-mono text-[#8b949e] truncate">{d.name}</span>
                  <span className="text-[10px] font-mono text-[#e6edf3] ml-auto shrink-0">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Post Actions Charts Row 2 */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Hourly breakdown (area) */}
          <div className="bg-[#0d1117] border border-[#1e2d3d] rounded-xl p-6">
            <h2 className="text-white font-mono font-bold mb-5">Hourly Actions (Today)</h2>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={paHourly}>
                <defs>
                  <linearGradient id="gLikes"    x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#f472b6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f472b6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="gReposts"  x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#00d4ff" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00d4ff" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="gComments" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2d3d" />
                <XAxis dataKey="hour" stroke="#8b949e" fontSize={11} tickFormatter={v => `${v}:00`} />
                <YAxis stroke="#8b949e" fontSize={11} />
                <Tooltip contentStyle={tooltipStyle} labelStyle={labelStyle} labelFormatter={v => `${v}:00`} />
                <Legend wrapperStyle={{ fontSize: 12, color: '#8b949e' }} />
                <Area type="monotone" dataKey="likes"    stroke="#f472b6" fill="url(#gLikes)"    strokeWidth={2} name="Likes"    />
                <Area type="monotone" dataKey="reposts"  stroke="#00d4ff" fill="url(#gReposts)"  strokeWidth={2} name="Reposts"  />
                <Area type="monotone" dataKey="comments" stroke="#f59e0b" fill="url(#gComments)" strokeWidth={2} name="Comments" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Success rate per action type */}
          <div className="bg-[#0d1117] border border-[#1e2d3d] rounded-xl p-6">
            <h2 className="text-white font-mono font-bold mb-5">Success Rate by Action Type</h2>
            <div className="space-y-4">
              {paSuccessRates.map((item) => (
                <div key={item.action}>
                  <div className="flex justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-[#e6edf3] font-mono text-xs">{item.action}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[#8b949e] font-mono text-xs">{item.done} done · {item.failed} failed</span>
                      <span className="font-mono text-xs font-bold" style={{ color: item.color }}>{item.rate}%</span>
                    </div>
                  </div>
                  <div className="h-2.5 bg-[#1e2d3d] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${item.rate}%`, backgroundColor: item.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Post Actions Log */}
        <div className="bg-[#0d1117] border border-[#1e2d3d] rounded-xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <Clock className="text-[#00d4ff]" size={16} />
            <h2 className="text-white font-mono font-bold">Recent Post Actions</h2>
            <span className="text-[#8b949e] font-mono text-xs ml-auto">
              {recentPostActions.filter(r => r.ok).length}/{recentPostActions.length} succeeded
            </span>
          </div>
          <div className="space-y-1 font-mono text-xs">
            {/* Header */}
            <div className="grid grid-cols-[5rem_5rem_10rem_1fr_10rem_5rem] gap-3 px-3 py-1.5 text-[#8b949e] uppercase tracking-wider text-[10px] border-b border-[#1e2d3d]">
              <span>Time</span>
              <span>Action</span>
              <span>Account</span>
              <span>Target</span>
              <span>Outcome</span>
              <span>Status</span>
            </div>
            {recentPostActions.map((log, i) => (
              <div key={i}
                className="grid grid-cols-[5rem_5rem_10rem_1fr_10rem_5rem] gap-3 px-3 py-2 rounded hover:bg-[#111827] transition-colors items-center">
                <span className="text-[#8b949e] text-[11px]">{log.time}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold w-fit ${
                  log.action === 'LIKE'    ? 'bg-pink-500/20 text-pink-400' :
                  log.action === 'REPOST'  ? 'bg-cyan-500/20 text-cyan-400' :
                  log.action === 'COMMENT' ? 'bg-amber-500/20 text-amber-400' :
                  'bg-fuchsia-500/20 text-fuchsia-400'
                }`}>{log.action}</span>
                <span className="text-[#1D9BF0] truncate">{log.account}</span>
                <span className="text-[#8b949e] truncate text-[10px]">{log.target}</span>
                <span className={`truncate text-[10px] ${log.ok ? 'text-[#00d4ff]' : 'text-[#8b949e]'}`}>{log.outcome}</span>
                <span className={`text-[10px] font-bold ${log.ok ? 'text-[#00ff41]' : 'text-[#ff4444]'}`}>
                  {log.ok ? 'ok' : 'fail'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── General Recent Activity ─────────────────────────── */}
      <div className="bg-[#0d1117] border border-[#1e2d3d] rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="text-[#00d4ff]" size={18} />
          <h2 className="text-white font-mono font-bold">Recent Activity</h2>
        </div>
        <div className="space-y-1 font-mono text-sm">
          {[
            { time: '12:45:22', action: 'LIKE',   target: '@techcrunch', device: 'emulator-1', status: 'success' },
            { time: '12:44:18', action: 'REPOST', target: '@elonmusk',   device: 'emulator-2', status: 'success' },
            { time: '12:43:55', action: 'FOLLOW', target: '@nasa',       device: 'emulator-1', status: 'success' },
            { time: '12:42:10', action: 'LOGIN',  target: 'user_15',     device: 'emulator-3', status: 'failed'  },
            { time: '12:41:33', action: 'LIKE',   target: '@verge',      device: 'emulator-2', status: 'success' },
          ].map((log, i) => (
            <div key={i} className="flex items-center gap-4 py-2 px-3 hover:bg-[#111827] rounded">
              <span className="text-[#8b949e] text-xs w-20">{log.time}</span>
              <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                log.action === 'LIKE'   ? 'bg-pink-500/20 text-pink-400' :
                log.action === 'REPOST' ? 'bg-cyan-500/20 text-cyan-400' :
                log.action === 'FOLLOW' ? 'bg-green-500/20 text-green-400' :
                'bg-yellow-500/20 text-yellow-400'
              }`}>{log.action}</span>
              <span className="text-[#00d4ff]">{log.target}</span>
              <span className="text-[#8b949e]">{log.device}</span>
              <span className={log.status === 'success' ? 'text-[#00ff41]' : 'text-[#ff3333]'}>{log.status}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
