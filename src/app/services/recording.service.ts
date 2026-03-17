import { Injectable } from '@angular/core';
import { Quality } from '../state/bandwidth.state';
import { VideoMeta } from '../state/videos.state';

export interface RecordingResult {
  meta: VideoMeta;
  blob: Blob;
}

@Injectable({ providedIn: 'root' })
export class RecordingService {
  readonly isSupported = typeof MediaRecorder !== 'undefined';
  private stream: MediaStream | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private chunks: Blob[] = [];

  private readonly resolutionMap: Record<Quality, { width: number; height: number }> = {
    low: { width: 640, height: 360 },
    medium: { width: 1280, height: 720 },
    high: { width: 1920, height: 1080 },
  };

  constructor() {
    window.addEventListener('beforeunload', () => this.abort());
  }

  getStream(): MediaStream | null {
    return this.stream;
  }

  async initStream(quality: Quality): Promise<void> {
    // Implemented in Step 3
    this.stream = null;
  }

  start(): void {
    // Implemented in Step 4
  }

  async stop(): Promise<RecordingResult> {
    // Implemented in Steps 4 & 5
    throw new Error('Not implemented');
  }

  abort(): void {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
    this.chunks = [];
    this.mediaRecorder = null;
  }
}
