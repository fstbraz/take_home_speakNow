import { firstValueFrom } from 'rxjs';
import { captureThumbnail } from './thumbnail.util';

describe('captureThumbnail', () => {
  it('should return an Observable with a subscribe method', () => {
    const result = captureThumbnail(new Blob(['fake'], { type: 'video/webm' }));
    expect(typeof result.subscribe).toBe('function');
  });

  it('should error when video fires onerror', async () => {
    // Intercept video element creation so we can fire onerror synchronously
    const realCreate = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      const el = realCreate(tag);
      if (tag === 'video') {
        // Fire onerror on the next microtask after src is assigned
        Object.defineProperty(el, 'src', {
          set() {
            Promise.resolve().then(() => (el as HTMLVideoElement).onerror?.(new Event('error')));
          },
        });
      }
      return el;
    });

    let errored = false;
    await firstValueFrom(captureThumbnail(new Blob(['x'], { type: 'video/webm' }))).catch(
      () => (errored = true),
    );

    expect(errored).toBe(true);
    vi.restoreAllMocks();
  });
});
