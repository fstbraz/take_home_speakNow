import { inject, Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { catchError, EMPTY, tap } from 'rxjs';
import { BandwidthService } from '../services/bandwidth.service';
import { BandwidthDetectionFailed, DetectBandwidth, SetQuality } from './bandwidth.actions';
import { InitializeCamera } from './recording.actions';

export type Quality = 'low' | 'medium' | 'high';

export interface BandwidthStateModel {
  quality: Quality;
  detectionFailed: boolean;
}

@State<BandwidthStateModel>({
  name: 'bandwidth',
  defaults: { quality: 'medium', detectionFailed: false },
})
@Injectable()
export class BandwidthState {
  private bandwidthService = inject(BandwidthService);
  private store = inject(Store);

  @Selector()
  static quality(state: BandwidthStateModel): Quality {
    return state.quality;
  }

  @Selector()
  static detectionFailed(state: BandwidthStateModel): boolean {
    return state.detectionFailed;
  }

  @Action(DetectBandwidth)
  detectBandwidth(ctx: StateContext<BandwidthStateModel>) {
    return this.bandwidthService.detect().pipe(
      tap(quality => ctx.patchState({ quality, detectionFailed: false })),
      catchError(() => {
        ctx.patchState({ quality: 'medium', detectionFailed: true });
        ctx.dispatch(new BandwidthDetectionFailed());
        return EMPTY;
      }),
    );
  }

  @Action(SetQuality)
  setQuality(ctx: StateContext<BandwidthStateModel>, action: SetQuality) {
    ctx.patchState({ quality: action.quality });
    this.store.dispatch(new InitializeCamera());
  }

  @Action(BandwidthDetectionFailed)
  bandwidthDetectionFailed(ctx: StateContext<BandwidthStateModel>): void {
    ctx.patchState({ detectionFailed: true });
  }
}
