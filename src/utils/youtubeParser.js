/**
 * Extracts a YouTube Video ID from multiple URL formats.
 * Supports:
 *  - Our own site: memoris.com/watch/VIDEO_ID   ← primary format
 *  - youtube.com/watch?v=VIDEO_ID
 *  - youtu.be/VIDEO_ID
 *  - youtube.com/shorts/VIDEO_ID
 *  - youtube.com/embed/VIDEO_ID
 *
 * Returns null if not found.
 */
export function extractVideoId(input) {
  if (!input || typeof input !== 'string') return null;
  const str = input.trim();

  try {
    const url = new URL(str);
    const host = url.hostname.replace('www.', '');
    const parts = url.pathname.split('/').filter(Boolean); // remove empty strings

    // ── Our internal route: /watch/VIDEO_ID ─────────────────────
    if (parts[0] === 'watch' && parts[1] && !url.searchParams.get('v')) {
      return parts[1];
    }

    // ── YouTube: ?v= param ──────────────────────────────────────
    const vParam = url.searchParams.get('v');
    if (vParam && isValidYouTubeId(vParam)) return vParam;

    // ── youtu.be/VIDEO_ID ───────────────────────────────────────
    if (host === 'youtu.be' && parts[0]) {
      return isValidYouTubeId(parts[0]) ? parts[0] : null;
    }

    // ── /shorts/VIDEO_ID or /embed/VIDEO_ID ─────────────────────
    if ((parts[0] === 'shorts' || parts[0] === 'embed') && parts[1]) {
      return isValidYouTubeId(parts[1]) ? parts[1] : null;
    }
  } catch {
    // Not a valid URL — try regex as last resort
    const match = str.match(/(?:v=|youtu\.be\/|\/embed\/|\/shorts\/)([A-Za-z0-9_-]{11})/);
    if (match) return match[1];
  }

  return null;
}

function isValidYouTubeId(id) {
  return /^[A-Za-z0-9_-]{11}$/.test(id);
}

/**
 * Builds an embeddable YouTube URL from a video ID.
 */
export function buildEmbedUrl(videoId) {
  if (!videoId) return '';
  const params = new URLSearchParams({
    autoplay: '1',
    rel: '0',
    modestbranding: '1',
    playsinline: '1',
    color: 'white',
  });
  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
}
