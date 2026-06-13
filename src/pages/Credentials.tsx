import { useState, useEffect } from 'react';
import { Shield, Copy, Check, Eye, EyeOff, Search, ChevronLeft, ChevronRight, ShieldCheck, User, Smartphone, TrendingUp } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { credentials, Credential } from '../data/mockData';
import { supabase, DbAccount } from '../lib/supabase';
import { generateTOTP, secondsUntilNextWindow } from '../utils/totp';

const ITEMS_PER_PAGE = 15;

interface CopiedState {
  [key: string]: boolean;
}

interface VisiblePasswords {
  [key: string]: boolean;
}

const dbToCredential = (row: DbAccount): Credential => {
  return {
    id: row.id,
    name: `${row.first_name} ${row.last_name}`.trim(),
    handle: row.handle ?? null,
    password: row.password ?? '',
    email: row.email ?? '',
    ipAddress: '',
    twoFaSecret: row.totp_secret ?? null,
    deviceId: row.device ?? '',
    createdAt: row.ts ?? '',
  };
};

const TOTPDisplay = ({ secret, code }: { secret: string; code: string }) => {
  const [secondsLeft, setSecondsLeft] = useState<number>(secondsUntilNextWindow());
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft(secondsUntilNextWindow());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const progress = (secondsLeft / 30) * 100;

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1">
        <div className="relative inline-block">
          <svg width="60" height="60" viewBox="0 0 60 60" className="transform -rotate-90">
            <circle cx="30" cy="30" r="27" fill="none" stroke="#1e2d3d" strokeWidth="2" />
            <circle
              cx="30"
              cy="30"
              r="27"
              fill="none"
              stroke="#00ff41"
              strokeWidth="2"
              strokeDasharray={`${2 * Math.PI * 27}`}
              strokeDashoffset={`${2 * Math.PI * 27 * (1 - progress / 100)}`}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-mono text-xs font-bold text-[#00ff41]">{secondsLeft}s</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={code}
          readOnly
          className="w-32 px-3 py-2 bg-[#111827] border border-[#1e2d3d] text-[#00ff41] font-mono text-sm rounded"
        />
        <button
          onClick={handleCopy}
          className="p-2 bg-[#111827] border border-[#1e2d3d] text-[#00d4ff] hover:border-[#00d4ff]/60 rounded transition-all"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
      </div>
    </div>
  );
};

const CredentialCard = ({ credential }: { credential: Credential }) => {
  const [copiedFields, setCopiedFields] = useState<CopiedState>({});
  const [showPassword, setShowPassword] = useState(false);
  const [totp, setTotp] = useState<string>('');

  useEffect(() => {
    if (credential.twoFaSecret) {
      setTotp(generateTOTP(credential.twoFaSecret));
      const interval = setInterval(() => {
        setTotp(generateTOTP(credential.twoFaSecret!));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [credential.twoFaSecret]);

  const handleCopy = (field: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedFields(prev => ({ ...prev, [field]: true }));
    setTimeout(() => {
      setCopiedFields(prev => ({ ...prev, [field]: false }));
    }, 2000);
  };

  return (
    <div className="bg-[#0d1117] border border-[#1e2d3d] rounded p-5 hover:border-[#00ff41]/40 hover:shadow-[0_0_12px_rgba(0,255,65,0.1)] transition-all">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#1e2d3d]">
        <span className="text-[#00d4ff] font-mono font-bold text-sm">{credential.name}</span>
        {credential.twoFaSecret && <Shield size={14} className="text-[#00ff41]" />}
      </div>

      {/* Fields - Stacked vertically */}
      <div className="space-y-3 text-sm">
        {/* Handle */}
        {credential.handle && (
          <div className="flex flex-col gap-1">
            <label className="text-xs font-mono text-[#8b949e] uppercase">handle</label>
            <div className="flex gap-1">
              <input
                type="text"
                value={credential.handle}
                readOnly
                className="flex-1 px-3 py-2 bg-[#111827] border border-[#1e2d3d] text-[#e6edf3] font-mono text-sm rounded"
              />
              <button
                onClick={() => handleCopy('handle', credential.handle!)}
                className="p-2 bg-[#111827] border border-[#1e2d3d] text-[#00d4ff] hover:border-[#00d4ff]/60 rounded transition-all"
              >
                {copiedFields['handle'] ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
          </div>
        )}

        {/* Email */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-mono text-[#8b949e] uppercase">email</label>
          <div className="flex gap-1">
            <input
              type="text"
              value={credential.email}
              readOnly
              className="flex-1 px-3 py-2 bg-[#111827] border border-[#1e2d3d] text-[#e6edf3] font-mono text-sm rounded"
            />
            <button
              onClick={() => handleCopy('email', credential.email)}
              className="p-2 bg-[#111827] border border-[#1e2d3d] text-[#00d4ff] hover:border-[#00d4ff]/60 rounded transition-all"
            >
              {copiedFields['email'] ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
        </div>

        {/* Password with Eye toggle */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-mono text-[#8b949e] uppercase">password</label>
          <div className="flex gap-1">
            <input
              type={showPassword ? 'text' : 'password'}
              value={credential.password}
              readOnly
              className="flex-1 px-3 py-2 bg-[#111827] border border-[#1e2d3d] text-[#e6edf3] font-mono text-sm rounded"
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="p-2 bg-[#111827] border border-[#1e2d3d] text-[#8b949e] hover:text-[#e6edf3] hover:border-[#00d4ff]/60 rounded transition-all"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
            <button
              onClick={() => handleCopy('password', credential.password)}
              className="p-2 bg-[#111827] border border-[#1e2d3d] text-[#00d4ff] hover:border-[#00d4ff]/60 rounded transition-all"
            >
              {copiedFields['password'] ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
        </div>

        {/* IP Address */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-mono text-[#8b949e] uppercase">ip address</label>
          <div className="flex gap-1">
            <input
              type="text"
              value={credential.ipAddress}
              readOnly
              className="flex-1 px-3 py-2 bg-[#111827] border border-[#1e2d3d] text-[#e6edf3] font-mono text-sm rounded"
            />
            <button
              onClick={() => handleCopy('ip', credential.ipAddress)}
              className="p-2 bg-[#111827] border border-[#1e2d3d] text-[#00d4ff] hover:border-[#00d4ff]/60 rounded transition-all"
            >
              {copiedFields['ip'] ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
        </div>
      </div>

      {/* 2FA Section */}
      {credential.twoFaSecret && (
        <div className="mt-3 pt-3 border-t border-[#1e2d3d]">
          <label className="text-xs font-mono text-[#8b949e] tracking-widest uppercase">live 2fa code</label>
          <div className="mt-2">
            <TOTPDisplay secret={credential.twoFaSecret} code={totp} />
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-3 pt-3 border-t border-[#1e2d3d]">
        <p className="text-xs font-mono text-[#8b949e]">
          device: {credential.deviceId} · created: {credential.createdAt}
        </p>
      </div>
    </div>
  );
};

export default function Credentials() {
  const [allCredentials, setAllCredentials] = useState<Credential[]>(credentials);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isSupabase, setIsSupabase] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    const fetchFromSupabase = async () => {
      try {
        const { data, error } = await supabase!
          .from('twitter_accounts')
          .select('*')
          .eq('status', 'ok')
          .order('ts', { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          const dbCredentials = data.map(dbToCredential);
          setAllCredentials(dbCredentials);
          setIsSupabase(true);
        }
      } catch (error) {
        console.log('Using mock credentials:', error);
      }
    };

    fetchFromSupabase();
  }, []);

  // Filter by search query (email or IP)
  const filteredCredentials = allCredentials.filter(cred => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      cred.email.toLowerCase().includes(query) ||
      cred.ipAddress.toLowerCase().includes(query) ||
      cred.name.toLowerCase().includes(query) ||
      (cred.handle && cred.handle.toLowerCase().includes(query))
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredCredentials.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCredentials = filteredCredentials.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const counts = {
    all: allCredentials.length,
    '2fa': allCredentials.filter(c => c.twoFaSecret).length,
    handle: allCredentials.filter(c => c.handle).length,
  };

  // Analytics data
  const deviceMap: Record<string, number> = {};
  allCredentials.forEach(c => {
    deviceMap[c.deviceId] = (deviceMap[c.deviceId] || 0) + 1;
  });
  const deviceChartData = Object.entries(deviceMap)
    .map(([device, count]) => ({ device: device.slice(-8), count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const twoFaChartData = [
    { name: '2FA On', value: counts['2fa'], color: '#00d4ff' },
    { name: 'No 2FA', value: counts.all - counts['2fa'], color: '#1e2d3d' },
  ];

  const creationTrend: Record<string, number> = {};
  allCredentials.forEach(c => {
    const day = c.createdAt.slice(0, 10);
    if (day) creationTrend[day] = (creationTrend[day] || 0) + 1;
  });
  const trendData = Object.entries(creationTrend)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date: date.slice(5), count }));

  const uniqueDevices = Object.keys(deviceMap).length;
  const twoFaPct = counts.all > 0 ? Math.round((counts['2fa'] / counts.all) * 100) : 0;
  const handlePct = counts.all > 0 ? Math.round((counts.handle / counts.all) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#0a0e1a] p-8">
      {/* Analytics Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-mono font-bold text-[#e6edf3] mb-5">credentials</h1>

        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-4 mb-5">
          <div className="bg-gradient-to-br from-[#00ff41]/15 to-[#00ff41]/5 border border-[#00ff41]/30 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <User className="text-[#00ff41]" size={18} />
              {isSupabase && <span className="text-[10px] font-mono text-[#00ff41]/60 bg-[#00ff41]/10 px-1.5 py-0.5 rounded">live</span>}
            </div>
            <div className="text-3xl font-bold text-white leading-none">{counts.all}</div>
            <div className="text-[#8b949e] text-xs font-mono mt-1">Total Accounts</div>
          </div>

          <div className="bg-gradient-to-br from-[#00d4ff]/15 to-[#00d4ff]/5 border border-[#00d4ff]/30 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <ShieldCheck className="text-[#00d4ff]" size={18} />
              <span className="text-[10px] font-mono text-[#00d4ff] bg-[#00d4ff]/10 px-1.5 py-0.5 rounded">{twoFaPct}%</span>
            </div>
            <div className="text-3xl font-bold text-white leading-none">{counts['2fa']}</div>
            <div className="text-[#8b949e] text-xs font-mono mt-1">2FA Enabled</div>
          </div>

          <div className="bg-gradient-to-br from-yellow-400/15 to-yellow-400/5 border border-yellow-400/30 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="text-yellow-400" size={18} />
              <span className="text-[10px] font-mono text-yellow-400 bg-yellow-400/10 px-1.5 py-0.5 rounded">{handlePct}%</span>
            </div>
            <div className="text-3xl font-bold text-white leading-none">{counts.handle}</div>
            <div className="text-[#8b949e] text-xs font-mono mt-1">With Handle</div>
          </div>

          <div className="bg-gradient-to-br from-pink-400/15 to-pink-400/5 border border-pink-400/30 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <Smartphone className="text-pink-400" size={18} />
            </div>
            <div className="text-3xl font-bold text-white leading-none">{uniqueDevices}</div>
            <div className="text-[#8b949e] text-xs font-mono mt-1">Unique Devices</div>
          </div>
        </div>

        {/* Mini Charts */}
        <div className="grid grid-cols-3 gap-4">
          {/* Accounts per device */}
          <div className="bg-[#0d1117] border border-[#1e2d3d] rounded-xl p-4">
            <h3 className="text-[10px] font-mono text-[#8b949e] uppercase tracking-widest mb-3">Accounts per Device</h3>
            <ResponsiveContainer width="100%" height={110}>
              <BarChart data={deviceChartData} layout="vertical" margin={{ left: 0, right: 8, top: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2d3d" />
                <XAxis type="number" stroke="#8b949e" fontSize={10} />
                <YAxis dataKey="device" type="category" stroke="#8b949e" fontSize={9} width={58} />
                <Tooltip contentStyle={{ backgroundColor: '#0d1117', border: '1px solid #1e2d3d', borderRadius: '6px', fontSize: 11 }} />
                <Bar dataKey="count" fill="#00ff41" radius={[0, 3, 3, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* 2FA Coverage Pie */}
          <div className="bg-[#0d1117] border border-[#1e2d3d] rounded-xl p-4">
            <h3 className="text-[10px] font-mono text-[#8b949e] uppercase tracking-widest mb-3">2FA Coverage</h3>
            <ResponsiveContainer width="100%" height={110}>
              <PieChart>
                <Pie data={twoFaChartData} cx="50%" cy="50%" innerRadius={30} outerRadius={48} paddingAngle={3} dataKey="value">
                  {twoFaChartData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0d1117', border: '1px solid #1e2d3d', borderRadius: '6px', fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-1">
              {twoFaChartData.map(d => (
                <div key={d.name} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-[10px] font-mono text-[#8b949e]">{d.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Creation Trend */}
          <div className="bg-[#0d1117] border border-[#1e2d3d] rounded-xl p-4">
            <h3 className="text-[10px] font-mono text-[#8b949e] uppercase tracking-widest mb-3">Creation Trend</h3>
            <ResponsiveContainer width="100%" height={110}>
              <AreaChart data={trendData} margin={{ left: -20, right: 4, top: 4, bottom: 0 }}>
                <defs>
                  <linearGradient id="credGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2d3d" />
                <XAxis dataKey="date" stroke="#8b949e" fontSize={9} />
                <YAxis stroke="#8b949e" fontSize={9} />
                <Tooltip contentStyle={{ backgroundColor: '#0d1117', border: '1px solid #1e2d3d', borderRadius: '6px', fontSize: 11 }} />
                <Area type="monotone" dataKey="count" stroke="#00d4ff" fill="url(#credGrad)" strokeWidth={1.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="mb-6">
        {/* Stats (left) + Search (right) - Same Row */}
        <div className="flex items-center justify-between gap-4">
          {/* Stats - Left side */}
          <div className="flex items-center gap-3 text-xs font-mono">
            <div className="px-3 py-2 bg-[#0d1117] border border-[#1e2d3d] rounded">
              <span className="text-[#8b949e]">total:</span>{' '}
              <span className="text-[#00ff41] font-bold">{counts.all}</span>
            </div>
            <div className="px-3 py-2 bg-[#0d1117] border border-[#1e2d3d] rounded">
              <span className="text-[#8b949e]">2fa enabled:</span>{' '}
              <span className="text-[#00d4ff] font-bold">{counts['2fa']}</span>
            </div>
            <div className="px-3 py-2 bg-[#0d1117] border border-[#1e2d3d] rounded">
              <span className="text-[#8b949e]">with handle:</span>{' '}
              <span className="text-yellow-400 font-bold">{counts.handle}</span>
            </div>
            <div className="px-3 py-2 bg-[#0d1117] border border-[#1e2d3d] rounded text-[#8b949e]">
              {filteredCredentials.length} results
            </div>
          </div>

          {/* Search Bar - Right side */}
          <div className="relative w-[380px]">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b949e]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by email, IP, name, handle..."
              className="w-full pl-10 pr-4 py-2 bg-[#0d1117] border border-[#1e2d3d] text-[#e6edf3] font-mono text-sm rounded focus:outline-none focus:border-[#00d4ff] transition-all"
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {paginatedCredentials.map(credential => (
          <CredentialCard key={credential.id} credential={credential} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 bg-[#0d1117] border border-[#1e2d3d] text-[#e6edf3] rounded hover:border-[#00ff41]/60 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded font-mono text-sm transition-all ${
                  currentPage === page
                    ? 'bg-[#00ff41] text-[#0a0e1a] font-bold'
                    : 'bg-[#0d1117] border border-[#1e2d3d] text-[#e6edf3] hover:border-[#00ff41]/60'
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 bg-[#0d1117] border border-[#1e2d3d] text-[#e6edf3] rounded hover:border-[#00ff41]/60 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight size={18} />
          </button>

          <span className="ml-2 text-xs font-mono text-[#8b949e]">
            page {currentPage} of {totalPages}
          </span>
        </div>
      )}

      {filteredCredentials.length === 0 && (
        <div className="flex items-center justify-center h-64">
          <p className="text-[#8b949e] font-mono">no credentials match search</p>
        </div>
      )}
    </div>
  );
}
