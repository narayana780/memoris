import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { buildEmbedUrl } from '../utils/youtubeParser';
import './WatchPage.css';

const BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 5l-7 7 7 7"/>
  </svg>
);

const ScanAgainIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/>
    <path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/>
    <line x1="7" y1="12" x2="17" y2="12"/>
  </svg>
);

const ErrorIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 8v4M12 16h.01"/>
  </svg>
);

export default function WatchPage() {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const [iframeLoaded, setIframeLoaded] = useState(false);

  // Guard: if no videoId in route
  if (!videoId || videoId.trim() === '') {
    return (
      <div className="watch-page animate-fadeIn">
        <WatchHeader navigate={navigate} />
        <div className="watch-stage">
          <div className="watch-error animate-fadeInUp">
            <div className="watch-error-icon"><ErrorIcon /></div>
            <h3>Video Not Found</h3>
            <p>No video ID was provided. Please scan a valid Memoris frame.</p>
            <button className="btn-primary" onClick={() => navigate('/scan')}>
              <ScanAgainIcon /> Scan Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const embedUrl = buildEmbedUrl(videoId);

  return (
    <div className="watch-page animate-fadeIn">
      <WatchHeader navigate={navigate} />

      <div className="watch-stage">
        {/* Now playing pill */}
        <div className="video-id-pill animate-fadeInUp delay-1">
          <span className="video-id-dot" />
          Now Playing · Frame Memory
        </div>

        {/* Video player with gold border */}
        <div className="video-frame-wrapper animate-fadeInUp delay-2">
          <div className="video-frame-border">
            <div className="video-iframe-container">
              {/* Loading overlay */}
              {!iframeLoaded && (
                <div className="video-loading-placeholder">
                  <div className="spinner-ring" />
                  <p>Loading memory…</p>
                </div>
              )}
              <iframe
                id="memory-video"
                className="video-iframe"
                src={embedUrl}
                title="Memoris — Your Memory"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                onLoad={() => setIframeLoaded(true)}
              />
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="watch-actions">
          <button className="btn-secondary" onClick={() => navigate('/')}>
            <BackIcon /> Home
          </button>
          <button className="btn-primary scan-again-stable" onClick={() => navigate('/scan')}>
            <ScanAgainIcon /> Scan Another Frame
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Shared header ── */
function WatchHeader({ navigate }) {
  return (
    <header className="watch-header">
      <button className="btn-icon" onClick={() => navigate(-1)} aria-label="Go back" style={{ color: 'var(--gold)' }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 5l-7 7 7 7"/>
        </svg>
      </button>
      <span className="watch-header-brand">MEMORIS</span>
      <div style={{ width: 40 }} />
    </header>
  );
}
