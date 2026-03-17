import { APP_INITIALIZER, ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideStore, Store } from '@ngxs/store';
import { BandwidthState } from './state/bandwidth.state';
import { RecordingState } from './state/recording.state';
import { VideosState } from './state/videos.state';
import { DetectBandwidth } from './state/bandwidth.actions';
import { InitializeCamera } from './state/recording.actions';
import { LoadVideos } from './state/videos.actions';

function initApp(store: Store): () => Promise<void> {
  return async () => {
    await store.dispatch(new DetectBandwidth()).toPromise();
    store.dispatch(new InitializeCamera());
    store.dispatch(new LoadVideos());
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideStore([BandwidthState, RecordingState, VideosState]),
    {
      provide: APP_INITIALIZER,
      useFactory: initApp,
      deps: [Store],
      multi: true,
    },
  ],
};
