import { TestBed } from '@angular/core/testing';
import { provideStore } from '@ngxs/store';
import { provideZonelessChangeDetection } from '@angular/core';
import { of } from 'rxjs';
import { App } from './app';
import { BandwidthState } from './state/bandwidth.state';
import { RecordingState } from './state/recording.state';
import { VideosState } from './state/videos.state';
import { VideoStorageService } from './services/video-storage.service';
import { RecordingService } from './services/recording.service';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideZonelessChangeDetection(),
        provideStore([BandwidthState, RecordingState, VideosState]),
        {
          provide: VideoStorageService,
          useValue: {
            getAllMeta: () => of([]),
            saveVideo: () => of(undefined),
            deleteVideo: () => of(undefined),
            getBlobUrl: () => of(null),
          },
        },
        {
          provide: RecordingService,
          useValue: {
            isSupported: false,
            getStream: () => null,
            initStream: () => of(undefined),
            start: () => {},
            stop: () => of({}),
            abort: () => {},
          },
        },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
