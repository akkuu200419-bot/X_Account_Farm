import { useState, useEffect, useRef } from 'react';
import { initialLogs, LogEntry } from '../data/mockData';
import { fetchLog, fetchStatus } from '../lib/flaskApi';
import { Terminal, MonitorSmartphone } from 'lucide-react';

function PhoneFrame() {
  return (
    <div className="flex flex-col items-center">
      <div className="w-full rounded-t-[2rem] bg-white flex justify-between items-center px-5 py-2 text-[10px] text-gray-700 font-semibold">
        <span>4:17</span>
        <div className="flex items-center gap-1">
          <svg width="14" height="10" viewBox="0 0 14 10"><rect x="0" y="4" width="2" height="6" rx="0.5" fill="#333"/><rect x="3" y="2.5" width="2" height="7.5" rx="0.5" fill="#333"/><rect x="6" y="1" width="2" height="9" rx="0.5" fill="#333"/><rect x="9" y="0" width="2" height="10" rx="0.5" fill="#333"/><rect x="12.5" y="1.5" width="1" height="7" rx="0.5" fill="#ccc"/></svg>
          <svg width="12" height="10" viewBox="0 0 12 10"><path d="M6 2C8.2 2 10.2 3 11.5 4.6L12 4L10.8 2.8C9.2 1 7.7 0 6 0S2.8 1 1.2 2.8L0 4l.5.6C1.8 3 3.8 2 6 2z" fill="#333"/><path d="M6 4.5c1.1 0 2.1.5 2.8 1.2L10 4.5C9 3.5 7.6 3 6 3s-3 .5-4 1.5l1.2 1.2C3.9 5 4.9 4.5 6 4.5z" fill="#333"/><circle cx="6" cy="7.5" r="1.5" fill="#333"/></svg>
          <svg width="22" height="11" viewBox="0 0 22 11"><rect x="0" y="1" width="19" height="9" rx="2" stroke="#333" strokeWidth="1" fill="none"/><rect x="1.5" y="2.5" width="14" height="6" rx="1" fill="#22c55e"/><rect x="20" y="3.5" width="1.5" height="4" rx="1" fill="#333"/></svg>
        </div>
      </div>
      <div className="w-full bg-white flex-1 px-4 py-3 space-y-3 overflow-hidden">
        <div className="text-gray-800 text-lg">←</div>
        <div>
          <h3 className="text-gray-900 font-bold text-lg leading-tight">Follow the top posters</h3>
          <p className="text-gray-500 text-xs mt-0.5">Follow 1 pack or more to continue</p>
        </div>
        <div className="border border-gray-200 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-full overflow-hidden">
              <img src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?w=40&h=40&fit=crop" alt="" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-gray-900 text-xs font-semibold leading-tight">Food Media</p>
              <p className="text-gray-400 text-[10px]">Recipes, dining news, and trusted culinary storytelling.</p>
            </div>
          </div>
          <button className="w-full bg-gray-900 text-white text-xs font-bold py-1.5 rounded-full">Follow 10</button>
        </div>
        {[
          { name: 'Food52', handle: '@Food52' },
          { name: 'Eric Ripert ✓', handle: '@ericripert' },
          { name: 'vir sanghvi', handle: '@virsanghvi' },
        ].map((item) => (
          <div key={item.handle} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-gray-900 text-xs font-semibold truncate">{item.name}</p>
              <p className="text-gray-400 text-[10px] truncate">{item.handle}</p>
            </div>
            <button className="text-xs font-bold border border-gray-900 text-gray-900 px-3 py-0.5 rounded-full">Follow</button>
          </div>
        ))}
      </div>
      <div className="w-full bg-gray-100 rounded-b-[2rem] px-8 py-3 flex justify-between items-center text-gray-500">
        <span className="text-base">‹</span><span className="text-base">○</span><span className="text-base">□</span>
      </div>
    </div>
  );
}

function classifyLine(msg: string): LogEntry['type'] {
  if (msg.startsWith('---') || msg.startsWith('===')) {
    if (msg.includes('DONE') || msg.includes('done')) return 'done';
    return 'step';
  }
  if (/error|exception|failed|FAIL/i.test(msg)) return 'error';
  if (/shot →|screenshot/i.test(msg)) return 'shot';
  return 'info';
}

function parseLogText(raw: string): LogEntry[] {
  return raw
    .split('\n')
    .filter(Boolean)
    .map((line, i) => {
      const tsMatch = line.match(/^\[(\d{2}:\d{2}:\d{2})\]\s*/);
      const timestamp = tsMatch ? tsMatch[1] : '';
      const message = tsMatch ? line.slice(tsMatch[0].length) : line;
      return {
        id: `live-${i}`,
        timestamp,
        message,
        type: classifyLine(message),
        deviceId: '',
      };
    });
}

function logLineColor(type: LogEntry['type']) {
  switch (type) {
    case 'step': return 'text-cyan-400';
    case 'done': return 'text-emerald-400 font-semibold';
    case 'error': return 'text-red-400';
    case 'shot': return 'text-yellow-500/80';
    default: return 'text-green-400';
  }
}

export default function LiveLogPanel() {
  const [logs, setLogs] = useState<LogEntry[]>(initialLogs);
  const [liveSerial, setLiveSerial] = useState<string | null>(null);
  const [backendOnline, setBackendOnline] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Poll Flask /log and /status every 3s
  useEffect(() => {
    let mounted = true;
    let prevText = '';

    const poll = async () => {
      const [logText, status] = await Promise.all([fetchLog(600), fetchStatus()]);
      if (!mounted) return;

      setBackendOnline(status !== null);
      if (status?.serial) setLiveSerial(status.serial);

      if (logText !== null && logText !== prevText) {
        prevText = logText;
        const parsed = parseLogText(logText);
        if (parsed.length > 0) setLogs(parsed);
      }
    };

    poll();
    const id = setInterval(poll, 3000);
    return () => { mounted = false; clearInterval(id); };
  }, []);

  return (
    <section id="log" className="scroll-mt-20">
      <div className="bg-[#0d1117] border border-[#1D9BF0]/20 rounded-xl overflow-hidden shadow-xl shadow-blue-900/10">
        <div className="px-5 py-4 border-b border-[#1D9BF0]/15 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <h2 className="text-sm font-semibold text-white tracking-wide uppercase">
            3 — Live Log + Last Screenshot
          </h2>
          <div className={`ml-auto flex items-center gap-1.5 text-xs font-mono ${backendOnline ? 'text-emerald-400' : 'text-gray-600'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${backendOnline ? 'bg-emerald-400 animate-pulse' : 'bg-gray-600'}`} />
            {backendOnline ? 'live feed' : 'offline — showing demo log'}
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_300px] gap-0 divide-x divide-gray-800/60">
          {/* Terminal */}
          <div className="relative">
            <div className="flex items-center gap-2 px-4 py-2 bg-black/40 border-b border-gray-800/60">
              <Terminal size={12} className="text-gray-600" />
              <span className="text-xs font-mono text-gray-600">
                {backendOnline ? '/tmp/twitter_ui_run.log' : 'adb logcat — demo'}
              </span>
              <div className="ml-auto flex gap-1.5">
                {['bg-red-500', 'bg-yellow-500', 'bg-green-500'].map((c) => (
                  <div key={c} className={`w-2.5 h-2.5 rounded-full ${c} opacity-60`} />
                ))}
              </div>
            </div>
            <div
              className="bg-[#020408] p-4 h-96 overflow-y-auto font-mono text-xs leading-relaxed relative"
              style={{ scrollbarWidth: 'thin', scrollbarColor: '#1D9BF0 #020408' }}
            >
              <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
                style={{
                  backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,255,65,0.1) 1px, rgba(0,255,65,0.1) 2px)',
                  backgroundSize: '100% 2px',
                }} />
              {logs.map((log) => (
                <div key={log.id} className="flex gap-3 group hover:bg-white/[0.02] px-1 -mx-1 rounded">
                  <span className="text-gray-600 shrink-0 select-none">[{log.timestamp}]</span>
                  <span className={`${logLineColor(log.type)} break-all`}>{log.message}</span>
                </div>
              ))}
              <div ref={logEndRef} />
            </div>
          </div>

          {/* Screenshot viewer */}
          <div className="p-4 bg-[#080c14]">
            <div className="flex items-center gap-2 mb-4">
              <MonitorSmartphone size={13} className="text-gray-500" />
              <span className="text-xs font-mono text-gray-500">
                last shot ({liveSerial ?? '021ac3e7'})
              </span>
            </div>
            <div className="mx-auto max-w-[200px]">
              <div className="bg-gray-900 rounded-[2.5rem] p-2 shadow-2xl shadow-black/60 border border-gray-700/40">
                <div className="bg-black rounded-t-[2rem] px-2">
                  <div className="mx-auto w-16 h-5 bg-black rounded-b-xl flex items-center justify-center">
                    <div className="w-10 h-1.5 bg-gray-800 rounded-full" />
                  </div>
                </div>
                <div className="overflow-hidden rounded-b-[2rem]">
                  <PhoneFrame />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
