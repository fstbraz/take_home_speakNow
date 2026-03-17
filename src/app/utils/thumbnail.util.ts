import { Observable } from 'rxjs';

const THUMB_WIDTH = 260;
const THUMB_HEIGHT = 180;

export function captureThumbnail(blob: Blob): Observable<string> {
  return new Observable<string>(subscriber => {
    const url = URL.createObjectURL(blob);
    const video = document.createElement('video');
    video.muted = true;
    video.preload = 'metadata';

    video.onerror = () => {
      URL.revokeObjectURL(url);
      subscriber.error(new Error('Failed to load video for thumbnail'));
    };

    video.onloadedmetadata = () => {
      const safeDuration = isFinite(video.duration) && video.duration > 0 ? video.duration : 0;
      video.currentTime = safeDuration > 0 ? Math.min(0.5, safeDuration / 2) : 0;
    };

    video.onseeked = () => {
      const canvas = document.createElement('canvas');
      canvas.width = THUMB_WIDTH;
      canvas.height = THUMB_HEIGHT;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        URL.revokeObjectURL(url);
        subscriber.error(new Error('Canvas 2D context unavailable'));
        return;
      }
      ctx.drawImage(video, 0, 0, THUMB_WIDTH, THUMB_HEIGHT);
      URL.revokeObjectURL(url);
      subscriber.next(canvas.toDataURL('image/png'));
      subscriber.complete();
    };

    video.src = url;
  });
}
