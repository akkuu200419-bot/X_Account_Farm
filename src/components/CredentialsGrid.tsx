import { useState, useEffect } from 'react';
import { Clipboard, ClipboardCheck, Shield, ShieldOff } from 'lucide-react';
import { credentials as mockCredentials, Credential } from '../data/mockData';
import { generateTOTP, secondsUntilNextWindow } from '../utils/totp';
import { supabase, DbAccount } from '../lib/supabase';

function dbToCredential(row: DbAccount): Credential {
  return {
    id: row.id,
    name: `${row.first_name} ${row.last_name}`.trim(),
    handle: row.handle ?? null,
    password: row.password ?? '',
    email: row.email ?? '',
    twoFaSecret: row.totp_secret ?? null,
    deviceId: row.device ?? '',
    createdAt: row.ts ?? '',
  };
}

interface CopyFieldProps {
  label: string;
  value: string | null;
  emptyText: string;
  onCopy: (msg: string) => void;
}

function CopyField({ label, value, emptyText, onCopy }: CopyFieldProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!value) return;
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      onCopy(`Copied ${label}`);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div className="flex items-center gap-2 group">
      <span className="text-[10px] font-mono text-gray-600 w-16 shrink-0 uppercase tracking-wide">{label}</span>
      <div className="flex-1 min-w-0 relative">
        <input
          readOnly
          value={value ?? ''}
          placeholder={emptyText}
          className={`w-full bg-[#080c14] border border-gray-800/60 rounded px-2 py-1 text-xs font-mono focus:outline-none ${
            value
              ? 'text-gray-300'
              : 'text-gray-600 italic placeholder-gray-700'
          } pr-7`}
        />
        {value && (
          <button
            onClick={handleCopy}
            className={`absolute right-1.5 top-1/2 -translate-y-1/2 transition-colors ${
              copied ? 'text-emerald-400' : 'text-gray-600 hover:text-[#1D9BF0] group-hover:text-gray-400'
            }`}
            title="Copy to clipboard"
          >
            {copied ? <ClipboardCheck size={11} /> : <Clipboard size={11} />}
          </button>
        )}
      </div>
    </div>
  );
}

function LiveCodeField({ secret, onCopy }: { secret: string; onCopy: (msg: string) => void }) {
  const [code, setCode] = useState('------');
  const [secs, setSecs] = useState(30);
  const [copied, setCopied] = useState(false);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const refresh = async () => {
      const newCode = await generateTOTP(secret);
      if (!cancelled) {
        setFlash(true);
        setCode(newCode);
        setTimeout(() => setFlash(false), 400);
      }
    };

    const tick = () => {
      const remaining = secondsUntilNextWindow();
      if (!cancelled) setSecs(remaining);
      if (remaining === 30) refresh();
    };

    refresh();
    const id = setInterval(tick, 1000);
    tick();
    return () => { cancelled = true; clearInterval(id); };
  }, [secret]);

  const pct = (secs / 30) * 100;
  const urgent = secs <= 5;

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      onCopy('Copied live TOTP code');
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-mono text-gray-600 w-16 shrink-0 uppercase tracking-wide">live code</span>
      <div
        className={`flex-1 flex items-center gap-2 bg-[#080c14] border rounded px-2 py-1 transition-all duration-300 ${
          urgent ? 'border-red-500/50' : 'border-emerald-500/30'
        } ${flash ? 'bg-cyan-500/10' : ''}`}
      >
        {/* Countdown ring */}
        <div className="relative shrink-0 w-5 h-5">
          <svg className="w-5 h-5 -rotate-90" viewBox="0 0 20 20">
            <circle cx="10" cy="10" r="8" fill="none" stroke="#1f2937" strokeWidth="2.5" />
            <circle
              cx="10" cy="10" r="8"
              fill="none"
              stroke={urgent ? '#ef4444' : '#10b981'}
              strokeWidth="2.5"
              strokeDasharray={`${2 * Math.PI * 8}`}
              strokeDashoffset={`${2 * Math.PI * 8 * (1 - pct / 100)}`}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
          </svg>
          <span className={`absolute inset-0 flex items-center justify-center text-[7px] font-mono font-bold ${urgent ? 'text-red-400' : 'text-emerald-400'}`}>
            {secs}
          </span>
        </div>

        {/* Code digits */}
        <span className={`font-mono text-sm font-bold tracking-[0.2em] transition-colors duration-300 ${
          urgent ? 'text-red-400' : flash ? 'text-cyan-300' : 'text-emerald-300'
        }`}>
          {code.slice(0, 3)} {code.slice(3)}
        </span>

        <button
          onClick={handleCopy}
          className={`ml-auto transition-colors ${copied ? 'text-emerald-400' : 'text-gray-600 hover:text-[#1D9BF0]'}`}
          title="Copy code"
        >
          {copied ? <ClipboardCheck size={11} /> : <Clipboard size={11} />}
        </button>
      </div>
    </div>
  );
}

interface CredCardProps {
  cred: Credential;
  onCopy: (msg: string) => void;
}

function CredCard({ cred, onCopy }: CredCardProps) {
  return (
    <div className="bg-[#0d1117] border border-gray-800/60 rounded-xl overflow-hidden hover:border-[#1D9BF0]/30 transition-all duration-200 hover:shadow-lg hover:shadow-[#1D9BF0]/5 group">
      {/* Card header */}
      <div className="px-4 py-3 border-b border-gray-800/60 flex items-center justify-between">
        <span className="text-sm font-semibold text-[#1D9BF0] group-hover:text-[#4eb8ff] transition-colors">
          {cred.name}
        </span>
        {cred.twoFaSecret ? (
          <Shield size={13} className="text-cyan-400" title="2FA enabled" />
        ) : (
          <ShieldOff size={13} className="text-gray-700" title="No 2FA" />
        )}
      </div>

      {/* Fields */}
      <div className="px-4 py-3 space-y-2">
        <CopyField label="handle" value={cred.handle} emptyText="(X-suggested)" onCopy={onCopy} />
        <CopyField label="password" value={cred.password} emptyText="(manual)" onCopy={onCopy} />
        <CopyField label="email" value={cred.email} emptyText="(manual)" onCopy={onCopy} />
        <CopyField label="2fa secret" value={cred.twoFaSecret} emptyText="(no 2FA enabled)" onCopy={onCopy} />
        {cred.twoFaSecret && (
          <LiveCodeField secret={cred.twoFaSecret} onCopy={onCopy} />
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-gray-800/40 bg-black/20">
        <span className="text-[10px] font-mono text-gray-600">
          device {cred.deviceId} · created {cred.createdAt}
        </span>
      </div>
    </div>
  );
}

interface CredentialsGridProps {
  onCopy: (msg: string) => void;
}

export default function CredentialsGrid({ onCopy }: CredentialsGridProps) {
  const [filter, setFilter] = useState<'all' | '2fa' | 'handle'>('all');
  const [credentials, setCredentials] = useState<Credential[]>(mockCredentials);
  const [fromDb, setFromDb] = useState(false);

  useEffect(() => {
    supabase
      .from('twitter_accounts')
      .select('*')
      .eq('status', 'ok')
      .order('ts', { ascending: false })
      .then(({ data }) => {
        if (data && data.length > 0) {
          setCredentials((data as DbAccount[]).map(dbToCredential));
          setFromDb(true);
        }
      });
  }, []);

  const filtered = credentials.filter((c) => {
    if (filter === '2fa') return c.twoFaSecret !== null;
    if (filter === 'handle') return c.handle !== null;
    return true;
  });

  return (
    <section id="creds" className="scroll-mt-20">
      <div className="bg-[#0d1117] border border-[#1D9BF0]/20 rounded-xl overflow-hidden shadow-xl shadow-blue-900/10">
        <div className="px-5 py-4 border-b border-[#1D9BF0]/15 flex flex-wrap items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-[#1D9BF0]" />
          <h2 className="text-sm font-semibold text-white tracking-wide uppercase">
            4 — X Credentials (copy-ready)
          </h2>
          <span className="text-xs font-mono text-gray-500">
            {filtered.length} working accounts below — click{' '}
            <Clipboard size={10} className="inline -mt-0.5" /> to copy
          </span>
          {fromDb && (
            <span className="text-[10px] font-mono text-emerald-500/70 border border-emerald-500/20 rounded px-1.5 py-0.5">
              supabase
            </span>
          )}

          {/* Filter pills */}
          <div className="ml-auto flex gap-1.5">
            {(['all', '2fa', 'handle'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-full text-xs font-mono transition-all ${
                  filter === f
                    ? 'bg-[#1D9BF0]/20 text-[#1D9BF0] border border-[#1D9BF0]/40'
                    : 'text-gray-600 hover:text-gray-400 border border-transparent'
                }`}
              >
                {f === 'all' ? `all (${credentials.length})` : f === '2fa' ? `2fa only (${credentials.filter((c) => c.twoFaSecret).length})` : `with handle (${credentials.filter((c) => c.handle).length})`}
              </button>
            ))}
          </div>
        </div>

        <div className="p-5">
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {filtered.map((cred) => (
              <CredCard key={cred.id} cred={cred} onCopy={onCopy} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
