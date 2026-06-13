import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, Legend, RadarChart,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { TrendingUp, Users, Smartphone, Activity, Zap, Clock } from 'lucide-react';
import { devices, credentials, outlooks } from '../data/mockData';

// Analytics data generators
const getDeviceUsageData = () => devices.map(d => ({
  name: d.serial.slice(-6),
  usage: d.used,
  capacity: d.cap,
  efficiency: Math.round((d.used / d.cap) * 100)
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
  { hour: '04:00', actions: 8, success: 7, failed: 1 },
  { hour: '08:00', actions: 45, success: 42, failed: 3 },
  { hour: '12:00', actions: 89, success: 85, failed: 4 },
  { hour: '16:00', actions: 120, success: 112, failed: 8 },
  { hour: '20:00', actions: 67, success: 63, failed: 4 },
];

const getSuccessRateData = () => [
  { platform: 'Twitter', rate: 94, accounts: 15 },
  { platform: 'Instagram', rate: 87, accounts: 5 },
  { platform: 'Facebook', rate: 91, accounts: 4 },
];

const getPerformanceMetrics = () => [
  { metric: 'Speed', value: 85 },
  { metric: 'Reliability', value: 92 },
  { metric: 'Accuracy', value: 88 },
  { metric: 'Uptime', value: 99 },
  { metric: 'Response', value: 76 },
];

const getWeeklyTrend = () => [
  { day: 'Mon', likes: 45, reposts: 23, follows: 12 },
  { day: 'Tue', likes: 52, reposts: 28, follows: 15 },
  { day: 'Wed', likes: 61, reposts: 35, follows: 18 },
  { day: 'Thu', likes: 48, reposts: 22, follows: 14 },
  { day: 'Fri', likes: 72, reposts: 41, follows: 22 },
  { day: 'Sat', likes: 89, reposts: 55, follows: 31 },
  { day: 'Sun', likes: 67, reposts: 38, follows: 24 },
];

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('week');
  const deviceData = getDeviceUsageData();
  const platformData = getPlatformDistribution();
  const activityData = getActivityOverTime();
  const successData = getSuccessRateData();
  const performanceData = getPerformanceMetrics();
  const weeklyData = getWeeklyTrend();

  const totalAccounts = credentials.length;
  const activeDevices = devices.filter(d => d.status === 'available').length;
  const totalActions = activityData.reduce((sum, d) => sum + d.actions, 0);
  const avgSuccessRate = Math.round(successData.reduce((sum, d) => sum + d.rate, 0) / successData.length);

  return (
    <div className="min-h-screen bg-[#0a0e1a] p-6">
      {/* Header with metrics */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
        <p className="text-[#8b949e] text-sm">Real-time performance metrics and activity insights</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
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

        <div className="bg-gradient-to-br from-purple-400/20 to-purple-400/5 border border-purple-400/30 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <Zap className="text-purple-400" size={24} />
            <span className="text-purple-400 text-xs font-mono bg-purple-400/10 px-2 py-1 rounded">avg</span>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{avgSuccessRate}%</div>
          <div className="text-[#8b949e] text-sm font-mono">Success Rate</div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* Activity Over Time */}
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
              <Tooltip
                contentStyle={{ backgroundColor: '#0d1117', border: '1px solid #1e2d3d', borderRadius: '8px' }}
                labelStyle={{ color: '#e6edf3' }}
              />
              <Area type="monotone" dataKey="actions" stroke="#00ff41" fill="url(#colorActions)" strokeWidth={2} />
              <Area type="monotone" dataKey="success" stroke="#00d4ff" fill="url(#colorSuccess)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Platform Distribution Pie */}
        <div className="bg-[#0d1117] border border-[#1e2d3d] rounded-xl p-6">
          <h2 className="text-white font-mono font-bold mb-6">Platform Distribution</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={platformData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {platformData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#0d1117', border: '1px solid #1e2d3d', borderRadius: '8px' }}
              />
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

      {/* Second Row */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* Device Usage Bar Chart */}
        <div className="bg-[#0d1117] border border-[#1e2d3d] rounded-xl p-6">
          <h2 className="text-white font-mono font-bold mb-6">Device Usage</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={deviceData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2d3d" />
              <XAxis type="number" stroke="#8b949e" fontSize={12} />
              <YAxis dataKey="name" type="category" stroke="#8b949e" fontSize={11} width={60} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0d1117', border: '1px solid #1e2d3d', borderRadius: '8px' }}
              />
              <Bar dataKey="usage" fill="#00ff41" radius={[0, 4, 4, 0]} />
              <Bar dataKey="capacity" fill="#1e2d3d" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly Activity */}
        <div className="bg-[#0d1117] border border-[#1e2d3d] rounded-xl p-6">
          <h2 className="text-white font-mono font-bold mb-6">Weekly Activity</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2d3d" />
              <XAxis dataKey="day" stroke="#8b949e" fontSize={12} />
              <YAxis stroke="#8b949e" fontSize={12} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0d1117', border: '1px solid #1e2d3d', borderRadius: '8px' }}
              />
              <Legend />
              <Line type="monotone" dataKey="likes" stroke="#ff3366" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="reposts" stroke="#00d4ff" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="follows" stroke="#00ff41" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Performance Radar */}
        <div className="bg-[#0d1117] border border-[#1e2d3d] rounded-xl p-6">
          <h2 className="text-white font-mono font-bold mb-6">Performance Metrics</h2>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={performanceData}>
              <PolarGrid stroke="#1e2d3d" />
              <PolarAngleAxis dataKey="metric" stroke="#8b949e" fontSize={12} />
              <PolarRadiusAxis stroke="#1e2d3d" fontSize={10} />
              <Radar name="Performance" dataKey="value" stroke="#00d4ff" fill="#00d4ff" fillOpacity={0.3} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0d1117', border: '1px solid #1e2d3d', borderRadius: '8px' }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Success Rate Bars */}
      <div className="bg-[#0d1117] border border-[#1e2d3d] rounded-xl p-6">
        <h2 className="text-white font-mono font-bold mb-6">Platform Success Rates</h2>
        <div className="space-y-6">
          {successData.map((item) => (
            <div key={item.platform}>
              <div className="flex justify-between mb-2">
                <span className="text-[#e6edf3] font-mono text-sm">{item.platform}</span>
                <span className="text-[#8b949e] font-mono text-sm">{item.rate}% ({item.accounts} accounts)</span>
              </div>
              <div className="h-4 bg-[#1e2d3d] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${item.rate}%`,
                    background: `linear-gradient(90deg, #00ff41, #00d4ff)`
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity Log */}
      <div className="mt-6 bg-[#0d1117] border border-[#1e2d3d] rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="text-[#00d4ff]" size={18} />
          <h2 className="text-white font-mono font-bold">Recent Activity</h2>
        </div>
        <div className="space-y-2 font-mono text-sm">
          {[
            { time: '12:45:22', action: 'LIKE', target: '@techcrunch', device: 'emulator-1', status: 'success' },
            { time: '12:44:18', action: 'REPOST', target: '@elonmusk', device: 'emulator-2', status: 'success' },
            { time: '12:43:55', action: 'FOLLOW', target: '@nasa', device: 'emulator-1', status: 'success' },
            { time: '12:42:10', action: 'LOGIN', target: 'user_15', device: 'emulator-3', status: 'failed' },
            { time: '12:41:33', action: 'LIKE', target: '@verge', device: 'emulator-2', status: 'success' },
          ].map((log, i) => (
            <div key={i} className="flex items-center gap-4 py-2 px-3 hover:bg-[#111827] rounded">
              <span className="text-[#8b949e] text-xs w-20">{log.time}</span>
              <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                log.action === 'LIKE' ? 'bg-pink-500/20 text-pink-400' :
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
