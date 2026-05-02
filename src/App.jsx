import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ScanPage from './pages/ScanPage';
import WatchPage from './pages/WatchPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Homepage */}
        <Route path="/" element={<HomePage />} />

        {/* QR Scanner */}
        <Route path="/scan" element={<ScanPage />} />

        {/* Video player — /watch/:videoId */}
        <Route path="/watch/:videoId" element={<WatchPage />} />

        {/* Fallback: unknown routes → home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
