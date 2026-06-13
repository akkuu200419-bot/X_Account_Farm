import { useState, useEffect } from 'react';
import { ChevronDown, Play, Square, Shield, Smartphone, Cpu, Activity, TrendingUp } from 'lucide-react';
import { devices, outlooks } from '../data/mockData';
import { fetchStatus, postRun, postRunAll, postRunAllDevices, getStop, FlaskStatus } from '../lib/flaskApi';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  disabled?: boolean;
}

const DarkSelect = ({ value, onChange, options, placeholder, disabled }: SelectProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => !disabled && setOpen(!open)}
        disabled={disabled}
        className="w-full px-3 py-2 bg-[#0d1117] border border-[#1e2d3d] text-[#e6edf3] font-mono text-sm rounded flex items-center justify-between hover:border-[#00ff41]/60 transition-all"
      >
        <span>{value ? options.find(o => o.value === value)?.label : placeholder || 'Select...'}</span>
        <ChevronDown size={16} />
      </button>
      {open && (
        <div className="absolute top-full mt-1 w-full bg-[#0d1117] border border-[#1e2d3d] rounded z-10 shadow-lg">
          {options.map(option => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-[#e6edf3] font-mono text-sm hover:bg-[#111827] transition-colors"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const NumberSpinner = ({ value, onChange, min = 0, label }: { value: number; onChange: (v: number) => void; min?: number; label: string }) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-mono text-[#8b949e] tracking-widest uppercase">{label}</label>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          className="px-2 py-1 bg-[#0d1117] border border-[#1e2d3d] text-[#e6edf3] rounded hover:border-[#00ff41]/60 transition-all font-mono"
        >
          −
        </button>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Math.max(min, parseInt(e.target.value) || 0))}
          className="w-16 px-2 py-1 bg-[#0d1117] border border-[#1e2d3d] text-[#e6edf3] rounded font-mono text-center"
        />
        <button
          onClick={() => onChange(value + 1)}
          className="px-2 py-1 bg-[#0d1117] border border-[#1e2d3d] text-[#e6edf3] rounded hover:border-[#00ff41]/60 transition-all font-mono"
        >
          +
        </button>
      </div>
    </div>
  );
};

// Analytics data generators
const getDeviceUsageData = () => devices.map(d => ({
  name: d.serial.slice(-6),
  usage: d.used,
  capacity: d.cap,
}));

const getDeviceTypeData = () => {
  const emulators = devices.filter(d => d.type === 'emulator').length;
  const physical = devices.filter(d => d.type === 'physical').length;
  return [
    { name: 'Emulator', value: emulators, color: '#f472b6' },
    { name: 'Physical', value: physical, color: '#00d4ff' },
  ];
};

const getActivityTrend = () => [
  { hour: '6h', actions: 12 },
  { hour: '5h', actions: 18 },
  { hour: '4h', actions: 24 },
  { hour: '3h', actions: 35 },
  { hour: '2h', actions: 28 },
  { hour: '1h', actions: 42 },
  { hour: 'now', actions: 38 },
];

export default function DeviceManager() {
  const [selectedRow, setSelectedRow] = useState<string>('');
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [backendLive, setBackendLive] = useState(false);
  const [status, setStatus] = useState<FlaskStatus | null>(null);
  const [perDeviceCap, setPerDeviceCap] = useState(5);
  const [batchSize, setBatchSize] = useState(3);
  const [gapSeconds, setGapSeconds] = useState(2);
  const [device2faStates, setDevice2faStates] = useState<Record<string, boolean>>({});

  // Initialize 2FA states from device data
  useEffect(() => {
    const initialStates: Record<string, boolean> = {};
    devices.forEach(d => {
      initialStates[d.serial] = d.has2fa;
    });
    setDevice2faStates(initialStates);
  }, []);

  useEffect(() => {
    const poll = async () => {
      const s = await fetchStatus();
      if (s) {
        setStatus(s);
        setBackendLive(true);
        setIsRunning(s.running);
      } else {
        setBackendLive(false);
      }
    };
    poll();
    const interval = setInterval(poll, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleToggle2fa = (serial: string) => {
    setDevice2faStates(prev => ({
      ...prev,
      [serial]: !prev[serial]
    }));
  };

  const handleRun = async () => {
    if (!selectedRow || !selectedDevice) return;
    try {
      await postRun(selectedRow, selectedDevice);
      setIsRunning(true);
    } catch (error) {
      console.error('Run failed:', error);
    }
  };

  const handleStop = async () => {
    try {
      await getStop();
      setIsRunning(false);
    } catch (error) {
      console.error('Stop failed:', error);
    }
  };

  const handleRunAll = async () => {
    if (!selectedDevice) return;
    try {
      await postRunAll(selectedDevice, perDeviceCap, batchSize, gapSeconds);
      setIsRunning(true);
    } catch (error) {
      console.error('RunAll failed:', error);
    }
  };

  const handleRunAllDevices = async () => {
    try {
      await postRunAllDevices(perDeviceCap, batchSize, gapSeconds);
      setIsRunning(true);
    } catch (error) {
      console.error('RunAllDevices failed:', error);
    }
  };

  const outlookOptions = outlooks.map(o => ({
    value: o.id,
    label: `${o.name} (${o.email})`
  }));

  const deviceOptions = devices.map(d => ({
    value: d.serial,
    label: `${d.model} — ${d.serial}`
  }));

  const selectedDeviceObj = devices.find(d => d.serial === selectedDevice);
  const selectedOutlookObj = outlooks.find(o => o.id === selectedRow);

  // Analytics data
  const deviceUsageData = getDeviceUsageData();
  const deviceTypeData = getDeviceTypeData();
  const activityTrendData = getActivityTrend();

  const totalDevices = devices.length;
  const availableDevices = devices.filter(d => d.status === 'available').length;
  const totalCapacity = devices.reduce((sum, d) => sum + d.cap, 0);
  const totalUsed = devices.reduce((sum, d) => sum + d.used, 0);
  const devicesWith2fa = Object.values(device2faStates).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#0a0e1a] p-8">
      {/* MINI ANALYTICS SECTION */}
      <section className="mb-8">
        <h2 className="text-xs font-mono tracking-widest uppercase text-[#00ff41] mb-4">
          overview
        </h2>
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-[#00ff41]/20 to-[#00ff41]/5 border border-[#00ff41]/30 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <Smartphone className="text-[#00ff41]" size={20} />
              <span className="text-2xl font-bold text-white">{totalDevices}</span>
            </div>
            <div className="text-[#8b949e] text-xs font-mono">Total Devices</div>
          </div>

          <div className="bg-gradient-to-br from-[#00d4ff]/20 to-[#00d4ff]/5 border border-[#00d4ff]/30 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <Activity className="text-[#00d4ff]" size={20} />
              <span className="text-2xl font-bold text-white">{availableDevices}</span>
            </div>
            <div className="text-[#8b949e] text-xs font-mono">Available</div>
          </div>

          <div className="bg-gradient-to-br from-yellow-400/20 to-yellow-400/5 border border-yellow-400/30 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="text-yellow-400" size={20} />
              <span className="text-2xl font-bold text-white">{devicesWith2fa}</span>
            </div>
            <div className="text-[#8b949e] text-xs font-mono">2FA Enabled</div>
          </div>

          <div className="bg-gradient-to-br from-pink-400/20 to-pink-400/5 border border-pink-400/30 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="text-pink-400" size={20} />
              <span className="text-2xl font-bold text-white">{totalUsed}/{totalCapacity}</span>
            </div>
            <div className="text-[#8b949e] text-xs font-mono">Capacity Used</div>
          </div>
        </div>

        {/* Mini Charts */}
        <div className="grid grid-cols-3 gap-4">
          {/* Device Usage Bar */}
          <div className="bg-[#0d1117] border border-[#1e2d3d] rounded-xl p-4">
            <h3 className="text-xs font-mono text-[#8b949e] uppercase mb-3">device usage</h3>
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={deviceUsageData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2d3d" />
                <XAxis type="number" stroke="#8b949e" fontSize={10} />
                <YAxis dataKey="name" type="category" stroke="#8b949e" fontSize={9} width={50} />
                <Tooltip contentStyle={{ backgroundColor: '#0d1117', border: '1px solid #1e2d3d', borderRadius: '4px' }} />
                <Bar dataKey="usage" fill="#00ff41" radius={[0, 2, 2, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Device Type Pie */}
          <div className="bg-[#0d1117] border border-[#1e2d3d] rounded-xl p-4">
            <h3 className="text-xs font-mono text-[#8b949e] uppercase mb-3">device types</h3>
            <ResponsiveContainer width="100%" height={120}>
              <PieChart>
                <Pie
                  data={deviceTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={50}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {deviceTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0d1117', border: '1px solid #1e2d3d', borderRadius: '4px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-2">
              {deviceTypeData.map(d => (
                <div key={d.name} className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-[10px] font-mono text-[#8b949e]">{d.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Trend */}
          <div className="bg-[#0d1117] border border-[#1e2d3d] rounded-xl p-4">
            <h3 className="text-xs font-mono text-[#8b949e] uppercase mb-3">activity trend</h3>
            <ResponsiveContainer width="100%" height={120}>
              <LineChart data={activityTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2d3d" />
                <XAxis dataKey="hour" stroke="#8b949e" fontSize={10} />
                <YAxis stroke="#8b949e" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#0d1117', border: '1px solid #1e2d3d', borderRadius: '4px' }} />
                <Line type="monotone" dataKey="actions" stroke="#00d4ff" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* SECTION 1: CONNECTED DEVICES */}
      <section className="mb-12">
        <h2 className="text-xs font-mono tracking-widest uppercase text-[#00ff41] mb-6">
          1 · connected devices
        </h2>
        <div className="bg-[#0d1117] border border-[#1e2d3d] rounded overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-mono">
              <thead>
                <tr className="bg-[#111827] border-b border-[#1e2d3d]">
                  <th className="px-4 py-3 text-left text-[#8b949e]">serial</th>
                  <th className="px-4 py-3 text-left text-[#8b949e]">model</th>
                  <th className="px-4 py-3 text-left text-[#8b949e]">android</th>
                  <th className="px-4 py-3 text-left text-[#8b949e]">x installed</th>
                  <th className="px-4 py-3 text-left text-[#8b949e]">logged-in</th>
                  <th className="px-4 py-3 text-left text-[#8b949e]">used / cap</th>
                  <th className="px-4 py-3 text-left text-[#8b949e]">status</th>
                  <th className="px-4 py-3 text-left text-[#8b949e]">type</th>
                  <th className="px-4 py-3 text-left text-[#8b949e]">enable 2fa</th>
                </tr>
              </thead>
              <tbody>
                {devices.map((device, idx) => (
                  <tr
                    key={device.serial}
                    className={`border-b border-[#1e2d3d] ${idx % 2 === 0 ? 'bg-[#0d1117]' : 'bg-[#111827]'} hover:bg-[#1a2332] transition-colors`}
                  >
                    <td className="px-4 py-3 text-[#e6edf3]">{device.serial}</td>
                    <td className="px-4 py-3 text-[#e6edf3]">{device.model}</td>
                    <td className="px-4 py-3 text-[#e6edf3]">{device.androidVersion}</td>
                    <td className="px-4 py-3">
                      <span className={device.xInstalled ? 'text-[#00ff41]' : 'text-[#8b949e]'}>
                        {device.xInstalled ? '✓' : '✗'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#e6edf3]">{device.handles.join(', ') || '(none)'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[#8b949e]">{device.used}/{device.cap}</span>
                        <div className="w-16 h-2 bg-[#1e2d3d] rounded">
                          <div
                            className="h-full bg-[#00ff41] rounded"
                            style={{ width: `${(device.used / device.cap) * 100}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded border text-xs font-mono ${
                          device.status === 'available'
                            ? 'border-[#00ff41] text-[#00ff41]'
                            : 'border-[#ff3333] text-[#ff3333]'
                        }`}
                      >
                        {device.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 flex items-center gap-2">
                      {device.type === 'emulator' ? (
                        <><Cpu size={16} className="text-pink-400" /> emulator</>
                      ) : (
                        <><Smartphone size={16} className="text-[#00d4ff]" /> physical</>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggle2fa(device.serial)}
                        disabled={device.status !== 'available'}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          device2faStates[device.serial] ? 'bg-[#00ff41]' : 'bg-[#1e2d3d]'
                        } ${device.status !== 'available' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            device2faStates[device.serial] ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* SECTION 2: PICK ROW + DEVICE */}
      <section className="mb-12">
        <h2 className="text-xs font-mono tracking-widest uppercase text-[#00ff41] mb-6">
          2 · pick row + device
        </h2>
        <div className="bg-[#0d1117] border border-[#1e2d3d] rounded p-6">
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono text-[#8b949e] tracking-widest uppercase">outlook row</label>
              <DarkSelect
                value={selectedRow}
                onChange={setSelectedRow}
                options={outlookOptions}
                placeholder="Select outlook row"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono text-[#8b949e] tracking-widest uppercase">target device</label>
              <DarkSelect
                value={selectedDevice}
                onChange={setSelectedDevice}
                options={deviceOptions}
                placeholder="Select device"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${backendLive ? 'bg-[#00ff41]' : 'bg-[#8b949e]'}`} />
              <span className="text-sm font-mono text-[#e6edf3]">
                backend {backendLive ? 'live' : 'offline'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isRunning ? 'bg-[#00ff41]' : 'bg-[#8b949e]'}`} />
              <span className="text-sm font-mono text-[#e6edf3]">
                {isRunning ? 'running' : 'idle'}
              </span>
            </div>
          </div>

          <div className="flex gap-4 mb-6">
            <button
              onClick={handleRun}
              disabled={!selectedRow || !selectedDevice || isRunning}
              className="flex items-center gap-2 px-6 py-2 bg-[#00ff41] text-[#0a0e1a] font-mono text-sm font-bold rounded hover:bg-[#00ff41]/90 disabled:opacity-50 transition-all"
            >
              <Play size={16} /> Run
            </button>
            <button
              onClick={handleStop}
              disabled={!isRunning}
              className="flex items-center gap-2 px-6 py-2 bg-[#ff3333] text-[#0a0e1a] font-mono text-sm font-bold rounded hover:bg-[#ff3333]/90 disabled:opacity-50 transition-all"
            >
              <Square size={16} /> Stop
            </button>
          </div>

          {isRunning && selectedOutlookObj && selectedDeviceObj && (
            <div className="p-4 bg-[#111827] border border-[#1e2d3d] rounded text-[#00ff41] font-mono text-sm">
              running — {selectedOutlookObj.name} on {selectedDeviceObj.serial}
            </div>
          )}
        </div>
      </section>

      {/* SECTION 3: BATCH RUN ALL */}
      <section>
        <h2 className="text-xs font-mono tracking-widest uppercase text-[#00ff41] mb-6">
          3 · batch run all
        </h2>
        <div className="bg-[#0d1117] border border-[#1e2d3d] rounded p-6">
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono text-[#8b949e] tracking-widest uppercase">device</label>
              <DarkSelect
                value={selectedDevice}
                onChange={setSelectedDevice}
                options={deviceOptions}
                placeholder="Select device"
              />
            </div>
            <NumberSpinner value={perDeviceCap} onChange={setPerDeviceCap} label="per-device cap" />
            <NumberSpinner value={batchSize} onChange={setBatchSize} label="batch size" />
            <NumberSpinner value={gapSeconds} onChange={setGapSeconds} label="gap seconds" />
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleRunAll}
              disabled={!selectedDevice}
              className="px-6 py-2 bg-[#00ff41] text-[#0a0e1a] font-mono text-sm font-bold rounded hover:bg-[#00ff41]/90 disabled:opacity-50 transition-all"
            >
              run all
            </button>
            <button
              onClick={handleRunAllDevices}
              className="px-6 py-2 border border-[#00d4ff] text-[#00d4ff] font-mono text-sm font-bold rounded hover:border-[#00d4ff]/60 hover:shadow-[0_0_8px_rgba(0,212,255,0.3)] transition-all"
            >
              run on all devices
            </button>
          </div>

          <p className="mt-6 text-xs font-mono text-[#8b949e]">
            distribute tasks evenly across selected device(s) with specified batch parameters.
          </p>
        </div>
      </section>
    </div>
  );
}
