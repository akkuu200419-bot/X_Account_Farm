import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import DeviceManager from './pages/DeviceManager';
import LiveLog from './pages/LiveLog';
import Credentials from './pages/Credentials';
import PostActions from './pages/PostActions';
import OutlookFarm from './pages/OutlookFarm';
import TwPwaFarm from './pages/TwPwaFarm';
import LoginFarm from './pages/LoginFarm';
import Analytics from './pages/Analytics';
import Toast, { ToastData } from './components/Toast';
import { useState, useCallback } from 'react';

export default function App() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = useCallback((message: string) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#0a0e1a] text-[#e6edf3]">
        {/* Subtle grid background */}
        <div
          className="fixed inset-0 pointer-events-none opacity-[0.02]"
          style={{
            backgroundImage:
              'linear-gradient(#00ff41 1px, transparent 1px), linear-gradient(90deg, #00ff41 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        <Navbar />

        <main className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6">
          <Routes>
            <Route path="/" element={<Navigate to="/analytics" replace />} />
            <Route path="/analytics"    element={<Analytics />} />
            <Route path="/device-mgr"    element={<DeviceManager />} />
            <Route path="/live-log"      element={<LiveLog />} />
            <Route path="/credentials"   element={<Credentials />} />
            <Route path="/post-actions"  element={<PostActions />} />
            <Route path="/outlook-farm"  element={<OutlookFarm />} />
            <Route path="/tw-pwa-farm"   element={<TwPwaFarm />} />
            <Route path="/login-farm"    element={<LoginFarm />} />
          </Routes>
        </main>

        <Toast toasts={toasts} onRemove={removeToast} />
      </div>
    </BrowserRouter>
  );
}
