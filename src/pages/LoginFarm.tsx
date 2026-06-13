import React, { useState } from 'react';
import { Upload, RefreshCw, Play } from 'lucide-react';

export default function LoginFarm() {
  const [platform, setPlatform] = useState('twitter');
  const [useProxy, setUseProxy] = useState(true);
  const [csvTab, setCsvTab] = useState('pick-existing');
  const [csvFile, setCsvFile] = useState('MY_X_ACC.csv');
  const [csvPath, setCsvPath] = useState('/home/ubuntu/login_farm/uploads/MY_X_ACC-20260609-172644.csv');
  const [rowCount, setRowCount] = useState(1);
  const [liveOutput, setLiveOutput] = useState('');
  const [status, setStatus] = useState('done');
  const [sessionTab, setSessionTab] = useState('twitter');

  const csvPreviewRows = [
    { id: 1, username: 'BilalAhmedak7f', pw: '●●●●●●●●', totp: 'yes', proxy: '216.128.177.80:3789' },
    { id: 2, username: 'ZainabAli4hvp', pw: '●●●●●●●●', totp: 'yes', proxy: '155.138.141.3:3789' },
    { id: 3, username: 'JenniferGajuaa', pw: '●●●●●●●●', totp: 'yes', proxy: '45.63.74.191:3789' },
    { id: 4, username: 'LindaDavisgo7u', pw: '●●●●●●●●', totp: 'yes', proxy: '—' },
    { id: 5, username: 'LiziBrown', pw: '●●●●●●●●', totp: 'yes', proxy: '—' },
  ];

  const savedSessions = [
    { id: 1, username: 'TheHulk65925', platform: 'twitter', status: 'login-submitted', lastSeen: '2026-05-23T12:31:58Z', path: '/home/ubuntu/.config/1browser-profiles/x-2' },
    { id: 2, username: 'ViciousStr83735', platform: 'twitter', status: 'login-submitted', lastSeen: '2026-05-23T11:45:22Z', path: '/home/ubuntu/.config/1browser-profiles/x-3' },
    { id: 3, username: 'DutchHerit29865', platform: 'twitter', status: 'logged-in-suspended', lastSeen: '2026-05-22T08:15:10Z', path: '/home/ubuntu/.config/1browser-profiles/x-4' },
    { id: 4, username: 'Overwatch173802', platform: 'twitter', status: 'login-submitted', lastSeen: '2026-05-23T10:30:45Z', path: '/home/ubuntu/.config/1browser-profiles/x-5' },
    { id: 5, username: 'Pineault233539', platform: 'twitter', status: 'login-submitted', lastSeen: '2026-05-23T09:12:33Z', path: '/home/ubuntu/.config/1browser-profiles/x-6' },
    { id: 6, username: 'Gut1425939', platform: 'twitter', status: 'login-submitted', lastSeen: '2026-05-23T07:50:19Z', path: '/home/ubuntu/.config/1browser-profiles/x-7' },
  ];

  const handleStartLogin = () => {
    setStatus('running');
    setLiveOutput(
      `[ui] starting twitter login from ${csvPath} (use_proxy=${useProxy}, count=${rowCount})
[site] twitter/x → https://x.com/i/flow/login
[driver] raw CDP via tw_pwa_farm/cdp.py (Selenium-free; stealth=on)
[info] machine real IP (for leak-detection): 149.88.98.42
[1/${rowCount}] profile=x-1 port=9501 user=BilalAhmedak7f proxy=http://216.128.177.80:3789 totp=yes
  ✓ proxy egress IP: 216.128.177.80
`
    );
    setTimeout(() => {
      setStatus('done');
      setLiveOutput(prev => prev + `[complete] login sequence finished\n`);
    }, 3000);
  };

  const handleCancel = () => {
    setStatus('done');
    setLiveOutput(prev => prev + `[cancelled] login cancelled\n`);
  };

  const getStatusBadgeColor = (status: string) => {
    if (status === 'login-submitted') return 'bg-[#1d6fb8] text-white';
    if (status === 'logged-in-suspended') return 'bg-[#e07020] text-white';
    return 'bg-[#1e2d3d] text-[#e6edf3]';
  };

  const filteredSessions = savedSessions.filter(s => sessionTab === 'all' || s.platform === sessionTab);

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-[#e6edf3] p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">login_farm</h1>
        <p className="text-[#8b949e] text-sm mt-2">CSV-driven Selenium login for Twitter/X, Instagram, Facebook — with per-row proxies, 2FA and persistent sessions.</p>
      </div>

      <div className="flex gap-6">
        {/* Left Column */}
        <div className="flex-[0_0_55%] space-y-6">
          {/* Section 1: Configure Run */}
          <div className="bg-[#0d1117] border border-[#1e2d3d] rounded-lg p-6">
            <h2 className="text-[#00d4ff] font-mono font-bold text-sm uppercase mb-4">1 · CONFIGURE RUN</h2>

            <div className="space-y-4">
              {/* Platform */}
              <div>
                <label className="block text-[#e6edf3] text-sm font-mono mb-2">Platform:</label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full bg-[#020408] border border-[#1e2d3d] rounded px-3 py-2 text-[#e6edf3] font-mono text-sm focus:outline-none focus:border-[#00d4ff]"
                >
                  <option value="twitter">twitter</option>
                  <option value="instagram">instagram</option>
                  <option value="facebook">facebook</option>
                </select>
              </div>

              {/* Proxy Info */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer mb-2">
                  <input
                    type="checkbox"
                    checked={useProxy}
                    onChange={(e) => setUseProxy(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-[#e6edf3] text-sm font-mono">Apply per-row proxy</span>
                </label>
                <div className="bg-[#020408] border border-[#1e2d3d] rounded px-3 py-2">
                  <p className="text-[#8b949e] text-xs font-mono">
                    <span className="bg-[#00ff41] text-[#0a0e1a] font-bold px-1 rounded inline-block mr-2">✓</span>
                    CSV has proxies in 3/10 rows — toggle auto-enabled
                  </p>
                </div>
              </div>

              {/* CSV File Selection */}
              <div>
                <div className="flex gap-2 mb-3">
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
                  <button className="w-full bg-[#1e2d3d] hover:bg-[#2d3d4d] px-3 py-2 rounded text-[#e6edf3] text-sm font-mono flex items-center gap-2 justify-center">
                    <Upload size={16} />
                    Browse...
                  </button>
                )}

                {csvTab === 'upload-new' && (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={csvFile}
                      onChange={(e) => setCsvFile(e.target.value)}
                      placeholder="CSV filename"
                      className="flex-1 bg-[#020408] border border-[#1e2d3d] rounded px-3 py-2 text-[#e6edf3] placeholder-[#8b949e] font-mono text-sm focus:outline-none focus:border-[#00d4ff]"
                    />
                    <button className="bg-[#1d6fb8] hover:bg-[#2678d6] px-4 py-2 rounded text-white text-sm font-mono font-bold">
                      Upload
                    </button>
                  </div>
                )}
              </div>

              {/* CSV Path */}
              <div>
                <label className="block text-[#e6edf3] text-sm font-mono mb-2">CSV path:</label>
                <input
                  type="text"
                  value={csvPath}
                  onChange={(e) => setCsvPath(e.target.value)}
                  className="w-full bg-[#020408] border border-[#1e2d3d] rounded px-3 py-2 text-[#e6edf3] font-mono text-sm focus:outline-none focus:border-[#00d4ff]"
                />
              </div>

              {/* CSV Preview Table */}
              <div>
                <label className="block text-[#e6edf3] text-xs font-mono font-bold mb-2">Preview:</label>
                <div className="overflow-x-auto border border-[#1e2d3d] rounded">
                  <table className="w-full text-xs font-mono">
                    <thead>
                      <tr className="border-b border-[#1e2d3d] bg-[#111827]">
                        <th className="px-2 py-1 text-left text-[#00d4ff] font-bold">#</th>
                        <th className="px-2 py-1 text-left text-[#00d4ff] font-bold">username</th>
                        <th className="px-2 py-1 text-left text-[#00d4ff] font-bold">pw</th>
                        <th className="px-2 py-1 text-left text-[#00d4ff] font-bold">2FA</th>
                        <th className="px-2 py-1 text-left text-[#00d4ff] font-bold">proxy</th>
                      </tr>
                    </thead>
                    <tbody>
                      {csvPreviewRows.map((row) => (
                        <tr key={row.id} className="border-b border-[#1e2d3d] hover:bg-[#111827]">
                          <td className="px-2 py-1 text-[#e6edf3]">{row.id}</td>
                          <td className="px-2 py-1 text-[#e6edf3]">{row.username}</td>
                          <td className="px-2 py-1 text-[#e6edf3]">{row.pw}</td>
                          <td className="px-2 py-1">
                            <span className="bg-[#00ff41] text-[#0a0e1a] font-bold px-1 rounded text-xs">
                              {row.totp}
                            </span>
                          </td>
                          <td className="px-2 py-1 text-[#e6edf3]">{row.proxy}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Count */}
              <div className="flex items-center gap-3">
                <label className="text-[#e6edf3] text-sm font-mono">Count:</label>
                <input
                  type="number"
                  value={rowCount}
                  onChange={(e) => setRowCount(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  className="w-16 bg-[#020408] border border-[#1e2d3d] rounded px-2 py-1 text-[#e6edf3] font-mono text-sm text-center focus:outline-none"
                />
                <span className="text-[#8b949e] text-xs font-mono">0 = all rows</span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-4 border-t border-[#1e2d3d]">
                <button
                  onClick={handleStartLogin}
                  className="bg-[#00ff41] text-[#0a0e1a] font-bold hover:bg-[#00cc33] px-4 py-2 rounded font-mono text-sm flex items-center gap-2 shadow-[0_0_12px_rgba(0,255,65,0.4)]"
                >
                  <Play size={14} />
                  Start login
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-[#1e2d3d] hover:bg-[#2d3d4d] px-4 py-2 rounded text-[#e6edf3] text-sm font-mono"
                >
                  Cancel
                </button>
                <span className={`ml-auto text-xs font-mono font-bold px-2 py-1 rounded border ${
                  status === 'done'
                    ? 'border-[#00ff41] text-[#00ff41] bg-transparent'
                    : 'bg-[#1e2d3d] text-[#e6edf3] border-[#1e2d3d]'
                }`}>
                  {status}
                </span>
              </div>
            </div>
          </div>

          {/* LIVE OUTPUT */}
          <div className="bg-[#0d1117] border border-[#1e2d3d] rounded-lg p-6">
            <h2 className="font-mono font-bold text-sm uppercase text-[#e6edf3] mb-4">LIVE OUTPUT</h2>
            <div className="bg-[#020408] border border-[#1e2d3d] rounded font-mono text-xs text-[#00ff41] leading-relaxed h-56 overflow-y-auto p-3 whitespace-pre-wrap">
              {liveOutput || '(waiting for action)'}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex-[0_0_45%] space-y-6">
          {/* Section 2: Saved Sessions */}
          <div className="bg-[#0d1117] border border-[#1e2d3d] rounded-lg p-6">
            <h2 className="text-[#00d4ff] font-mono font-bold text-sm uppercase mb-4">2 · SAVED SESSIONS</h2>

            {/* Tab Bar */}
            <div className="flex gap-2 mb-4 pb-3 border-b border-[#1e2d3d]">
              {['all', 'twitter', 'instagram', 'facebook'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSessionTab(tab)}
                  className={`px-3 py-1 rounded text-xs font-mono ${
                    sessionTab === tab
                      ? 'bg-[#111827] text-[#00d4ff] font-bold'
                      : 'bg-transparent text-[#8b949e] hover:text-[#e6edf3]'
                  }`}
                >
                  {tab}
                </button>
              ))}
              <button className="ml-auto bg-[#1e2d3d] hover:bg-[#2d3d4d] px-3 py-1 rounded text-[#e6edf3] text-xs font-mono flex items-center gap-1">
                <RefreshCw size={12} />
                Refresh
              </button>
            </div>

            {/* Sessions List */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredSessions.map((session) => (
                <div key={session.id} className="bg-[#111827] border border-[#1e2d3d] rounded p-3 text-xs font-mono">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-white font-bold flex-1">{session.username}</span>
                    <span className="bg-[#1d6fb8] text-white px-2 py-1 rounded text-xs">
                      {session.platform}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${getStatusBadgeColor(session.status)}`}>
                      {session.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-2 text-[#8b949e]">
                    <span>last seen {session.lastSeen}</span>
                  </div>
                  <div className="text-[#8b949e] mb-2 break-all">
                    {session.path}
                  </div>
                  <div className="flex gap-2">
                    <button className="bg-[#1d6fb8] hover:bg-[#2678d6] px-2 py-1 rounded text-white text-xs">
                      Open
                    </button>
                    <button className="bg-[#1e2d3d] hover:bg-[#2d3d4d] px-2 py-1 rounded text-[#e6edf3] text-xs">
                      Forget
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CSV FORMAT */}
          <div className="bg-[#0d1117] border border-[#1e2d3d] rounded-lg p-6">
            <h2 className="text-[#e6edf3] text-xs font-mono font-bold mb-3">CSV FORMAT</h2>
            <div className="bg-[#020408] border border-[#1e2d3d] rounded font-mono text-xs text-[#00ff41] leading-relaxed p-3 whitespace-pre-wrap">
{`username,password,2FA_secret,proxy_url

# Examples:
alice,hunter2,JBSWY3DPEHPK3PXP,
bob,sw0rdfish,,http://u:p@1.2.3.4:8080
eve,xkcd,6LFMKVXILELU3CVT,socks5://1.2.3.4:1080

# Cells 3 (totp) and 4 (proxy) may be blank.
# '#' comments and blank lines are skipped.`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
