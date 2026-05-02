import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { extractVideoId } from '../utils/youtubeParser';
import { X, Camera } from 'lucide-react';
import './QRScanner.css';

const QRScanner = ({ onScanSuccess, onCancel }) => {
  const [error, setError] = useState(null);
  const scannerRef = useRef(null);

  useEffect(() => {
    // Create scanner instance
    const html5QrCode = new Html5Qrcode("qr-reader");
    scannerRef.current = html5QrCode;

    const startScanner = async () => {
      try {
        await html5QrCode.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0
          },
          (decodedText, decodedResult) => {
            // Validate the QR code
            const videoId = extractVideoId(decodedText);
            if (videoId) {
              // Valid frame scanned
              // Stop the scanner first
              html5QrCode.stop().then(() => {
                onScanSuccess(videoId);
              }).catch((err) => {
                console.error("Failed to stop scanner", err);
                // Still transition on success even if stop fails gracefully
                onScanSuccess(videoId);
              });
            } else {
              // Invalid QR
              setError("Invalid frame QR. Please scan a valid frame.");
              // Clear error after 3 seconds
              setTimeout(() => setError(null), 3000);
            }
          },
          (errorMessage) => {
            // Ignore normal scanning errors (e.g. no code in view)
          }
        );
      } catch (err) {
        console.error("Error starting scanner", err);
        setError("Could not access camera. Please check permissions.");
      }
    };

    startScanner();

    // Cleanup on unmount
    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, [onScanSuccess]);

  return (
    <div className="scanner-container fade-in">
      <div className="scanner-header">
        <h2>Scan Frame</h2>
        <button className="btn-close" onClick={onCancel} aria-label="Cancel scanning">
          <X size={24} />
        </button>
      </div>
      
      <div className="scanner-instruction">
        <Camera size={20} className="text-gold" />
        <p>Position the frame's QR code within the box</p>
      </div>

      <div className="reader-wrapper">
        <div id="qr-reader"></div>
        {error && <div className="error-msg fade-in">{error}</div>}
      </div>
    </div>
  );
};

export default QRScanner;
