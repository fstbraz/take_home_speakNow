import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { BandwidthService } from './bandwidth.service';

describe('BandwidthService', () => {
  let service: BandwidthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), BandwidthService],
    });
    service = TestBed.inject(BandwidthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return "low" when fetch fails with a non-abort error', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new TypeError('Network error'));
    const quality = await firstValueFrom(service.detect());
    expect(quality).toBe('low');
  });

  it('should return "medium" when fetch is aborted (timeout)', async () => {
    const abortError = new DOMException('Aborted', 'AbortError');
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(abortError);
    const quality = await firstValueFrom(service.detect());
    expect(quality).toBe('medium');
  });

  it('should return "high" for fast connections (>5 Mbps)', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(new Response());
    // Spy on performance.now to simulate near-instant response (~100ms for 100KB = 8Mbps)
    let calls = 0;
    vi.spyOn(performance, 'now').mockImplementation(() => (calls++ === 0 ? 0 : 100));
    const quality = await firstValueFrom(service.detect());
    expect(quality).toBe('high');
  });

  it('should return "medium" for moderate connections (1-5 Mbps)', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(new Response());
    let calls = 0;
    // 100KB at ~2Mbps ≈ 400ms
    vi.spyOn(performance, 'now').mockImplementation(() => (calls++ === 0 ? 0 : 400));
    const quality = await firstValueFrom(service.detect());
    expect(quality).toBe('medium');
  });

  it('should return "low" for slow connections (<1 Mbps)', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(new Response());
    let calls = 0;
    // 100KB at <1Mbps > 800ms
    vi.spyOn(performance, 'now').mockImplementation(() => (calls++ === 0 ? 0 : 900));
    const quality = await firstValueFrom(service.detect());
    expect(quality).toBe('low');
  });
});
