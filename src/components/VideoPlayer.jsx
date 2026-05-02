import React from 'react';
import { getEmbedUrl } from '../utils/youtubeParser';
import { ArrowLeft } from 'lucide-react';
import './VideoPlayer.css';

const VideoPlayer = ({ videoId, onBack }) => {
  const embedUrl = getEmbedUrl(videoId);

  return (
    <div className="video-player-container fade-in">
      <header className="player-header">
        <button className="btn-outline back-btn" onClick={onBack}>
          <ArrowLeft size={20} />
          Back to Scanner
        </button>
      </header>
      
      <div className="video-wrapper">
        <iframe
          src={embedUrl}
          title="Memory Video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="luxury-iframe"
        ></iframe>
      </div>
    </div>
  );
};

export default VideoPlayer;
