import { extractVideoId } from './youtubeParser';

/**
 * Result types for QR classification
 */
export const QR_TYPE = {
  YOUTUBE: 'youtube',
  URL: 'url',
  TEXT: 'text'
};

/**
 * Parses a decoded QR string and classifies it.
 * 
 * @param {string} text - The decoded QR text
 * @returns {{ type: string, value: string }}
 */
export const processQRText = (text) => {
  if (!text) return { type: QR_TYPE.TEXT, value: '' };

  const trimmed = text.trim();

  // 1. Check if it's a YouTube link or our internal /watch/ link
  const videoId = extractVideoId(trimmed);
  if (videoId) {
    return { type: QR_TYPE.YOUTUBE, value: videoId };
  }

  // 2. Check if it's a valid URL
  try {
    const url = new URL(trimmed);
    // If it has a protocol like http: or https:, treat as URL
    if (url.protocol === 'http:' || url.protocol === 'https:') {
      return { type: QR_TYPE.URL, value: trimmed };
    }
  } catch (e) {
    // Not a valid URL
  }

  // 3. Otherwise, it's plain text
  return { type: QR_TYPE.TEXT, value: trimmed };
};
