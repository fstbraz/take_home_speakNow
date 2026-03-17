import { Injectable } from '@angular/core';
import { catchError, from, map, Observable, of, race, tap, timer } from 'rxjs';
import { Quality } from '../state/bandwidth.state';

const TEST_ASSET_URL = '/assets/bandwidth-test.bin';
const TEST_ASSET_SIZE_KB = 100;
const TIMEOUT_MS = 5000;

@Injectable({ providedIn: 'root' })
export class BandwidthService {
  detect(): Observable<Quality> {
    const controller = new AbortController();
    const start = performance.now();

    const fetch$ = from(
      fetch(TEST_ASSET_URL, { signal: controller.signal, cache: 'no-store' }),
    ).pipe(
      map(() => {
        const elapsedSec = (performance.now() - start) / 1000;
        const mbps = (TEST_ASSET_SIZE_KB * 8) / 1000 / elapsedSec;
        return this.mbpsToQuality(mbps);
      }),
      catchError((err: Error) =>
        // AbortError means timeout won the race; other errors → low quality
        of(err.name === 'AbortError' ? ('medium' as Quality) : ('low' as Quality)),
      ),
    );

    const timeout$ = timer(TIMEOUT_MS).pipe(
      tap(() => controller.abort()),
      map(() => 'medium' as Quality),
    );

    return race(fetch$, timeout$);
  }

  private mbpsToQuality(mbps: number): Quality {
    if (mbps >= 5) return 'high';
    if (mbps >= 1) return 'medium';
    return 'low';
  }
}
