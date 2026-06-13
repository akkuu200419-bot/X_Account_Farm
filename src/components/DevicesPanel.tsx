import { devices, Device } from '../data/mockData';
import { Cpu, Smartphone, CheckCircle, XCircle, ShieldCheck, ShieldOff } from 'lucide-react';

function TypeBadge({ type }: { type: Device['type'] }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-mono font-medium ${
        type === 'emulator'
          ? 'bg-pink-500/15 text-pink-400 border border-pink-500/30'
          : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
      }`}
    >
      {type === 'emulator' ? <Cpu size={10} /> : <Smartphone size={10} />}
      {type}
    </span>
  );
}

function StatusPill({ status }: { status: Device['status'] }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
        status === 'available'
          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
          : 'bg-red-500/15 text-red-400 border border-red-500/30'
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          status === 'available' ? 'bg-emerald-400 animate-pulse' : 'bg-red-500'
        }`}
      />
      {status}
    </span>
  );
}

function CapBar({ used, cap }: { used: number; cap: number }) {
  const pct = cap > 0 ? (used / cap) * 100 : 0;
  const color = pct >= 100 ? 'bg-red-500' : pct >= 66 ? 'bg-amber-500' : 'bg-cyan-500';
  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-xs text-gray-300">{used}/{cap}</span>
      <div className="w-12 h-1.5 bg-gray-800 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function DevicesPanel() {
  return (
    <section id="devices" className="scroll-mt-20">
      <div className="bg-[#0d1117] border border-[#1D9BF0]/20 rounded-xl overflow-hidden shadow-xl shadow-blue-900/10">
        <div className="px-5 py-4 border-b border-[#1D9BF0]/15 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-[#1D9BF0] animate-pulse" />
          <h2 className="text-sm font-semibold text-white tracking-wide uppercase">
            1 — Connected Devices
          </h2>
          <span className="ml-auto text-xs font-mono text-gray-500">{devices.length} devices</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800/60">
                {['Serial', 'Model', 'Android', 'X Installed', 'Logged-in X Handles', 'Used / Cap', 'Status', '2FA'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {devices.map((d, i) => (
                <tr
                  key={d.serial}
                  className={`border-b border-gray-800/40 transition-colors hover:bg-[#1D9BF0]/5 ${
                    i % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.01]'
                  }`}
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-gray-300">{d.serial}</span>
                      <TypeBadge type={d.type} />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-300 text-xs whitespace-nowrap">{d.model}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-400">{d.androidVersion}</td>
                  <td className="px-4 py-3">
                    {d.xInstalled ? (
                      <CheckCircle size={16} className="text-emerald-400" />
                    ) : (
                      <XCircle size={16} className="text-red-500/60" />
                    )}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-400">
                    {d.handles.length === 0 ? (
                      <span className="text-gray-600 italic">(none)</span>
                    ) : (
                      d.handles.join(', ')
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <CapBar used={d.used} cap={d.cap} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill status={d.status} />
                  </td>
                  <td className="px-4 py-3">
                    {d.has2fa ? (
                      <ShieldCheck size={15} className="text-cyan-400" />
                    ) : (
                      <ShieldOff size={15} className="text-gray-600" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
