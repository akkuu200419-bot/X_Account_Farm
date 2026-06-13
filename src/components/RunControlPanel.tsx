import { useState, useEffect } from 'react';
import { Play, Square, ChevronDown, Zap, Server, Wifi, WifiOff } from 'lucide-react';
import { outlooks, devices } from '../data/mockData';
import { fetchStatus, postRun, postRunAll, postRunAllDevices, getStop, FlaskStatus } from '../lib/flaskApi';

interface NumberSpinnerProps {
  label: string;
  sub?: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}

function NumberSpinner({ label, sub, value, min, max, onChange }: NumberSpinnerProps) {
  return (
    <div className="flex items-center gap-3">
      <div>
        <span className="text-xs text-gray-400">{label}</span>
        {sub && <span className="text-xs text-gray-600 ml-1">{sub}</span>}
      </div>
      <div className="flex items-center border border-gray-700/60 rounded-lg overflow-hidden bg-[#080c14]">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          className="px-2.5 py-1.5 text-gray-400 hover:text-white hover:bg-[#1D9BF0]/20 transition-colors text-sm font-mono"
        >
          −
        </button>
        <span className="px-3 py-1.5 text-sm font-mono text-gray-200 min-w-[2.5rem] text-center border-x border-gray-700/60">
          {value}
        </span>
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          className="px-2.5 py-1.5 text-gray-400 hover:text-white hover:bg-[#1D9BF0]/20 transition-colors text-sm font-mono"
        >
          +
        </button>
      </div>
    </div>
  );
}

interface SelectProps {
  options: { value: string; label: string; sub?: string }[];
  placeholder?: string;
  value: string | null;
  onChange: (v: string) => void;
  disabled?: boolean;
}

function Select({ options, placeholder, value, onChange, disabled }: SelectProps) {
  const [open, setOpen] = useState(false);
  const current = options.find((o) => o.value === value);

  return (
    <div className="relative">
      <button
        onClick={() => !disabled && setOpen(!open)}
        disabled={disabled}
        className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 bg-[#080c14] border rounded-lg text-sm text-left transition-colors focus:outline-none ${
          disabled
            ? 'border-gray-800/40 text-gray-700 cursor-not-allowed'
            : 'border-gray-700/60 hover:border-[#1D9BF0]/40 focus:border-[#1D9BF0]/60'
        }`}
      >
        <span className={current ? 'text-gray-200 font-mono text-xs' : 'text-gray-600 text-xs'}>
          {current ? current.label : placeholder || 'Select...'}
        </span>
        <ChevronDown size={14} className={`text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute z-30 top-full left-0 right-0 mt-1 bg-[#0d1117] border border-gray-700/60 rounded-lg shadow-2xl shadow-black/50 max-h-52 overflow-y-auto">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className="w-full text-left px-3 py-2.5 hover:bg-[#1D9BF0]/10 transition-colors border-b border-gray-800/40 last:border-0"
            >
              <div className="font-mono text-xs text-gray-200">{opt.label}</div>
              {opt.sub && <div className="text-xs text-gray-500 mt-0.5">{opt.sub}</div>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function RunControlPanel() {
  const [status, setStatus] = useState<FlaskStatus | null>(null);
  const [backendOnline, setBackendOnline] = useState(false);
  const [cap, setCap] = useState(3);
  const [batch, setBatch] = useState(3);
  const [gap, setGap] = useState(60);
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [selectedAllDevice, setSelectedAllDevice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const running = status?.running ?? false;

  // Poll Flask /status every 3s
  useEffect(() => {
    let mounted = true;
    const poll = async () => {
      const s = await fetchStatus();
      if (!mounted) return;
      setBackendOnline(s !== null);
      if (s) setStatus(s);
    };
    poll();
    const id = setInterval(poll, 3000);
    return () => { mounted = false; clearInterval(id); };
  }, []);

  const outlookOptions = outlooks
    .filter((o) => o.status !== 'unavailable')
    .map((o) => ({
      value: `${o.name.split(' ')[0]}|${o.name.split(' ')[1] ?? ''}`,
      label: `${o.name} (${o.email})`,
      sub: `status: ${o.status}`,
    }));

  const deviceOptions = devices
    .filter((d) => d.status === 'available')
    .map((d) => ({
      value: d.serial,
      label: d.serial,
      sub: `${d.model} · ${d.used}/${d.cap} used`,
    }));

  const handleRun = async () => {
    if (!selectedRow || !selectedDevice || busy) return;
    setBusy(true);
    await postRun(selectedRow, selectedDevice);
    setBusy(false);
    // status will update on next poll
  };

  const handleStop = async () => {
    if (busy) return;
    setBusy(true);
    await getStop();
    setBusy(false);
  };

  const handleRunAll = async () => {
    if (!selectedAllDevice || busy) return;
    setBusy(true);
    await postRunAll(selectedAllDevice, cap, batch, gap);
    setBusy(false);
  };

  const handleRunAllDevices = async () => {
    if (busy) return;
    setBusy(true);
    await postRunAllDevices(cap, batch, gap);
    setBusy(false);
  };

  return (
    <section id="run" className="scroll-mt-20">
      <div className="bg-[#0d1117] border border-[#1D9BF0]/20 rounded-xl overflow-hidden shadow-xl shadow-blue-900/10">
        <div className="px-5 py-4 border-b border-[#1D9BF0]/15 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <h2 className="text-sm font-semibold text-white tracking-wide uppercase">
            2 — Pick a Row + Device, then Run
          </h2>
          {/* Backend connection indicator */}
          <div className={`ml-auto flex items-center gap-1.5 text-xs font-mono ${backendOnline ? 'text-emerald-400' : 'text-gray-600'}`}>
            {backendOnline ? <Wifi size={11} /> : <WifiOff size={11} />}
            {backendOnline ? 'backend live' : 'backend offline'}
          </div>
        </div>

        <div className="p-5 space-y-6">
          {/* Running indicator banner */}
          {running && status && (
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-sm font-mono text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              Running — <span className="text-white">{status.first} {status.last}</span>
              {status.serial && <span className="text-emerald-500">on {status.serial}</span>}
            </div>
          )}

          {/* Single run */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wide">Outlook row</label>
              <Select
                options={outlookOptions}
                placeholder="Select outlook account..."
                value={selectedRow}
                onChange={setSelectedRow}
                disabled={running}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wide">Target device</label>
              <Select
                options={deviceOptions}
                placeholder="Select device..."
                value={selectedDevice}
                onChange={setSelectedDevice}
                disabled={running}
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {running ? (
              <button
                onClick={handleStop}
                disabled={busy}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm bg-red-600/20 border border-red-500/40 text-red-400 hover:bg-red-600/30 transition-all duration-200 disabled:opacity-50"
              >
                <Square size={14} />
                Stop
              </button>
            ) : (
              <button
                onClick={handleRun}
                disabled={!selectedRow || !selectedDevice || busy || !backendOnline}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm bg-[#1D9BF0] hover:bg-[#1a8cd8] text-white shadow-lg shadow-[#1D9BF0]/20 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Play size={14} />
                Run
              </button>
            )}
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${running ? 'bg-emerald-400 animate-pulse' : 'bg-gray-600'}`} />
              <span className="text-xs font-mono text-gray-500">{running ? 'running' : 'idle'}</span>
            </div>
          </div>

          <p className="text-xs text-gray-600 -mt-2">
            The script auto-launches the row's Outlook session on port 9845 + signs in. No need to pre-click "Open Outlook" anymore.
          </p>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-800" />
            </div>
            <div className="relative flex justify-start">
              <span className="bg-[#0d1117] pr-3 text-xs text-gray-600 uppercase tracking-wider">
                Run ALL eligible rows on a device
              </span>
            </div>
          </div>

          {/* Batch run */}
          <div>
            <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wide">Device</label>
            <Select
              options={deviceOptions}
              placeholder="Select device..."
              value={selectedAllDevice}
              onChange={setSelectedAllDevice}
              disabled={running}
            />
          </div>

          <div className="flex flex-wrap gap-6 items-center">
            <NumberSpinner label="Per-device cap" sub="(total accounts)" value={cap} min={1} max={10} onChange={setCap} />
            <NumberSpinner label="Batch size" sub="(per burst)" value={batch} min={1} max={10} onChange={setBatch} />
            <NumberSpinner label="Gap between bursts" sub="(seconds)" value={gap} min={10} max={3600} onChange={setGap} />
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleRunAll}
              disabled={!selectedAllDevice || running || busy || !backendOnline}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#1D9BF0] hover:bg-[#1a8cd8] text-white font-semibold text-sm rounded-lg shadow-lg shadow-[#1D9BF0]/20 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Zap size={14} />
              Run All
            </button>
            <button
              onClick={handleRunAllDevices}
              disabled={running || busy || !backendOnline}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#1D9BF0]/15 hover:bg-[#1D9BF0]/25 border border-[#1D9BF0]/40 text-[#1D9BF0] font-semibold text-sm rounded-lg transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Server size={14} />
              Run on ALL devices
            </button>
          </div>

          <p className="text-xs text-gray-600 leading-relaxed border-t border-gray-800/60 pt-4">
            <span className="text-gray-500">Run All</span> = the chosen device only.{' '}
            <span className="text-gray-500">Run on ALL devices</span> = loop through every plugged-in non-emulator phone that
            still has free capacity. With cap=1 that yields exactly one account per phone before moving on. With batch=3 / gap=60,
            runs 3 accounts then sleeps 60s — bump gap to 3600 for a 1-hour anti-throttle pause.
          </p>
        </div>
      </div>
    </section>
  );
}
