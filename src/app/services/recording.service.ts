import { Injectable } from '@angular/core';
import { from, Observable, of, switchMap } from 'rxjs';
import { Quality } from '../state/bandwidth.state';
import { VideoMeta } from '../state/videos.state';
import { captureThumbnail } from '../utils/thumbnail.util';
import { v4 as uuidv4 } from 'uuid';

export interface RecordingResult {
  meta: VideoMeta;
  blob: Blob;
}

const RESOLUTION_MAP: Record<Quality, { width: number; height: number }> = {
  low: { width: 640, height: 360 },
  medium: { width: 1280, height: 720 },
  high: { width: 1920, height: 1080 },
};

@Injectable({ providedIn: 'root' })
export class RecordingService {
  readonly isSupported = typeof MediaRecorder !== 'undefined';

  private stream: MediaStream | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private chunks: Blob[] = [];
  private recordingStartTime = 0;

  constructor() {
    window.addEventListener('beforeunload', () => this.abort());
  }

  getStream(): MediaStream | null {
    return this.stream;
  }

  initStream(quality: Quality): Observable<void> {
    this.stopStream();
    const { width, height } = RESOLUTION_MAP[quality];
    return from(
      navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: width }, height: { ideal: height } },
        audio: true,
      }),
    ).pipe(
      switchMap(stream => {
        this.stream = stream;
        return of(undefined as void);
      }),
    );
  }

  start(): void {
    if (!this.stream) throw new Error('No stream available');
    this.chunks = [];
    this.recordingStartTime = Date.now();
    this.mediaRecorder = new MediaRecorder(this.stream, { mimeType: this.getMimeType() });
    this.mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) this.chunks.push(e.data);
    };
    this.mediaRecorder.start(100);
  }

  stop(): Observable<RecordingResult> {
    return new Observable<RecordingResult>(subscriber => {
      if (!this.mediaRecorder || this.mediaRecorder.state === 'inactive') {
        subscriber.error(new Error('MediaRecorder not active'));
        return;
      }
      const durationMs = Date.now() - this.recordingStartTime;
      const mimeType = this.getMimeType();

      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.chunks, { type: mimeType });
        this.chunks = [];

        captureThumbnail(blob).subscribe({
          next: thumbnailDataUrl => {
            const now = new Date();
            const meta: VideoMeta = {
              id: uuidv4(),
              name: `Recording ${now.toISOString().slice(0, 19).replace('T', ' ')}`,
              date: now.toISOString(),
              durationMs,
              quality: this.getCurrentQuality(),
              thumbnailDataUrl,
            };
            subscriber.next({ meta, blob });
            subscriber.complete();
          },
          error: err => subscriber.error(err),
        });
      };

      this.mediaRecorder.onerror = () => {
        this.abort();
        subscriber.error(new Error('MediaRecorder error'));
      };

      this.mediaRecorder.stop();
    });
  }

  abort(): void {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
    this.chunks = [];
    this.mediaRecorder = null;
  }

  private stopStream(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(t => t.stop());
      this.stream = null;
    }
  }

  private getMimeType(): string {
    const types = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm', 'video/mp4'];
    return types.find(t => MediaRecorder.isTypeSupported(t)) ?? '';
  }

  private getCurrentQuality(): Quality {
    if (!this.stream) return 'medium';
    const settings = this.stream.getVideoTracks()[0]?.getSettings();
    if (!settings?.width) return 'medium';
    if (settings.width >= 1920) return 'high';
    if (settings.width >= 1280) return 'medium';
    return 'low';
  }
}
