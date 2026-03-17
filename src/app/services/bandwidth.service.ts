import { Injectable } from '@angular/core';
import { Quality } from '../state/bandwidth.state';

@Injectable({ providedIn: 'root' })
export class BandwidthService {
  async detect(): Promise<Quality> {
    // Implemented in Step 2
    return 'medium';
  }
}
