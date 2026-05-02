import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import { processQRText, QR_TYPE } from '../utils/qrProcessor';
import './ScanPage.css';

/* ── Icons ── */
const BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 5l-7 7 7 7"/>
  </svg>
);
const CameraIcon = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
    <circle cx="12" cy="13" r="4"/>
  </svg>
);
const UploadIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/>
    <line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);
const InfoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 8v4M12 16h.01"/>
  </svg>
);

const STATUS = { IDLE: 'idle', LOADING: 'loading', SCANNING: 'scanning', ERROR: 'error', DENIED: 'denied' };

export default function ScanPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState(STATUS.LOADING);
  const [errorMsg, setErrorMsg] = useState('');
  const [uploadLoading, setUploadLoading] = useState(false);
  const [scannedText, setScannedText] = useState(null);
  const scannerRef = useRef(null);
  const fileInputRef = useRef(null);
  const mountedRef = useRef(true);

  /* ─── Show timed error ─── */
  const showError = useCallback((msg, duration = 3500) => {
    setErrorMsg(msg);
    setTimeout(() => { if (mountedRef.current) setErrorMsg(''); }, duration);
  }, []);

  /* ─── Stop camera scanner ─── */
  const stopScanner = useCallback(async () => {
    if (scannerRef.current) {
      try {
        if (scannerRef.current.isScanning) await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch (_) {}
      scannerRef.current = null;
    }
  }, []);

  /* ─── Handle successful decode (camera or file) ─── */
  const handleDecoded = useCallback(async (decodedText) => {
    if (!mountedRef.current) return;
    const result = processQRText(decodedText);

    if (result.type === QR_TYPE.YOUTUBE) {
      await stopScanner();
      navigate(`/watch/${result.value}`);
    } else if (result.type === QR_TYPE.URL) {
      await stopScanner();
      window.location.href = result.value;
    } else {
      // Plain text
      await stopScanner();
      setScannedText(result.value);
    }
  }, [navigate, stopScanner]);

  /* ─── Start camera scanner ─── */
  useEffect(() => {
    mountedRef.current = true;

    const startScanner = async () => {
      try {
        const qr = new Html5Qrcode('qr-reader');
        scannerRef.current = qr;
        await qr.start(
          { facingMode: 'environment' },
          { fps: 12, qrbox: { width: 220, height: 220 }, aspectRatio: 1.0 },
          (decoded) => handleDecoded(decoded),
          () => {}
        );
        if (mountedRef.current) setStatus(STATUS.SCANNING);
      } catch (err) {
        if (!mountedRef.current) return;
        const msg = (err?.message || '').toLowerCase();
        if (msg.includes('permission') || msg.includes('denied') || msg.includes('notallowed')) {
          setStatus(STATUS.DENIED);
        } else {
          setStatus(STATUS.ERROR);
          setErrorMsg('Could not start camera. Please check permissions.');
        }
      }
    };

    startScanner();
    return () => {
      mountedRef.current = false;
      stopScanner();
    };
  }, [handleDecoded, stopScanner]);

  /* ─── Upload QR image ─── */
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Reset input so same file can be selected again
    e.target.value = '';

    setUploadLoading(true);
    setErrorMsg('');

    try {
      // Use a temp Html5Qrcode instance for file scanning
      const tempQr = new Html5Qrcode('qr-file-scanner');
      const decoded = await tempQr.scanFile(file, /* showImage= */ false);
      tempQr.clear();
      await handleDecoded(decoded);
    } catch (err) {
      showError('No valid QR code found in the image.');
    } finally {
      if (mountedRef.current) setUploadLoading(false);
    }
  };

  const handleBack = async () => {
    await stopScanner();
    navigate('/');
  };

  return (
    <div className="scan-page animate-fadeIn">

      {/* Header */}
      <header className="scan-header">
        <button className="btn-icon" onClick={handleBack} aria-label="Go back">
          <BackIcon />
        </button>
        <h2>Scan Frame</h2>
        <div style={{ width: 40 }} />
      </header>

      {/* Subtitle */}
      <p className="scan-subtitle">Scan or upload your QR code</p>

      {/* Body */}
      <div className="scan-body">

        {scannedText !== null ? (
          <div className="text-result-box animate-fadeInUp" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '320px', margin: '0 auto' }}>
            <h3 style={{ color: 'var(--gold)', marginBottom: '16px', fontWeight: '500', letterSpacing: '0.05em' }}>Scanned Text</h3>
            <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,175,55,0.2)', padding: '20px', borderRadius: '12px', wordBreak: 'break-word', color: '#eee', marginBottom: '32px', width: '100%', textAlign: 'center', fontSize: '1.1rem', lineHeight: '1.5' }}>
              {scannedText}
            </div>
            <button className="btn-primary" onClick={() => window.location.reload()} style={{ width: '100%' }}>
              Scan Another Code
            </button>
          </div>
        ) : (
          <>
            {/* ── Loading ── */}
        {status === STATUS.LOADING && (
          <div className="loading-box animate-fadeIn">
            <div className="spinner-ring" />
            <p>Starting camera…</p>
          </div>
        )}

        {/* ── Denied ── */}
        {status === STATUS.DENIED && (
          <div className="permission-box animate-fadeInUp">
            <div className="permission-icon"><CameraIcon size={28} /></div>
            <h3>Camera Permission Required</h3>
            <p>Allow camera access in your browser settings, then refresh to scan.</p>
            <button className="btn-secondary" onClick={() => window.location.reload()}>Try Again</button>
          </div>
        )}

        {/* ── Error ── */}
        {status === STATUS.ERROR && (
          <div className="permission-box animate-fadeInUp">
            <div className="permission-icon"><CameraIcon size={28} /></div>
            <h3>Camera Error</h3>
            <p>{errorMsg || 'Unable to access camera.'}</p>
            <button className="btn-secondary" onClick={() => window.location.reload()}>Retry</button>
          </div>
        )}

        {/* ── Active camera viewport ── */}
        {(status === STATUS.LOADING || status === STATUS.SCANNING) && (
          <>
            <p className="scan-section-label">Camera</p>
            <div className="scanner-viewport">
              <div className="scan-corner-guide scan-corner-guide--tl" />
              <div className="scan-corner-guide scan-corner-guide--tr" />
              <div className="scan-corner-guide scan-corner-guide--bl" />
              <div className="scan-corner-guide scan-corner-guide--br" />
              {status === STATUS.SCANNING && <div className="scan-line" />}
              <div id="qr-reader" />
            </div>
          </>
        )}

        {/* ── Error toast (while scanning) ── */}
        {errorMsg && (status === STATUS.SCANNING) && (
          <div className="scan-messages animate-fadeInUp">
            <div className="banner-error">{errorMsg}</div>
          </div>
        )}

        {/* ── Divider ── */}
        {(status === STATUS.SCANNING || status === STATUS.LOADING) && (
          <div className="scan-divider">
            <div className="scan-divider-line" />
            <span className="scan-divider-text">or</span>
            <div className="scan-divider-line" />
          </div>
        )}

        {/* ── Upload QR section ── */}
        <p className="scan-section-label">Upload QR Image</p>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden-file-input"
          onChange={handleFileChange}
          id="qr-upload-input"
        />

        {/* Hidden temp div for Html5Qrcode file scanner */}
        <div id="qr-file-scanner" style={{ display: 'none' }} />

        {/* Upload tap area */}
        <div
          className={`upload-area${uploadLoading ? ' is-loading' : ''}`}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
          aria-label="Upload QR code image"
        >
          <div className="upload-icon-wrap">
            {uploadLoading ? <div className="spinner-ring" style={{ width: 26, height: 26 }} /> : <UploadIcon />}
          </div>
          <span className="upload-label">
            {uploadLoading ? 'Scanning image…' : 'Upload QR Code'}
          </span>
          <span className="upload-hint">JPG, PNG, WEBP · from Camera Roll or Files</span>
        </div>

        {/* Upload error */}
        {errorMsg && status !== STATUS.SCANNING && (
          <div className="scan-messages animate-fadeInUp">
            <div className="banner-error">{errorMsg}</div>
          </div>
        )}

        {/* Tip */}
        <div className="banner-info" style={{ maxWidth: 360, marginTop: 4 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
            <InfoIcon />
            Scan any QR code to instantly view its contents.
          </span>
        </div>

          </>
        )}

      </div>
    </div>
  );
}
