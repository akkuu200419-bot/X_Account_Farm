import React, { useState } from 'react';
import { Upload } from 'lucide-react';

export default function OutlookFarm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [dob, setDob] = useState('');
  const [csvPath, setCsvPath] = useState('/tmp/outlook_uploads/usa_names_1000.csv');
  const [selectedFile, setSelectedFile] = useState('');
  const [rowCount, setRowCount] = useState(235);

  const mockTableRows = [
    { id: 0, first: 'Laura', last: 'Parker', username: 'laura.parker962834', dob: '12-18-1991', email: 'laura.parker962834@outlook.com', status: 'ok' },
    { id: 1, first: 'James', last: 'Smith', username: 'james.smith914823', dob: '01-14-1991', email: 'james.smith914823@outlook.com', status: 'ok' },
    { id: 2, first: 'Mary', last: 'Johnson', username: 'mary.johnson887312', dob: '05-22-1988', email: 'mary.johnson887312@outlook.com', status: 'ok' },
    { id: 3, first: 'John', last: 'Williams', username: 'john.williams952647', dob: '07-03-1995', email: 'john.williams952647@outlook.com', status: 'ok' },
    { id: 4, first: 'Patricia', last: 'Brown', username: 'patricia.brown903178', dob: '03-15-1990', email: 'patricia.brown903178@outlook.com', status: 'ok' },
    { id: 5, first: 'Robert', last: 'Jones', username: 'robert.jones977856', dob: '11-09-1997', email: 'robert.jones977856@outlook.com', status: 'ok' },
    { id: 6, first: 'Jennifer', last: 'Garcia', username: 'jennifer.garcia914562', dob: '09-25-1991', email: 'jennifer.garcia914562@outlook.com', status: 'ok' },
    { id: 7, first: 'Linda', last: 'Davis', username: 'linda.davis891643', dob: '12-07-1989', email: 'linda.davis891643@outlook.com', status: 'ok' },
  ];

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const emailVal = e.target.value;
    setEmail(emailVal);
    // Auto-fill username from local-part of email
    if (emailVal.includes('@')) {
      const localPart = emailVal.split('@')[0];
      setUsername(localPart);
    }
  };

  const handleAddAccount = () => {
    // Placeholder for adding account
    console.log('Adding account:', { email, password, firstName, lastName, username, dob });
  };

  const handleSetCsv = () => {
    // Placeholder for setting CSV
    console.log('CSV set:', csvPath);
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-[#e6edf3] p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Outlook account farm</h1>
        <p className="text-[#8b949e] text-sm mt-2">Drives outlook_signup.py over a CSV of first / last / username / dob.</p>
      </div>

      <div className="space-y-6">
        {/* Add Existing Account Section */}
        <div className="bg-[#0d1117] border-2 border-dashed border-[#1e2d3d] rounded-lg p-6">
          <h2 className="text-[#00d4ff] font-mono font-bold text-sm uppercase mb-4">Add an existing Outlook account (created elsewhere)</h2>
          <p className="text-[#8b949e] text-sm mb-4">Manually register an account that was created outside this panel.</p>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="raheemkh22365@outlook.com"
                className="bg-[#020408] border border-[#1e2d3d] rounded px-3 py-2 text-[#e6edf3] placeholder-[#8b949e] font-mono text-sm focus:outline-none focus:border-[#00d4ff]"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="bg-[#020408] border border-[#1e2d3d] rounded px-3 py-2 text-[#e6edf3] placeholder-[#8b949e] font-mono text-sm focus:outline-none focus:border-[#00d4ff]"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name"
                className="bg-[#020408] border border-[#1e2d3d] rounded px-3 py-2 text-[#e6edf3] placeholder-[#8b949e] font-mono text-sm focus:outline-none focus:border-[#00d4ff]"
              />
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last name"
                className="bg-[#020408] border border-[#1e2d3d] rounded px-3 py-2 text-[#e6edf3] placeholder-[#8b949e] font-mono text-sm focus:outline-none focus:border-[#00d4ff]"
              />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="bg-[#020408] border border-[#1e2d3d] rounded px-3 py-2 text-[#e6edf3] placeholder-[#8b949e] font-mono text-sm focus:outline-none focus:border-[#00d4ff]"
              />
              <input
                type="text"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                placeholder="MM/DD/YYYY"
                className="bg-[#020408] border border-[#1e2d3d] rounded px-3 py-2 text-[#e6edf3] placeholder-[#8b949e] font-mono text-sm focus:outline-none focus:border-[#00d4ff]"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-[#1e2d3d]">
            <button
              onClick={handleAddAccount}
              className="bg-[#1d6fb8] hover:bg-[#2678d6] px-4 py-2 rounded text-white text-sm font-mono font-bold"
            >
              Add account
            </button>
            <span className="text-[#8b949e] text-xs font-mono">Paste the email and tab away — other fields fill from mirror/CSV.</span>
          </div>
        </div>

        {/* Section 1: Pick CSV */}
        <div className="bg-[#0d1117] border border-[#1e2d3d] rounded-lg p-6">
          <h2 className="text-[#00d4ff] font-mono font-bold text-sm uppercase mb-4">SECTION 1 · PICK CSV</h2>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[#e6edf3] text-sm font-mono mb-2">Use existing file:</label>
                <input
                  type="text"
                  value={csvPath}
                  onChange={(e) => setCsvPath(e.target.value)}
                  className="w-full bg-[#020408] border border-[#1e2d3d] rounded px-3 py-2 text-[#e6edf3] placeholder-[#8b949e] font-mono text-sm focus:outline-none focus:border-[#00d4ff]"
                />
              </div>
              <div>
                <label className="block text-[#e6edf3] text-sm font-mono mb-2">Or upload a new CSV:</label>
                <div className="flex gap-2">
                  <button className="bg-[#1e2d3d] hover:bg-[#2d3d4d] px-3 py-2 rounded text-[#e6edf3] text-sm font-mono flex items-center gap-2 flex-1">
                    <Upload size={14} />
                    Browse...
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-[#020408] border border-[#1e2d3d] rounded px-3 py-2">
              <p className="text-[#8b949e] text-xs font-mono">
                {selectedFile || 'No file selected'}
              </p>
            </div>

            <button
              onClick={handleSetCsv}
              className="bg-[#1d6fb8] hover:bg-[#2678d6] px-4 py-2 rounded text-white text-sm font-mono font-bold w-full"
            >
              Set CSV
            </button>

            <div className="bg-[#020408] border border-[#1e2d3d] rounded px-3 py-2">
              <p className="text-[#8b949e] text-xs font-mono">
                Expected columns: <code className="text-[#00d4ff]">first, last, username, dob</code> (no header)
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Pick Rows + Run */}
        <div className="bg-[#0d1117] border border-[#1e2d3d] rounded-lg p-6">
          <h2 className="text-[#00d4ff] font-mono font-bold text-sm uppercase mb-4">SECTION 2 · PICK ROWS + RUN</h2>

          <div className="mb-4">
            <p className="text-[#8b949e] text-sm font-mono">{rowCount} rows in CSV (0..{rowCount - 1}).</p>
          </div>

          <div className="overflow-x-auto border border-[#1e2d3d] rounded">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="border-b border-[#1e2d3d] bg-[#111827]">
                  <th className="px-3 py-2 text-left text-[#00d4ff] font-bold">#</th>
                  <th className="px-3 py-2 text-left text-[#00d4ff] font-bold">first</th>
                  <th className="px-3 py-2 text-left text-[#00d4ff] font-bold">last</th>
                  <th className="px-3 py-2 text-left text-[#00d4ff] font-bold">username</th>
                  <th className="px-3 py-2 text-left text-[#00d4ff] font-bold">dob</th>
                  <th className="px-3 py-2 text-left text-[#00d4ff] font-bold">email</th>
                  <th className="px-3 py-2 text-left text-[#00d4ff] font-bold">status</th>
                </tr>
              </thead>
              <tbody>
                {mockTableRows.map((row) => (
                  <tr key={row.id} className="border-b border-[#1e2d3d] hover:bg-[#111827]">
                    <td className="px-3 py-2 text-[#e6edf3]">{row.id}</td>
                    <td className="px-3 py-2 text-[#e6edf3]">{row.first}</td>
                    <td className="px-3 py-2 text-[#e6edf3]">{row.last}</td>
                    <td className="px-3 py-2 text-[#e6edf3]">{row.username}</td>
                    <td className="px-3 py-2 text-[#e6edf3]">{row.dob}</td>
                    <td className="px-3 py-2 text-[#e6edf3]">{row.email}</td>
                    <td className="px-3 py-2">
                      <span className="bg-[#00ff41] text-[#0a0e1a] font-bold px-2 py-1 rounded text-xs">
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
