import { TestBed } from '@angular/core/testing';
import { provideStore, Store } from '@ngxs/store';
import { provideZonelessChangeDetection } from '@angular/core';
import { of, throwError } from 'rxjs';
import { VideosState, VideoMeta } from './videos.state';
import { VideoStorageService } from '../services/video-storage.service';
import { DeleteVideo, LoadVideos, SaveVideo, SaveVideoFailed } from './videos.actions';

const mockMeta: VideoMeta = {
  id: 'test-id',
  name: 'Test recording',
  date: new Date().toISOString(),
  durationMs: 5000,
  quality: 'medium',
  thumbnailDataUrl: 'data:image/png;base64,abc',
};

describe('VideosState', () => {
  let store: Store;
  let storage: VideoStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideStore([VideosState]),
        {
          provide: VideoStorageService,
          useValue: {
            getAllMeta: vi.fn(() => of([])),
            saveVideo: vi.fn(() => of(undefined)),
            deleteVideo: vi.fn(() => of(undefined)),
            getBlobUrl: vi.fn(() => of(null)),
          },
        },
      ],
    });
    store = TestBed.inject(Store);
    storage = TestBed.inject(VideoStorageService);
  });

  it('should start with empty videos list', () => {
    expect(store.selectSnapshot(VideosState.videos)).toEqual([]);
  });

  it('should populate videos on LoadVideos', async () => {
    vi.mocked(storage.getAllMeta).mockReturnValue(of([mockMeta]));
    await store.dispatch(new LoadVideos()).toPromise();
    expect(store.selectSnapshot(VideosState.videos)).toEqual([mockMeta]);
  });

  it('should append video to state after SaveVideo succeeds', async () => {
    await store.dispatch(new SaveVideo(mockMeta, new Blob())).toPromise();
    expect(store.selectSnapshot(VideosState.videos)).toContain(mockMeta);
  });

  it('should dispatch SaveVideoFailed when storage throws', async () => {
    vi.mocked(storage.saveVideo).mockReturnValue(throwError(() => new Error('IDB error')));
    await store.dispatch(new SaveVideo(mockMeta, new Blob())).toPromise();
    expect(store.selectSnapshot(VideosState.lastSaveError)).toBeTruthy();
  });

  it('should remove video optimistically on DeleteVideo', async () => {
    await store.dispatch(new SaveVideo(mockMeta, new Blob())).toPromise();
    await store.dispatch(new DeleteVideo(mockMeta.id)).toPromise();
    expect(store.selectSnapshot(VideosState.videos)).not.toContain(mockMeta);
  });

  it('should restore video on DeleteVideoFailed', async () => {
    vi.mocked(storage.deleteVideo).mockReturnValue(throwError(() => new Error('IDB error')));
    await store.dispatch(new SaveVideo(mockMeta, new Blob())).toPromise();
    await store.dispatch(new DeleteVideo(mockMeta.id)).toPromise();
    const videos = store.selectSnapshot(VideosState.videos);
    expect(videos.some(v => v.id === mockMeta.id)).toBe(true);
  });

  it('should set lastSaveError on SaveVideoFailed', async () => {
    await store.dispatch(new SaveVideoFailed('Something went wrong')).toPromise();
    expect(store.selectSnapshot(VideosState.lastSaveError)).toBe('Something went wrong');
  });
});
