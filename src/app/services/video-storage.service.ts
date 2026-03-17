import { Injectable } from '@angular/core';
import { VideoMeta } from '../state/videos.state';

@Injectable({ providedIn: 'root' })
export class VideoStorageService {
  async getAllMeta(): Promise<VideoMeta[]> {
    // Implemented in Step 6
    return [];
  }

  async saveVideo(_meta: VideoMeta, _blob: Blob): Promise<void> {
    // Implemented in Step 6
  }

  async getBlobUrl(_id: string): Promise<string | null> {
    // Implemented in Step 6
    return null;
  }

  async deleteVideo(_id: string): Promise<void> {
    // Implemented in Step 6
  }
}
