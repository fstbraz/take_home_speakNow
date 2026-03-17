import { Injectable } from '@angular/core';
import { Quality } from '../state/bandwidth.state';

const TEST_ASSET_URL = '/assets/bandwidth-test.bin';
const TEST_ASSET_SIZE_KB = 100;
const TIMEOUT_MS = 5000;

@Injectable({ providedIn: 'root' })
export class BandwidthService {
  async detect(): Promise<Quality> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
      const start = performance.now();

      await fetch(TEST_ASSET_URL, { signal: controller.signal, cache: 'no-store' });

      clearTimeout(timeoutId);
      const elapsedSec = (performance.now() - start) / 1000;
      const mbps = (TEST_ASSET_SIZE_KB * 8) / 1000 / elapsedSec;
      return this.mbpsToQuality(mbps);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return 'medium'; // timeout → medium
      }
      return 'low'; // network error → low
    }
  }

  private mbpsToQuality(mbps: number): Quality {
    if (mbps >= 5) return 'high';
    if (mbps >= 1) return 'medium';
    return 'low';
  }
}
