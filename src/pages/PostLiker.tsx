import React, { useState } from 'react';
import { RefreshCw, Play } from 'lucide-react';
import { credentials } from '../data/mockData';

const TWITTER_ACCOUNTS = credentials
  .filter(c => c.handle)
  .map(c => ({ username: c.handle!.replace('@', ''), name: c.name }));

const INSTAGRAM_ACCOUNTS = [
  { username: 'lizi.brown_ig', name: 'Lizi Brown' },
  { username: 'aisha.khan.official', name: 'Aisha Khan' },
  { username: 'priya_sharma_ig', name: 'Priya Sharma' },
  { username: 'maria.garcia.ig', name: 'Maria Garcia' },
  { username: 'nora.m_insta', name: 'Nora Martinez' },
];

const FACEBOOK_ACCOUNTS = [
  { username: 'james.lee.fb', name: 'James Lee' },
  { username: 'carlos.rivera.fb', name: 'Carlos Rivera' },
  { username: 'raj.patel.fb', name: 'Raj Patel' },
  { username: 'elena.kozlov.fb', name: 'Elena Kozlov' },
];

function getAccountsForPlatform(platform: string) {
  if (platform === 'twitter') return TWITTER_ACCOUNTS;
  if (platform === 'instagram') return INSTAGRAM_ACCOUNTS;
  if (platform === 'facebook') return FACEBOOK_ACCOUNTS;
  return [];
}

type Account = { username: string; name: string };

export default function PostLiker() {
  const [postUrl, setPostUrl] = useState('');
  const [detectedPlatform, setDetectedPlatform] = useState('-');
  const [platformOverride, setPlatformOverride] = useState('auto');
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [filteredAccounts, setFilteredAccounts] = useState<Account[]>([]);
  const [accountFilter, setAccountFilter] = useState('');
  const [selectedAccounts, setSelectedAccounts] = useState<Set<string>>(new Set());
  const [concurrency, setConcurrency] = useState(4);
  const [dryRun, setDryRun] = useState(false);
  const [keepOpen, setKeepOpen] = useState(false);
  const [liveOutput, setLiveOutput] = useState('');
  const [status, setStatus] = useState('idle');

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setPostUrl(url);
    const effective = platformOverride !== 'auto' ? platformOverride
      : url.includes('x.com') || url.includes('twitter.com') ? 'twitter'
      : url.includes('instagram.com') ? 'instagram'
      : url.includes('facebook.com') ? 'facebook'
      : '-';
    setDetectedPlatform(effective);
    setAccounts(getAccountsForPlatform(effective));
    setSelectedAccounts(new Set());
  };

  React.useEffect(() => {
    const filtered = accounts.filter(a =>
      a.username.toLowerCase().includes(accountFilter.toLowerCase()) ||
      a.name.toLowerCase().includes(accountFilter.toLowerCase())
    );
    setFilteredAccounts(filtered);
  }, [accounts, accountFilter]);

  const handleSelectAll = () => setSelectedAccounts(new Set(filteredAccounts.map(a => a.username)));
  const handleSelectNone = () => setSelectedAccounts(new Set());

  const handleAccountToggle = (username: string) => {
    const s = new Set(selectedAccounts);
    s.has(username) ? s.delete(username) : s.add(username);
    setSelectedAccounts(s);
  };

  const handleLike = () => {
    setStatus('running');
    const ts = new Date().toTimeString().slice(0, 8);
    setLiveOutput(prev =>
      prev +
      `[${ts}] starting like — platform: ${detectedPlatform}\n` +
      `[${ts}] accounts selected: ${selectedAccounts.size} / ${accounts.length}\n` +
      `[${ts}] dry-run: ${dryRun ? 'yes' : 'no'} · concurrency: ${concurrency}\n` +
      Array.from(selectedAccounts).map(u => `[${ts}] → queuing @${u}\n`).join('')
    );
    setTimeout(() => {
      const ts2 = new Date().toTimeString().slice(0, 8);
      setStatus('idle');
      setLiveOutput(prev =>
        prev + Array.from(selectedAccounts).map(u => `[${ts2}] @${u} → liked\n`).join('') +
        `[${ts2}] === DONE ===\n`
      );
    }, 2000);
  };

  const handleCancel = () => {
    setStatus('idle');
    const ts = new Date().toTimeString().slice(0, 8);
    setLiveOutput(prev => prev + `[${ts}] cancelled\n`);
  };

  const handleRefresh = () => {
    const ts = new Date().toTimeString().slice(0, 8);
    setLiveOutput(prev => prev + `[${ts}] refreshing session list...\n`);
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-[#e6edf3] p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">post_liker</h1>
        <p className="text-[#8b949e] text-sm mt-2">Drive saved login_farm sessions to like a post. Paste the URL, pick the accounts, hit Like.</p>
      </div>

      <div className="flex gap-6 h-full">
        {/* Left Column */}
        <div className="flex-[0_0_65%] space-y-6">
          {/* Step 1: POST URL */}
          <div className="bg-[#0d1117] border border-[#1e2d3d] rounded-lg p-6">
            <h2 className="text-[#00d4ff] font-mono font-bold text-sm uppercase mb-4">1 · POST URL</h2>
            <input
              type="text"
              value={postUrl}
              onChange={handleUrlChange}
              placeholder="https://x.com/jack/status/20  OR  https://www.instagram.com/p/...  OR  https://www.facebook.com/..."
              className="w-full bg-[#020408] border border-[#1e2d3d] rounded px-4 py-2 text-[#e6edf3] placeholder-[#8b949e] font-mono text-sm focus:outline-none focus:border-[#00d4ff]"
            />
            <div className="flex items-center gap-4 mt-4">
              <span className="text-[#8b949e] text-sm font-mono">Detected platform:</span>
              <span className="bg-orange-500 text-white font-mono font-bold px-2 py-1 rounded text-xs">
                {detectedPlatform}
              </span>
              <span className="text-[#8b949e] text-sm font-mono">override:</span>
              <select
                value={platformOverride}
                onChange={(e) => setPlatformOverride(e.target.value)}
                className="bg-[#020408] border border-[#1e2d3d] rounded px-3 py-1 text-[#e6edf3] font-mono text-sm focus:outline-none"
              >
                <option value="auto">auto</option>
                <option value="twitter">twitter</option>
                <option value="instagram">instagram</option>
                <option value="facebook">facebook</option>
              </select>
            </div>
          </div>

          {/* Step 2: ACCOUNTS */}
          <div className="bg-[#0d1117] border border-[#1e2d3d] rounded-lg p-6">
            <h2 className="text-[#00d4ff] font-mono font-bold text-sm uppercase mb-4">2 · ACCOUNTS</h2>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={accountFilter}
                onChange={(e) => setAccountFilter(e.target.value)}
                placeholder="filter by username..."
                className="flex-1 bg-[#020408] border border-[#1e2d3d] rounded px-3 py-1 text-[#e6edf3] placeholder-[#8b949e] font-mono text-sm focus:outline-none focus:border-[#00d4ff]"
              />
              <button onClick={handleSelectAll} className="bg-[#1e2d3d] hover:bg-[#2d3d4d] px-3 py-1 rounded text-[#e6edf3] text-sm font-mono">
                All
              </button>
              <button onClick={handleSelectNone} className="bg-[#1e2d3d] hover:bg-[#2d3d4d] px-3 py-1 rounded text-[#e6edf3] text-sm font-mono">
                None
              </button>
              <button onClick={handleRefresh} className="bg-[#1e2d3d] hover:bg-[#2d3d4d] px-3 py-1 rounded text-[#e6edf3] text-sm font-mono flex items-center gap-2">
                <RefreshCw size={14} />
                Refresh
              </button>
            </div>
            {accounts.length === 0 ? (
              <p className="text-[#8b949e] italic text-sm font-mono">Paste a URL above to load accounts for that platform.</p>
            ) : (
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {filteredAccounts.map(a => (
                  <label key={a.username} className="flex items-center gap-3 cursor-pointer hover:bg-[#111827] px-2 py-1.5 rounded">
                    <input
                      type="checkbox"
                      checked={selectedAccounts.has(a.username)}
                      onChange={() => handleAccountToggle(a.username)}
                      className="w-4 h-4 accent-[#00ff41]"
                    />
                    <span className="text-[#00d4ff] font-mono text-sm">@{a.username}</span>
                    <span className="text-[#8b949e] text-xs font-mono">{a.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Step 3: OPTIONS */}
          <div className="bg-[#0d1117] border border-[#1e2d3d] rounded-lg p-6">
            <h2 className="text-[#00d4ff] font-mono font-bold text-sm uppercase mb-4">3 · OPTIONS</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="text-[#e6edf3] text-sm font-mono">Concurrency:</label>
                <input
                  type="number"
                  value={concurrency}
                  onChange={(e) => setConcurrency(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 bg-[#020408] border border-[#1e2d3d] rounded px-2 py-1 text-[#e6edf3] font-mono text-sm text-center focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dryRun}
                    onChange={(e) => setDryRun(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-[#e6edf3] text-sm font-mono">Dry-run</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={keepOpen}
                    onChange={(e) => setKeepOpen(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-[#e6edf3] text-sm font-mono">Keep open</span>
                </label>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-[#1e2d3d]">
                <button
                  onClick={handleLike}
                  disabled={status === 'running'}
                  className="bg-[#1e2d3d] hover:bg-[#2d3d4d] disabled:opacity-50 px-4 py-2 rounded text-[#e6edf3] text-sm font-mono font-bold flex items-center gap-2"
                >
                  <Play size={14} />
                  Like the post
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-[#111827] hover:bg-[#1a2333] px-4 py-2 rounded text-[#e6edf3] text-sm font-mono"
                >
                  Cancel
                </button>
                <span className="ml-auto text-[#8b949e] text-xs font-mono bg-[#020408] px-2 py-1 rounded">
                  {status}
                </span>
                <span className="text-[#8b949e] text-sm font-mono">
                  {selectedAccounts.size} selected
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex-[0_0_35%] space-y-6">
          {/* LIVE OUTPUT */}
          <div className="bg-[#0d1117] border border-[#1e2d3d] rounded-lg p-6">
            <h2 className="font-mono font-bold text-sm uppercase text-[#e6edf3] mb-4">LIVE OUTPUT</h2>
            <div className="bg-[#020408] border border-[#1e2d3d] rounded font-mono text-xs text-[#00ff41] leading-relaxed h-64 overflow-y-auto p-3 whitespace-pre-wrap">
              {liveOutput || '(waiting for action)'}
            </div>
          </div>

          {/* NOTES */}
          <div className="bg-[#0d1117] border border-[#1e2d3d] rounded-lg p-6">
            <h2 className="font-mono font-bold text-sm uppercase text-[#e6edf3] mb-4">NOTES</h2>
            <ul className="space-y-3 text-[#8b949e] text-sm font-mono leading-relaxed">
              <li>• Sessions are loaded from <code className="text-[#00d4ff]">~/login_farm/sessions/sessions.json</code>. Run login_farm first to create them.</li>
              <li>• The account list is filtered to the detected platform — paste a Twitter URL → only Twitter accounts shown.</li>
              <li>• Concurrency = number of browsers fired at once. 4 is sane; raise it on a beefy machine.</li>
              <li>• Dry-run opens the post and locates the like button but does not click.</li>
              <li>• Outcomes per account: <code className="text-[#00d4ff]">liked</code>, <code className="text-[#00d4ff]">already-liked</code>, <code className="text-[#00d4ff]">like-button-not-found</code>, etc. See <code className="text-[#00d4ff]">like.py</code>.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
