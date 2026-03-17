import { APP_INITIALIZER, ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs';
import { provideStore, Store } from '@ngxs/store';
import { BandwidthState } from './state/bandwidth.state';
import { RecordingState } from './state/recording.state';
import { VideosState } from './state/videos.state';
import { DetectBandwidth } from './state/bandwidth.actions';
import { InitializeCamera } from './state/recording.actions';
import { LoadVideos } from './state/videos.actions';

function initApp(store: Store): () => Observable<void> {
  return () =>
    store.dispatch(new DetectBandwidth()).pipe(
      tap(() => {
        store.dispatch(new InitializeCamera());
        store.dispatch(new LoadVideos());
      }),
    );
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideStore([BandwidthState, RecordingState, VideosState]),
    {
      provide: APP_INITIALIZER,
      useFactory: initApp,
      deps: [Store],
      multi: true,
    },
  ],
};
