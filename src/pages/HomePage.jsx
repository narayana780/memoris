import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

/* ── Icons ── */
const ScanIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 7V5a2 2 0 0 1 2-2h2"/>
    <path d="M17 3h2a2 2 0 0 1 2 2v2"/>
    <path d="M21 17v2a2 2 0 0 1-2 2h-2"/>
    <path d="M7 21H5a2 2 0 0 1-2-2v-2"/>
    <line x1="7" y1="12" x2="17" y2="12"/>
  </svg>
);

const VideoIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="5 3 19 12 5 21 5 3"/>
  </svg>
);

const LinkIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
  </svg>
);

const CameraIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
    <circle cx="12" cy="13" r="4"/>
  </svg>
);

export default function HomePage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  // Handle sticky navbar background on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="home-container">
      {/* ── Background Effects ── */}
      <div className="bg-glow bg-glow-1" />
      <div className="bg-glow bg-glow-2" />
      <div className="particles-container">
        {/* Simple CSS particles simulated with box-shadows in CSS */}
        <div className="particles" />
      </div>

      {/* ── Navbar ── */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-brand">MEMORIS</div>
        <div className="nav-links">
          <a href="#home" className="nav-link">Home</a>
          <a href="#how-it-works" className="nav-link">How it Works</a>
          <button className="nav-link scan-nav-btn" onClick={() => navigate('/scan')}>
            Scan QR
          </button>
          <a href="#contact" className="nav-link">Contact</a>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section id="home" className="hero-section">
        <div className="hero-content">
          
          {/* Left Side: Text */}
          <div className="hero-left animate-slideRight">
            <h1 className="hero-title">
              Travel back to your <span className="text-gold-glow">moments</span>
            </h1>
            <p className="hero-subtitle">
              Scan. Relive. Forever.
            </p>
            <button 
              className="btn-gold-gradient hover-scale"
              onClick={() => navigate('/scan')}
            >
              <ScanIcon />
              Scan Your Frame
            </button>
          </div>

          {/* Right Side: 3D Floating Card */}
          <div className="hero-right animate-slideLeft delay-1">
            <div className="magic-card-3d">
              <div className="magic-card-inner">
                <div className="magic-card-glow" />
                <h3 className="magic-card-title">How the Magic Works</h3>
                
                <div className="magic-steps-flow">
                  <div className="magic-step">
                    <div className="magic-icon-wrap"><CameraIcon /></div>
                    <span>Scan</span>
                  </div>
                  <div className="magic-arrow" />
                  <div className="magic-step">
                    <div className="magic-icon-wrap"><LinkIcon /></div>
                    <span>Link</span>
                  </div>
                  <div className="magic-arrow" />
                  <div className="magic-step">
                    <div className="magic-icon-wrap"><VideoIcon /></div>
                    <span>Video</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Ground shadow for 3D effect */}
            <div className="magic-card-shadow" />
          </div>

        </div>
      </section>

      {/* ── How It Works Section ── */}
      <section id="how-it-works" className="hiw-section">
        <h2 className="section-title animate-fadeInUp">How The Magic Works</h2>
        <div className="title-underline animate-fadeInUp delay-1" />

        <div className="hiw-grid">
          {/* Step 1 */}
          <div className="hiw-card animate-fadeInUp delay-1">
            <div className="hiw-step-number">01</div>
            <div className="hiw-icon"><CameraIcon /></div>
            <h3 className="hiw-title">Scan Your Frame</h3>
            <p className="hiw-desc">
              Simply point your smartphone camera or upload the unique QR code on your Memoris frame.
            </p>
          </div>

          {/* Step 2 */}
          <div className="hiw-card animate-fadeInUp delay-2">
            <div className="hiw-step-number">02</div>
            <div className="hiw-icon"><LinkIcon /></div>
            <h3 className="hiw-title">Instant Connection</h3>
            <p className="hiw-desc">
              Our smart scanner securely processes the code and instantly connects to your dedicated memory link.
            </p>
          </div>

          {/* Step 3 */}
          <div className="hiw-card animate-fadeInUp delay-3">
            <div className="hiw-step-number">03</div>
            <div className="hiw-icon"><VideoIcon /></div>
            <h3 className="hiw-title">Relive Forever</h3>
            <p className="hiw-desc">
              Watch your embedded YouTube video directly on your screen without leaving the Memoris ecosystem.
            </p>
          </div>
        </div>
      </section>

      {/* ── Contact / Footer ── */}
      <footer id="contact" className="home-footer">
        <div className="footer-brand">MEMORIS</div>
        <p className="footer-copy">© Memoris · Premium Memory Frames</p>
      </footer>
    </div>
  );
}
