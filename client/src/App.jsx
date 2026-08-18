import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';

import { LandingPage } from './pages/LandingPage';
import { ReportIssuePage } from './pages/ReportIssuePage';
import { MapPage } from './pages/MapPage';
import { DashboardPage } from './pages/DashboardPage';
import { MyReportsPage } from './pages/MyReportsPage';
import { ProfilePage } from './pages/ProfilePage';

export function App() {
  const [authModalOpen, setAuthModalOpen] = useState(false);

  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <div className="flex flex-col min-h-screen bg-[#07090E] text-slate-100 font-sans selection:bg-cyan-500 selection:text-white">
            
            <Navbar onOpenAuth={() => setAuthModalOpen(true)} />

            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/report" element={<ReportIssuePage />} />
                <Route path="/map" element={<MapPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/my-reports" element={<MyReportsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            <Footer />

            <AuthModal
              isOpen={authModalOpen}
              onClose={() => setAuthModalOpen(false)}
            />

          </div>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
