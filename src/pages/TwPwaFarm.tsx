import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';

export default function TwPwaFarm() {
  const [csvTab, setCsvTab] = useState('pick-existing');
  const [selectedCsv, setSelectedCsv] = useState('');
  const [csvPath, setCsvPath] = useState('(none selected)');
  const [scrollSeconds, setScrollSeconds] = useState(60);
  const [stepPx, setStepPx] = useState(200);
  const [gapSeconds, setGapSeconds] = useState(1.0);
  const [liveOutput, setLiveOutput] = useState('');
  const [status, setStatus] = useState('idle');

  const devices = [
    { serial: 'e043d029', model: 'ONEPLUS_A6013', status: 'device' },
    { serial: 'emulator-5556', model: 'sdk_gphone64_x86_64', status: 'device' },
  ];

  const csvPreviewRows: any[] = [];

  const handleLogin = () => {
    setStatus('running');
    setLiveOutput('[ui] initiating login sequence\n[cdp] connecting to devices via adb\n[csv] loading credentials\n');
    setTimeout(() => {
      setStatus('idle');
      setLiveOutput(prev => prev + '[complete] login finished\n');
    }, 2000);
  };

  const handleScroll = () => {
    setStatus('running');
    setLiveOutput('[ui] scroll feed started\n[params] duration=' + scrollSeconds + 's, step=' + stepPx + 'px, gap=' + gapSeconds + 's\n');
    setTimeout(() => {
      setStatus('idle');
      setLiveOutput(prev => prev + '[complete] scroll finished\n');
    }, 2000);
  };

  const handleLogout = () => {
    setStatus('running');
    setLiveOutput('[ui] logout sequence initiated\n[cdp] clearing cookies and session\n');
    setTimeout(() => {
      setStatus('idle');
      setLiveOutput(prev => prev + '[complete] logout finished\n');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-[#e6edf3] p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">tw_pwa_farm</h1>
        <p className="text-[#8b949e] text-sm mt-2">Drive the X PWA on phones via Chrome DevTools Protocol (no Selenium). Login from CSV, slow-scroll the feed, logout — all on demand.</p>
      </div>

      <div className="flex gap-6">
        {/* Left Column */}
        <div className="flex-[0_0_55%] space-y-6">
          {/* Step 1: CSV */}
          <div className="bg-[#0d1117] border border-[#1e2d3d] rounded-lg p-6">
            <h2 className="text-[#00d4ff] font-mono font-bold text-sm uppercase mb-4">1 · CSV (SERIAL, USERNAME, PASSWORD, TOTP)</h2>

            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setCsvTab('pick-existing')}
                className={`px-4 py-2 rounded text-sm font-mono ${
                  csvTab === 'pick-existing'
                    ? 'bg-[#111827] text-[#e6edf3]'
                    : 'bg-[#1e2d3d] text-[#8b949e] hover:text-[#e6edf3]'
                }`}
              >
                Pick existing
              </button>
              <button
                onClick={() => setCsvTab('upload-new')}
                className={`px-4 py-2 rounded text-sm font-mono ${
                  csvTab === 'upload-new'
                    ? 'bg-[#111827] text-[#e6edf3]'
                    : 'bg-[#1e2d3d] text-[#8b949e] hover:text-[#e6edf3]'
                }`}
              >
                Upload new
              </button>
            </div>

            {csvTab === 'pick-existing' && (
              <div className="space-y-3 mb-4">
                <div className="flex gap-2">
                  <select className="flex-1 bg-[#020408] border border-[#1e2d3d] rounded px-3 py-2 text-[#e6edf3] font-mono text-sm focus:outline-none">
                    <option>— pick one —</option>
                    <option>csv_001.csv</option>
                    <option>csv_002.csv</option>
                  </select>
                  <button className="bg-[#1e2d3d] hover:bg-[#2d3d4d] px-3 py-2 rounded text-[#e6edf3] font-mono text-sm flex items-center gap-2">
                    <RefreshCw size={14} />
                  </button>
                </div>
              </div>
            )}

            <div className="bg-[#020408] border border-[#1e2d3d] rounded px-3 py-2 mb-4">
              <p className="text-[#8b949e] text-xs font-mono">{csvPath}</p>
            </div>

            <div className="border-t border-[#1e2d3d] pt-4">
              <h3 className="text-[#e6edf3] text-xs font-mono font-bold mb-2">Preview</h3>
              {csvPreviewRows.length === 0 ? (
                <p className="text-[#8b949e] italic text-xs">Pick a CSV to preview rows</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-mono">
                    <thead>
                      <tr className="border-b border-[#1e2d3d]">
                        <th className="text-[#00d4ff] px-2 py-1 text-left">#</th>
                        <th className="text-[#00d4ff] px-2 py-1 text-left">serial</th>
                        <th className="text-[#00d4ff] px-2 py-1 text-left">username</th>
                        <th className="text-[#00d4ff] px-2 py-1 text-left">pw</th>
                        <th className="text-[#00d4ff] px-2 py-1 text-left">2FA</th>
                      </tr>
                    </thead>
                    <tbody>
                      {csvPreviewRows.map((row, idx) => (
                        <tr key={idx} className="border-b border-[#1e2d3d]">
                          <td className="px-2 py-1 text-[#e6edf3]">{idx}</td>
                          <td className="px-2 py-1 text-[#e6edf3]">{row.serial}</td>
                          <td className="px-2 py-1 text-[#e6edf3]">{row.username}</td>
                          <td className="px-2 py-1 text-[#e6edf3]">●●●</td>
                          <td className="px-2 py-1 text-[#e6edf3]">{row.totp ? 'yes' : 'no'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Step 2: Devices */}
          <div className="bg-[#0d1117] border border-[#1e2d3d] rounded-lg p-6">
            <h2 className="text-[#00d4ff] font-mono font-bold text-sm uppercase mb-4">2 · DEVICES CURRENTLY CONNECTED</h2>

            <div className="flex items-center gap-2 mb-4">
              <button className="bg-[#1e2d3d] hover:bg-[#2d3d4d] px-3 py-1 rounded text-[#e6edf3] text-sm font-mono flex items-center gap-2">
                <span>adb devices ↺</span>
              </button>
              <span className="text-[#8b949e] text-sm font-mono bg-[#020408] px-2 py-1 rounded">
                {devices.length} listed
              </span>
            </div>

            <div className="space-y-2">
              {devices.map((device, idx) => (
                <div key={idx} className="bg-[#111827] border border-[#1e2d3d] rounded px-3 py-2 flex items-center gap-3 text-sm font-mono">
                  <span className="text-[#00d4ff] font-bold flex-1">{device.serial}</span>
                  <span className="text-[#e6edf3]">{device.model}</span>
                  <span className="bg-[#00ff41] text-[#0a0e1a] font-bold px-2 py-1 rounded text-xs">
                    [{device.status}]
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Step 3: Actions */}
          <div className="bg-[#0d1117] border border-[#1e2d3d] rounded-lg p-6">
            <h2 className="text-[#00d4ff] font-mono font-bold text-sm uppercase mb-4">3 · ACTIONS</h2>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <label className="text-[#e6edf3] text-sm font-mono whitespace-nowrap">Scroll for</label>
                <input
                  type="number"
                  value={scrollSeconds}
                  onChange={(e) => setScrollSeconds(parseInt(e.target.value) || 60)}
                  className="w-20 bg-[#020408] border border-[#1e2d3d] rounded px-2 py-1 text-[#e6edf3] font-mono text-sm text-center"
                />
                <span className="text-[#e6edf3] text-sm font-mono">seconds</span>
                <span className="mx-2 text-[#1e2d3d]">|</span>
                <label className="text-[#e6edf3] text-sm font-mono whitespace-nowrap">Step</label>
                <input
                  type="number"
                  value={stepPx}
                  onChange={(e) => setStepPx(parseInt(e.target.value) || 200)}
                  className="w-20 bg-[#020408] border border-[#1e2d3d] rounded px-2 py-1 text-[#e6edf3] font-mono text-sm text-center"
                />
                <span className="text-[#e6edf3] text-sm font-mono">px / tick</span>
              </div>

              <div className="flex items-center gap-3">
                <label className="text-[#e6edf3] text-sm font-mono whitespace-nowrap">Gap</label>
                <input
                  type="number"
                  step="0.1"
                  value={gapSeconds}
                  onChange={(e) => setGapSeconds(parseFloat(e.target.value) || 1.0)}
                  className="w-20 bg-[#020408] border border-[#1e2d3d] rounded px-2 py-1 text-[#e6edf3] font-mono text-sm text-center"
                />
                <span className="text-[#e6edf3] text-sm font-mono">seconds</span>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-[#1e2d3d]">
                <button
                  onClick={handleLogin}
                  disabled={status === 'running'}
                  className="bg-[#1e2d3d] hover:bg-[#2d3d4d] disabled:opacity-50 px-4 py-2 rounded text-[#e6edf3] text-sm font-mono font-bold"
                >
                  Login
                </button>
                <button
                  onClick={handleScroll}
                  disabled={status === 'running'}
                  className="bg-[#1d6fb8] hover:bg-[#2678d6] disabled:opacity-50 px-4 py-2 rounded text-white text-sm font-mono font-bold"
                >
                  Scroll feed
                </button>
                <button
                  onClick={handleLogout}
                  disabled={status === 'running'}
                  className="bg-[#e07020] hover:bg-[#f08030] disabled:opacity-50 px-4 py-2 rounded text-white text-sm font-mono font-bold"
                >
                  Logout
                </button>
                <span className="ml-auto text-[#8b949e] text-xs font-mono bg-[#020408] px-2 py-1 rounded">
                  {status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex-[0_0_45%] space-y-6">
          {/* LIVE OUTPUT */}
          <div className="bg-[#0d1117] border border-[#1e2d3d] rounded-lg p-6">
            <h2 className="font-mono font-bold text-sm uppercase text-[#e6edf3] mb-4">LIVE OUTPUT</h2>
            <div className="bg-[#020408] border border-[#1e2d3d] rounded font-mono text-xs text-[#00ff41] leading-relaxed h-96 overflow-y-auto p-3 whitespace-pre-wrap">
              {liveOutput || '(waiting for action)'}
            </div>
          </div>

          {/* NOTES */}
          <div className="bg-[#0d1117] border border-[#1e2d3d] rounded-lg p-6">
            <h2 className="font-mono font-bold text-sm uppercase text-[#e6edf3] mb-4">NOTES</h2>
            <ul className="space-y-3 text-[#8b949e] text-xs font-mono leading-relaxed">
              <li>• Each device runs its own CDP connection over <code className="text-[#00d4ff]">adb forward tcp:&lt;auto&gt; localabstract:chrome_devtools_remote</code>.</li>
              <li>• Login uses the CSV; Scroll and Logout work on whatever's listed in the CSV (or all <code className="text-[#00d4ff]">adb devices</code> in state=device if no CSV).</li>
              <li>• <strong className="text-[#e6edf3]">2FA</strong>: if the CSV's 4th column has a base32 TOTP secret, the script generates the code with pyotp.</li>
              <li>• CSV row example: <code className="text-[#00d4ff]">c8003640,alice,hunter2,JBSWY3DPEHPK3PXP</code></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
