import { ApplicationConfig, provideAppInitializer, provideZonelessChangeDetection } from '@angular/core';
import { inject } from '@angular/core';
import { tap } from 'rxjs';
import { provideStore, Store } from '@ngxs/store';
import { BandwidthState } from './state/bandwidth.state';
import { RecordingState } from './state/recording.state';
import { VideosState } from './state/videos.state';
import { DetectBandwidth } from './state/bandwidth.actions';
import { InitializeCamera } from './state/recording.actions';
import { LoadVideos } from './state/videos.actions';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideStore([BandwidthState, RecordingState, VideosState]),
    provideAppInitializer(() => {
      const store = inject(Store);
      return store.dispatch(new DetectBandwidth()).pipe(
        tap(() => {
          store.dispatch(new InitializeCamera());
          store.dispatch(new LoadVideos());
        }),
      );
    }),
  ],
};
