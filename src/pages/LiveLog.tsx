import { useState, useEffect, useRef } from 'react';
import { fetchLog, fetchStatus } from '../lib/flaskApi';
import { initialLogs, LogEntry } from '../data/mockData';

function classifyLine(msg: string): LogEntry['type'] {
  if (/---/.test(msg) || /===/.test(msg)) {
    if (/DONE|done/.test(msg)) return 'done';
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
      const m = line.match(/^\[(\d{2}:\d{2}:\d{2})\]\s*/);
      const timestamp = m ? m[1] : '';
      const message = m ? line.slice(m[0].length) : line;
      return { id: `live-${i}`, timestamp, message, type: classifyLine(message), deviceId: '' };
    });
}

const LOG_COLORS: Record<LogEntry['type'], string> = {
  step: 'text-[#00d4ff]',
  done: 'text-[#00ff41] font-bold',
  error: 'text-[#ff3333]',
  shot: 'text-yellow-400',
  info: 'text-[#00ff41]',
};

export default function LiveLog() {
  const [logs, setLogs] = useState<LogEntry[]>(initialLogs);
  const [backendLive, setBackendLive] = useState(false);
  const [activeSerial, setActiveSerial] = useState<string>('021ac3e7');
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let prevText = '';
    const poll = async () => {
      const [logText, status] = await Promise.all([fetchLog(600), fetchStatus()]);
      setBackendLive(status !== null);
      if (status?.serial) setActiveSerial(status.serial);
      if (logText !== null && logText !== prevText) {
        prevText = logText;
        const parsed = parseLogText(logText);
        if (parsed.length > 0) setLogs(parsed);
      }
    };
    poll();
    const id = setInterval(poll, 3000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="min-h-screen bg-[#0a0e1a] p-6">
      <div className="grid grid-cols-[1fr_300px] gap-6 h-[calc(100vh-6rem)]">
        {/* LEFT: TERMINAL */}
        <div className="flex flex-col min-h-0">
          {/* Mac-style header */}
          <div className="bg-[#111827] border border-[#1e2d3d] rounded-t-lg px-4 py-2.5 flex items-center justify-between">
            <span className="font-mono text-xs text-[#8b949e]">
              {backendLive ? '/tmp/twitter_ui_run.log' : 'demo — /tmp/twitter_ui_run.log'}
            </span>
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#ff3333] opacity-80" />
              <div className="w-3 h-3 rounded-full bg-yellow-400 opacity-80" />
              <div className="w-3 h-3 rounded-full bg-[#00ff41] opacity-80" />
            </div>
          </div>

          {/* Log lines */}
          <div
            className="flex-1 min-h-0 bg-[#020408] border border-t-0 border-[#1e2d3d] rounded-b-lg overflow-y-auto p-4 font-mono text-xs leading-5 space-y-0.5"
            style={{ scrollbarWidth: 'thin', scrollbarColor: '#1e2d3d #020408' }}
          >
            {/* Scanline overlay */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.03]"
              style={{ backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 1px,rgba(0,255,65,0.1) 1px,rgba(0,255,65,0.1) 2px)', backgroundSize: '100% 2px' }}
            />
            {logs.map((log) => (
              <div key={log.id} className="flex gap-3 hover:bg-white/[0.02] -mx-1 px-1 rounded">
                <span className="text-[#374151] shrink-0 select-none">[{log.timestamp}]</span>
                <span className={`${LOG_COLORS[log.type]} break-all`}>{log.message}</span>
              </div>
            ))}
            <div ref={terminalEndRef} />
          </div>

          {/* Status badge */}
          <div className="mt-2 flex items-center gap-2">
            <span className={`w-1.5 h-1.5 rounded-full ${backendLive ? 'bg-[#00ff41] animate-pulse' : 'bg-[#8b949e]'}`} />
            <span className="font-mono text-[10px] text-[#8b949e] tracking-widest uppercase">
              {backendLive ? 'LIVE FEED' : 'OFFLINE — DEMO LOG'}
            </span>
          </div>
        </div>

        {/* RIGHT: SCREENSHOT PANEL */}
        <div className="flex flex-col gap-4">
          <div className="bg-[#0d1117] border border-[#1e2d3d] rounded-lg px-4 py-3">
            <p className="text-[10px] font-mono text-[#8b949e] tracking-widest uppercase mb-1">last shot</p>
            <p className="font-mono text-sm text-[#00d4ff]">{activeSerial}</p>
          </div>

          {/* Mock phone */}
          <div className="flex-1 bg-[#0d1117] border border-[#1e2d3d] rounded-2xl p-3 flex flex-col">
            <div className="flex-1 bg-white rounded-xl overflow-hidden">
              <div className="bg-white h-6 flex items-center justify-between px-3 text-[9px] text-gray-700 font-semibold">
                <span>9:41</span>
                <div className="flex items-center gap-0.5">
                  <div className="w-3 h-2 border border-gray-400 rounded-sm relative"><div className="absolute inset-0.5 bg-emerald-500" /></div>
                </div>
              </div>
              <div className="bg-white px-3 py-2 space-y-2">
                <div className="h-3 bg-gray-200 rounded w-3/4" />
                <div className="h-2 bg-gray-100 rounded w-full" />
                <div className="h-2 bg-gray-100 rounded w-5/6" />
                <div className="mt-3 space-y-1.5">
                  {[1,2,3].map(i => (
                    <div key={i} className="flex items-center gap-2 py-1">
                      <div className="w-6 h-6 rounded-full bg-blue-400 shrink-0" />
                      <div className="flex-1 space-y-0.5">
                        <div className="h-1.5 bg-gray-200 rounded w-2/3" />
                        <div className="h-1.5 bg-gray-100 rounded w-1/2" />
                      </div>
                      <div className="text-[8px] border border-gray-900 text-gray-900 px-1.5 py-0.5 rounded-full font-bold">Follow</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#0d1117] border border-[#1e2d3d] rounded-lg px-4 py-2">
            <p className="font-mono text-[10px] text-[#8b949e]">session {activeSerial}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
