import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import { Camera, Mail, Lock, X, Menu, PlayCircle, Smartphone, Award, Share2, Frame } from 'lucide-react';

/* ── Custom SVG Icons ── */
const ScanIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 7V5a2 2 0 0 1 2-2h2"/>
    <path d="M17 3h2a2 2 0 0 1 2 2v2"/>
    <path d="M21 17v2a2 2 0 0 1-2 2h-2"/>
    <path d="M7 21H5a2 2 0 0 1-2-2v-2"/>
    <line x1="7" y1="12" x2="17" y2="12"/>
  </svg>
);

const WhatsAppIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const YouTubeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"/>
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>
  </svg>
);

export default function HomePage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  // Handle sticky navbar background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const openAuthModal = (mode) => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
    closeMenu();
  };

  const closeAuthModal = () => setIsAuthModalOpen(false);

  const scrollToSection = (e, id) => {
    e.preventDefault();
    closeMenu();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="home-container">
      {/* ── Background Effects ── */}
      <div className="bg-glow bg-glow-1" />
      <div className="bg-glow bg-glow-2" />
      <div className="particles-container">
        <div className="particles" />
      </div>

      {/* ── Navbar ── */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-brand">MEMORIS</div>
        
        {/* Desktop Links */}
        <div className="nav-links desktop-only">
          <a href="#home" className="nav-link" onClick={(e) => scrollToSection(e, 'home')}>Home</a>
          <a href="#order" className="nav-link" onClick={(e) => scrollToSection(e, 'order')}>Order Now</a>
          <button className="nav-link" onClick={() => navigate('/scan')}>Scan QR</button>
          <a href="#contact" className="nav-link" onClick={(e) => scrollToSection(e, 'contact')}>Contact</a>
          <div className="nav-divider" />
          <button className="nav-link" onClick={() => openAuthModal('login')}>Login</button>
        </div>

        {/* Mobile Hamburger Button */}
        <button className="hamburger-btn mobile-only" onClick={toggleMenu} aria-label="Toggle menu">
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Mobile Menu Overlay */}
        <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
          <div className="mobile-menu-content">
            <a href="#home" className="mobile-link" onClick={(e) => scrollToSection(e, 'home')}>Home</a>
            <a href="#order" className="mobile-link" onClick={(e) => scrollToSection(e, 'order')}>Order Now</a>
            <button className="mobile-link" onClick={() => { navigate('/scan'); closeMenu(); }}>Scan QR</button>
            <a href="#contact" className="mobile-link" onClick={(e) => scrollToSection(e, 'contact')}>Contact</a>
            <div className="mobile-divider" />
            <button className="mobile-link" onClick={() => openAuthModal('login')}>Login</button>
          </div>
        </div>
      </nav>

      {/* ── Auth Modal ── */}
      {isAuthModalOpen && (
        <div className="modal-overlay animate-fadeIn">
          <div className="auth-modal animate-fadeInUp">
            <button className="close-modal-btn" onClick={closeAuthModal}>
              <X size={24} />
            </button>
            <h2 className="modal-title">
              {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="modal-subtitle">
              {authMode === 'login' ? 'Log in to your Memoris account' : 'Join Memoris today'}
            </p>
            
            <form className="auth-form" onSubmit={(e) => { e.preventDefault(); closeAuthModal(); }}>
              <div className="input-group">
                <Mail className="input-icon" size={20} />
                <input type="email" placeholder="Email Address" required />
              </div>
              <div className="input-group">
                <Lock className="input-icon" size={20} />
                <input type="password" placeholder="Password" required />
              </div>
              <button type="submit" className="btn-gold-gradient modal-submit">
                {authMode === 'login' ? 'Log In' : 'Sign Up'}
              </button>
            </form>
            
            <p className="auth-switch">
              {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
              <button className="auth-switch-btn" onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}>
                {authMode === 'login' ? 'Sign up' : 'Log in'}
              </button>
            </p>
          </div>
        </div>
      )}

      {/* ── Hero Section ── */}
      <section id="home" className="hero-section center-layout">
        {/* Rotating Floral Design */}
        <img src="/gold-floral.png" alt="" className="rotating-floral-bg" />

        <div className="hero-content-centered animate-fadeInUp">
          <div className="hero-brand-pill">MEMORIS</div>
          <h1 className="hero-title-centered">
            Your Memories, <br />
            <span className="text-gold-glow">Framed Forever</span>
          </h1>
          <p className="hero-subtitle-centered">Scan. Relive. Share.</p>
          <p className="hero-desc-centered">
            Point your camera at a Memoris frame and relive your favorite memories instantly.
          </p>
          <div className="hero-buttons">
            <button className="btn-gold-gradient hover-scale" onClick={(e) => scrollToSection(e, 'order')}>
              Order Your Frame
            </button>
            <button className="btn-gold-outline hover-scale" onClick={() => navigate('/scan')}>
              <ScanIcon />
              Scan QR
            </button>
          </div>
        </div>
      </section>



      {/* ── Why Choose Memoris ── */}
      <section id="why-choose-us" className="why-section">
        <div className="section-container">
          <h2 className="section-title text-center animate-fadeInUp">Why Choose Memoris</h2>
          <div className="title-underline animate-fadeInUp delay-1" />
          
          <div className="card-grid">
            <div className="feature-card animate-fadeInUp delay-1">
              <div className="card-icon"><Frame size={28} /></div>
              <h3>Premium Frames</h3>
              <p>Crafted with high-quality materials and a matte finish for a luxury look.</p>
            </div>
            <div className="feature-card animate-fadeInUp delay-2">
              <div className="card-icon"><PlayCircle size={28} /></div>
              <h3>Embedded Videos</h3>
              <p>We seamlessly link your favorite videos permanently to your physical frame.</p>
            </div>
            <div className="feature-card animate-fadeInUp delay-3">
              <div className="card-icon"><Share2 size={28} /></div>
              <h3>Easy Sharing</h3>
              <p>Anyone who scans your frame can view the memory instantly, no app needed.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Order Section ── */}
      <section id="order" className="order-section">
        <div className="section-container text-center animate-fadeInUp">
          <h2 className="section-title">Order Your Custom Frame</h2>
          <div className="title-underline" />
          <p className="section-desc">
            Transform your favorite memories into premium physical frames that come alive.
          </p>
          <div className="order-card">
            <div className="order-icon-wrap">
              <Award size={32} />
            </div>
            <h3>Premium Memoris Frame</h3>
            <p style={{ color: '#a0a0a0', marginBottom: '32px' }}>High-quality print · Matte finish · Custom embedded QR</p>
            <a href="#" className="btn-gold-gradient hover-scale" style={{ textDecoration: 'none' }}>
              <WhatsAppIcon /> Order on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ── Connect / Social Section ── */}
      <section id="contact" className="contact-section">
        <div className="section-container text-center animate-fadeInUp">
          <h2 className="section-title">Connect With Us</h2>
          <div className="title-underline" />
          <p className="section-desc" style={{ marginBottom: '40px' }}>
            Follow our journey and stay updated with the latest from Memoris.
          </p>
          
          <div className="social-links">
            <a href="#" className="social-icon-btn whatsapp" aria-label="WhatsApp">
              <WhatsAppIcon />
            </a>
            <a href="#" className="social-icon-btn instagram" aria-label="Instagram">
              <InstagramIcon />
            </a>
            <a href="#" className="social-icon-btn youtube" aria-label="YouTube">
              <YouTubeIcon />
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="home-footer">
        <div className="footer-brand">MEMORIS</div>
        <p className="footer-copy">© Memoris · Premium Memory Frames</p>
      </footer>
    </div>
  );
}
