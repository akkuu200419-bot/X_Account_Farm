import React, { useState, useRef, useEffect } from 'react';
import { RefreshCw, ThumbsUp, Repeat2, MessageSquare, Zap, Rocket } from 'lucide-react';
import { credentials } from '../data/mockData';

type ActionTab = 'like' | 'repost' | 'comment' | 'like+repost' | 'all3';

const ACTION_TABS: { id: ActionTab; label: string; icon: React.ReactNode; color: string; btnBg: string; btnText: string }[] = [
  { id: 'like', label: 'Like', icon: <ThumbsUp size={14} />, color: 'border-[#1D9BF0] text-[#1D9BF0]', btnBg: 'bg-[#1D9BF0] hover:bg-[#1a8cd8]', btnText: 'text-white' },
  { id: 'repost', label: 'Repost', icon: <Repeat2 size={14} />, color: 'border-[#00d4ff] text-[#00d4ff]', btnBg: 'bg-[#00d4ff] hover:bg-[#00bce0]', btnText: 'text-[#020408]' },
  { id: 'comment', label: 'Comment', icon: <MessageSquare size={14} />, color: 'border-amber-400 text-amber-400', btnBg: 'bg-amber-400 hover:bg-amber-500', btnText: 'text-[#020408]' },
  { id: 'like+repost', label: 'Like + Repost', icon: <Zap size={14} />, color: 'border-[#00ff41] text-[#00ff41]', btnBg: 'bg-[#00ff41] hover:bg-[#00dd38]', btnText: 'text-[#020408]' },
  { id: 'all3', label: 'All 3', icon: <Rocket size={14} />, color: 'border-pink-400 text-pink-400', btnBg: 'bg-pink-400 hover:bg-pink-500', btnText: 'text-white' },
];

const SAVED_SESSIONS = [
  { username: 'TheHulk65925', status: 'login-submitted', lastSeen: '2026-05-23T12:31:58Z', platform: 'twitter' },
  { username: 'ViciousStr83735', status: 'login-submitted', lastSeen: '2026-05-23T11:45:22Z', platform: 'twitter' },
  { username: 'DutchHerit29865', status: 'logged-in-suspended', lastSeen: '2026-05-22T08:15:10Z', platform: 'twitter' },
  { username: 'Overwatch173802', status: 'login-submitted', lastSeen: '2026-05-23T10:30:45Z', platform: 'twitter' },
  { username: 'Pineault233539', status: 'login-submitted', lastSeen: '2026-05-23T09:12:33Z', platform: 'twitter' },
  { username: 'Gut1425939', status: 'login-submitted', lastSeen: '2026-05-23T07:50:19Z', platform: 'twitter' },
  { username: 'ChargerTox35155', status: 'login-submitted', lastSeen: '2026-05-23T06:44:11Z', platform: 'twitter' },
  { username: 'ScareSt11875636', status: 'login-submitted', lastSeen: '2026-05-23T05:30:00Z', platform: 'twitter' },
  { username: 'Bitmap622117', status: 'login-submitted', lastSeen: '2026-05-23T04:15:00Z', platform: 'twitter' },
];

const TWITTER_HANDLES = credentials
  .filter((c) => c.handle)
  .map((c) => ({ username: c.handle!.replace('@', ''), status: 'saved', lastSeen: c.createdAt, platform: 'twitter' }));

const INSTAGRAM_ACCOUNTS = [
  { username: 'lizi.brown_ig', status: 'login-submitted', lastSeen: '2026-05-23T12:00:00Z', platform: 'instagram' },
  { username: 'aisha.khan.official', status: 'login-submitted', lastSeen: '2026-05-23T11:00:00Z', platform: 'instagram' },
  { username: 'priya_sharma_ig', status: 'login-submitted', lastSeen: '2026-05-23T10:00:00Z', platform: 'instagram' },
];

const FACEBOOK_ACCOUNTS = [
  { username: 'james.lee.fb', status: 'login-submitted', lastSeen: '2026-05-23T12:00:00Z', platform: 'facebook' },
  { username: 'carlos.rivera.fb', status: 'login-submitted', lastSeen: '2026-05-23T11:00:00Z', platform: 'facebook' },
];

function getAccountsForPlatform(platform: string) {
  if (platform === 'twitter') return [...SAVED_SESSIONS, ...TWITTER_HANDLES];
  if (platform === 'instagram') return INSTAGRAM_ACCOUNTS;
  if (platform === 'facebook') return FACEBOOK_ACCOUNTS;
  return [];
}

function statusColor(status: string) {
  if (status === 'login-submitted') return 'text-[#1D9BF0]';
  if (status === 'logged-in-suspended') return 'text-amber-400';
  if (status === 'saved') return 'text-[#00ff41]';
  return 'text-gray-500';
}

function statusLabel(status: string) {
  if (status === 'login-submitted') return 'login-submitted';
  if (status === 'logged-in-suspended') return 'logged-in-suspended';
  if (status === 'saved') return 'saved';
  return status;
}

const ACTION_NOTES: Record<ActionTab, { title: string; points: React.ReactNode[] }> = {
  like: {
    title: 'Like',
    points: [
      <span key="1">Sessions load from <code className="text-[#00d4ff]">~/login_farm/sessions/sessions.json</code>. Run login_farm first.</span>,
      <span key="2">Outcomes: <code className="text-[#00d4ff]">liked</code>, <code className="text-[#00d4ff]">already-liked</code>, <code className="text-[#00d4ff]">like-button-not-found</code>. See <code className="text-[#00d4ff]">like.py</code>.</span>,
      <span key="3">Concurrency = number of browsers fired simultaneously. 4 is a safe default.</span>,
      <span key="4">Dry-run locates the like button but does not click.</span>,
    ],
  },
  repost: {
    title: 'Repost',
    points: [
      <span key="1"><strong className="text-[#e6edf3]">Twitter/X:</strong> bare repost (no quote). Already-reposted is detected and skipped.</span>,
      <span key="2"><strong className="text-[#e6edf3]">Instagram:</strong> no native repost — does <em>Add post to your story</em> as closest analog.</span>,
      <span key="3"><strong className="text-[#e6edf3]">Facebook:</strong> clicks Share → Share now (Public).</span>,
      <span key="4">Outcomes: <code className="text-[#00d4ff]">reposted</code>, <code className="text-[#00d4ff]">already-reposted</code>, <code className="text-[#00d4ff]">*-not-found</code>. See <code className="text-[#00d4ff]">repost.py</code>.</span>,
    ],
  },
  comment: {
    title: 'Comment',
    points: [
      <span key="1"><strong className="text-[#e6edf3]">Twitter/X only.</strong> Each account opens the post, replies with its own rephrasing of your base content, then closes.</span>,
      <span key="2"><strong className="text-[#e6edf3]">One base → N variations:</strong> your single comment is rewritten into a distinct version per selected account (same meaning, different wording), with hashtags shuffled.</span>,
      <span key="3">Rephrase engine: built-in <strong className="text-[#e6edf3]">offline spinner</strong> by default; auto-upgrades to Claude if <code className="text-[#00d4ff]">ANTHROPIC_API_KEY</code> is set. See <code className="text-[#00d4ff]">rephrase.py</code>.</span>,
      <span key="4">Outcomes: <code className="text-[#00d4ff]">commented</code>, <code className="text-[#00d4ff]">reply-button-not-found</code>, <code className="text-[#00d4ff]">composer-not-found</code>, etc. See <code className="text-[#00d4ff]">combo.py</code>.</span>,
    ],
  },
  'like+repost': {
    title: 'Like + Repost',
    points: [
      <span key="1">Performs both Like and Repost in a single browser session per account — more efficient than running them separately.</span>,
      <span key="2">If like already done, skips the like step and proceeds to repost, and vice versa.</span>,
      <span key="3">Outcomes combine both action result codes separated by <code className="text-[#00d4ff]">+</code>. See <code className="text-[#00d4ff]">combo.py</code>.</span>,
    ],
  },
  all3: {
    title: 'All 3',
    points: [
      <span key="1">Performs Like, Repost, and Comment in a single browser session per account.</span>,
      <span key="2">Comment uses the same rephrase engine as the Comment-only action.</span>,
      <span key="3">Most engagement per session — ideal when you want maximum signal per account run.</span>,
      <span key="4">Outcomes are a combined tuple. See <code className="text-[#00d4ff]">combo.py</code>.</span>,
    ],
  },
};

export default function PostActions() {
  const [activeTab, setActiveTab] = useState<ActionTab>('comment');
  const [postUrl, setPostUrl] = useState('');
  const [detectedPlatform, setDetectedPlatform] = useState('-');
  const [platformOverride, setPlatformOverride] = useState('auto');
  const [commentContent, setCommentContent] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [accountFilter, setAccountFilter] = useState('');
  const [accounts, setAccounts] = useState<ReturnType<typeof getAccountsForPlatform>>([]);
  const [selectedAccounts, setSelectedAccounts] = useState<Set<string>>(new Set());
  const [concurrency, setConcurrency] = useState(4);
  const [dryRun, setDryRun] = useState(false);
  const [keepOpen, setKeepOpen] = useState(false);
  const [liveOutput, setLiveOutput] = useState('');
  const [runStatus, setRunStatus] = useState<'idle' | 'running' | 'done'>('done');
  const outputRef = useRef<HTMLDivElement>(null);

  const effectivePlatform =
    platformOverride !== 'auto'
      ? platformOverride
      : postUrl.includes('x.com') || postUrl.includes('twitter.com')
      ? 'twitter'
      : postUrl.includes('instagram.com')
      ? 'instagram'
      : postUrl.includes('facebook.com')
      ? 'facebook'
      : '-';

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setPostUrl(url);
    const platform =
      platformOverride !== 'auto'
        ? platformOverride
        : url.includes('x.com') || url.includes('twitter.com')
        ? 'twitter'
        : url.includes('instagram.com')
        ? 'instagram'
        : url.includes('facebook.com')
        ? 'facebook'
        : '-';
    setDetectedPlatform(platform);
    const loaded = getAccountsForPlatform(platform);
    setAccounts(loaded);
    setSelectedAccounts(new Set(loaded.map((a) => a.username)));
  };

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [liveOutput]);

  const filteredAccounts = accounts.filter(
    (a) =>
      a.username.toLowerCase().includes(accountFilter.toLowerCase())
  );

  const handleSelectAll = () => setSelectedAccounts(new Set(filteredAccounts.map((a) => a.username)));
  const handleSelectNone = () => setSelectedAccounts(new Set());

  const toggleAccount = (username: string) => {
    const s = new Set(selectedAccounts);
    s.has(username) ? s.delete(username) : s.add(username);
    setSelectedAccounts(s);
  };

  const handleRun = () => {
    if (selectedAccounts.size === 0) return;
    setRunStatus('running');
    const ts = () => new Date().toTimeString().slice(0, 8);
    const action = activeTab;
    const count = selectedAccounts.size;
    const usernames = Array.from(selectedAccounts);

    setLiveOutput(
      `[combo] actions=${action}  platform=${effectivePlatform}  url=${postUrl}\n` +
        `[combo] accounts(${count})  concurrency=${concurrency}  dry_run=${dryRun}  keep_open=${keepOpen}\n`
    );

    let i = 0;
    const lines: string[] = [];

    const interval = setInterval(() => {
      if (i < usernames.length) {
        const u = usernames[i];
        const outcome =
          action === 'like'
            ? 'liked'
            : action === 'repost'
            ? 'reposted'
            : action === 'comment'
            ? 'comment=commented'
            : action === 'like+repost'
            ? 'liked+reposted'
            : 'liked+reposted+commented';
        const isOk = Math.random() > 0.3;
        const symbol = isOk ? '✓' : '!';
        lines.push(`  ${symbol} ${u.padEnd(22)}  ${outcome}`);
        setLiveOutput(
          `[combo] actions=${action}  platform=${effectivePlatform}  url=${postUrl}\n` +
            `[combo] accounts(${count})  concurrency=${concurrency}  dry_run=${dryRun}  keep_open=${keepOpen}\n` +
            lines.join('\n') +
            '\n'
        );
        i++;
      } else {
        clearInterval(interval);
        const succeeded = lines.filter((l) => l.includes('✓')).length;
        setLiveOutput(
          (prev) =>
            prev +
            `=== summary ===\n${succeeded}/${count} fully succeeded (${action})  (${(Math.random() * 40 + 20).toFixed(1)}s)\n__JOB_DONE__  rc=${count - succeeded}\n[ui] job finished, rc=${count - succeeded}, ${succeeded}/${count} succeeded\n`
        );
        setRunStatus('done');
      }
    }, 350);
  };

  const handleCancel = () => {
    setRunStatus('idle');
    const ts = new Date().toTimeString().slice(0, 8);
    setLiveOutput((prev) => prev + `[${ts}] cancelled by user\n`);
  };

  const activeTabDef = ACTION_TABS.find((t) => t.id === activeTab)!;
  const notes = ACTION_NOTES[activeTab];
  const needsComment = activeTab === 'comment' || activeTab === 'all3';

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-[#e6edf3] p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white font-mono">Post Actions</h1>
        <p className="text-[#8b949e] text-sm mt-1 font-mono">Drive saved login_farm sessions across Twitter / Instagram / Facebook.</p>
      </div>

      {/* Action tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {ACTION_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border font-mono text-sm font-semibold transition-all duration-150 ${
              activeTab === tab.id
                ? `${tab.color} bg-white/5`
                : 'border-[#1e2d3d] text-[#8b949e] hover:border-[#1e2d3d] hover:text-[#e6edf3]'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex gap-6">
        {/* LEFT */}
        <div className="flex-[0_0_55%] min-w-0 space-y-5">
          {/* Section 1: POST URL */}
          <div className="bg-[#0d1117] border border-[#1e2d3d] rounded-xl p-5">
            <h2 className="text-[#00d4ff] font-mono font-bold text-xs uppercase tracking-widest mb-4">1 · POST URL</h2>
            <input
              type="text"
              value={postUrl}
              onChange={handleUrlChange}
              placeholder="https://x.com/NASA/status/206509482499104 OR https://www.instagram.com/p/..."
              className="w-full bg-[#020408] border border-[#1e2d3d] rounded-lg px-4 py-2.5 text-[#e6edf3] placeholder-[#374151] font-mono text-sm focus:outline-none focus:border-[#00d4ff] transition-colors"
            />
            <div className="flex items-center gap-4 mt-3">
              <span className="text-[#8b949e] text-xs font-mono">Detected platform:</span>
              <span
                className={`font-mono font-bold px-2.5 py-1 rounded text-xs ${
                  effectivePlatform === 'twitter'
                    ? 'bg-[#1D9BF0] text-white'
                    : effectivePlatform === 'instagram'
                    ? 'bg-pink-600 text-white'
                    : effectivePlatform === 'facebook'
                    ? 'bg-blue-700 text-white'
                    : 'bg-[#1e2d3d] text-[#8b949e]'
                }`}
              >
                {effectivePlatform}
              </span>
              <span className="text-[#8b949e] text-xs font-mono ml-auto">override:</span>
              <select
                value={platformOverride}
                onChange={(e) => setPlatformOverride(e.target.value)}
                className="bg-[#020408] border border-[#1e2d3d] rounded px-2 py-1 text-[#e6edf3] font-mono text-xs focus:outline-none"
              >
                <option value="auto">auto</option>
                <option value="twitter">twitter</option>
                <option value="instagram">instagram</option>
                <option value="facebook">facebook</option>
              </select>
            </div>
          </div>

          {/* Comment content (only for comment/all3) */}
          {needsComment && (
            <div className="bg-[#0d1117] border border-amber-500/20 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare size={13} className="text-amber-400" />
                <span className="text-amber-400 font-mono font-bold text-xs uppercase tracking-widest">COMMENT</span>
                <span className="text-[#8b949e] text-xs font-mono">— one base, auto-rephrased per account</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#8b949e] text-[10px] font-mono uppercase tracking-wide mb-1.5">Content</label>
                  <textarea
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    placeholder="Eager to watch the preview of Katalyst Space mission to boost the orbit of NASA's Neil Gehrels Swift Observatory."
                    rows={4}
                    className="w-full bg-[#020408] border border-[#1e2d3d] rounded-lg px-3 py-2.5 text-[#e6edf3] placeholder-[#374151] font-mono text-xs focus:outline-none focus:border-amber-500/50 resize-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[#8b949e] text-[10px] font-mono uppercase tracking-wide mb-1.5">Hashtags</label>
                  <textarea
                    value={hashtags}
                    onChange={(e) => setHashtags(e.target.value)}
                    placeholder="#GoNASA #Proud"
                    rows={4}
                    className="w-full bg-[#020408] border border-[#1e2d3d] rounded-lg px-3 py-2.5 text-[#e6edf3] placeholder-[#374151] font-mono text-xs focus:outline-none focus:border-amber-500/50 resize-none transition-colors"
                  />
                </div>
              </div>
              <p className="text-[#8b949e] text-[10px] font-mono mt-2">
                <span className="text-amber-400 font-bold">{selectedAccounts.size} → {selectedAccounts.size}</span> selected accounts each get a distinct rewrite of your base content.
              </p>
            </div>
          )}

          {/* Section 2: ACCOUNTS */}
          <div className="bg-[#0d1117] border border-[#1e2d3d] rounded-xl p-5">
            <h2 className="text-[#00d4ff] font-mono font-bold text-xs uppercase tracking-widest mb-4">2 · ACCOUNTS</h2>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={accountFilter}
                onChange={(e) => setAccountFilter(e.target.value)}
                placeholder="filter by username..."
                className="flex-1 bg-[#020408] border border-[#1e2d3d] rounded px-3 py-1.5 text-[#e6edf3] placeholder-[#374151] font-mono text-xs focus:outline-none focus:border-[#00d4ff] transition-colors"
              />
              <button onClick={handleSelectAll} className="bg-[#1e2d3d] hover:bg-[#2d3d4d] px-3 py-1.5 rounded text-[#e6edf3] text-xs font-mono transition-colors">All</button>
              <button onClick={handleSelectNone} className="bg-[#1e2d3d] hover:bg-[#2d3d4d] px-3 py-1.5 rounded text-[#e6edf3] text-xs font-mono transition-colors">None</button>
              <button className="bg-[#1e2d3d] hover:bg-[#2d3d4d] px-2 py-1.5 rounded text-[#8b949e] text-xs font-mono transition-colors">
                <RefreshCw size={12} />
              </button>
            </div>

            {accounts.length === 0 ? (
              <p className="text-[#8b949e] italic text-xs font-mono py-4 text-center">Paste a URL above to load accounts for that platform.</p>
            ) : (
              <div className="space-y-0.5 max-h-56 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#1D9BF0 #020408' }}>
                {filteredAccounts.map((a) => (
                  <label
                    key={a.username}
                    className="flex items-center gap-3 cursor-pointer hover:bg-[#111827] px-2 py-1.5 rounded transition-colors group"
                  >
                    <input
                      type="checkbox"
                      checked={selectedAccounts.has(a.username)}
                      onChange={() => toggleAccount(a.username)}
                      className="w-4 h-4 accent-[#00ff41] shrink-0"
                    />
                    <span className="text-[#e6edf3] font-mono font-bold text-sm flex-1">{a.username}</span>
                    <span className={`font-mono text-[10px] ${statusColor(a.status)}`}>
                      {statusLabel(a.status)}
                    </span>
                    <span className="text-[#374151] font-mono text-[10px]">· {a.lastSeen.slice(0, 19).replace('T', ' ')}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Section 3: OPTIONS */}
          <div className="bg-[#0d1117] border border-[#1e2d3d] rounded-xl p-5">
            <h2 className="text-[#00d4ff] font-mono font-bold text-xs uppercase tracking-widest mb-4">3 · OPTIONS</h2>
            <div className="flex items-center gap-6 flex-wrap">
              <div className="flex items-center gap-3">
                <label className="text-[#e6edf3] text-sm font-mono">Concurrency</label>
                <div className="flex items-center border border-[#1e2d3d] rounded-lg overflow-hidden bg-[#020408]">
                  <button onClick={() => setConcurrency((v) => Math.max(1, v - 1))} className="px-2.5 py-1 text-gray-400 hover:text-white hover:bg-[#1e2d3d] transition-colors font-mono text-sm">−</button>
                  <span className="px-3 py-1 text-sm font-mono text-gray-200 min-w-[2rem] text-center border-x border-[#1e2d3d]">{concurrency}</span>
                  <button onClick={() => setConcurrency((v) => v + 1)} className="px-2.5 py-1 text-gray-400 hover:text-white hover:bg-[#1e2d3d] transition-colors font-mono text-sm">+</button>
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={dryRun} onChange={(e) => setDryRun(e.target.checked)} className="w-4 h-4" />
                <span className="text-[#e6edf3] text-sm font-mono">Dry-run</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={keepOpen} onChange={(e) => setKeepOpen(e.target.checked)} className="w-4 h-4" />
                <span className="text-[#e6edf3] text-sm font-mono">Keep open</span>
              </label>
            </div>

            {/* Run controls */}
            <div className="flex items-center gap-3 mt-5 pt-4 border-t border-[#1e2d3d]">
              <button
                onClick={handleRun}
                disabled={runStatus === 'running' || selectedAccounts.size === 0}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-mono font-bold text-sm transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${activeTabDef.btnBg} ${activeTabDef.btnText}`}
              >
                {activeTabDef.icon}
                {activeTabDef.label}
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2.5 bg-[#1e2d3d] hover:bg-[#2d3d4d] rounded-lg text-[#e6edf3] text-sm font-mono transition-colors"
              >
                Cancel
              </button>
              <span
                className={`text-xs font-mono font-bold px-2.5 py-1 rounded border ${
                  runStatus === 'done'
                    ? 'border-[#00ff41] text-[#00ff41]'
                    : runStatus === 'running'
                    ? 'border-amber-400 text-amber-400 animate-pulse'
                    : 'border-[#1e2d3d] text-[#8b949e]'
                }`}
              >
                {runStatus}
              </span>
              <span className="ml-auto text-[#8b949e] text-sm font-mono">{selectedAccounts.size} selected</span>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex-[0_0_45%] min-w-0 space-y-5">
          {/* Live Output */}
          <div className="bg-[#0d1117] border border-[#1e2d3d] rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 bg-black/40 border-b border-[#1e2d3d]">
              <span className="text-xs font-mono text-[#8b949e] uppercase tracking-widest">LIVE OUTPUT</span>
              <div className="flex gap-1.5">
                {['bg-red-500', 'bg-yellow-400', 'bg-[#00ff41]'].map((c) => (
                  <div key={c} className={`w-2.5 h-2.5 rounded-full ${c} opacity-60`} />
                ))}
              </div>
            </div>
            <div
              ref={outputRef}
              className="bg-[#020408] p-4 h-72 overflow-y-auto font-mono text-xs text-[#00ff41] leading-relaxed whitespace-pre-wrap"
              style={{ scrollbarWidth: 'thin', scrollbarColor: '#1D9BF0 #020408' }}
            >
              {liveOutput || '(waiting for action)'}
            </div>
          </div>

          {/* Notes */}
          <div className="bg-[#0d1117] border border-[#1e2d3d] rounded-xl p-5">
            <h2 className="font-mono font-bold text-xs uppercase tracking-widest mb-4">
              NOTES — <span className={activeTabDef.color.split(' ')[1]}>{notes.title}</span>
            </h2>
            <ul className="space-y-3 text-[#8b949e] text-xs font-mono leading-relaxed">
              {notes.points.map((point, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-[#374151] shrink-0">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
