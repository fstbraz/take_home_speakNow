import { inject, Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { BandwidthService } from '../services/bandwidth.service';
import { DetectBandwidth, SetQuality } from './bandwidth.actions';
import { InitializeCamera } from './recording.actions';

export type Quality = 'low' | 'medium' | 'high';

export interface BandwidthStateModel {
  quality: Quality;
}

@State<BandwidthStateModel>({
  name: 'bandwidth',
  defaults: { quality: 'medium' },
})
@Injectable()
export class BandwidthState {
  private bandwidthService = inject(BandwidthService);
  private store = inject(Store);

  @Selector()
  static quality(state: BandwidthStateModel): Quality {
    return state.quality;
  }

  @Action(DetectBandwidth)
  async detectBandwidth(ctx: StateContext<BandwidthStateModel>): Promise<void> {
    const quality = await this.bandwidthService.detect();
    ctx.patchState({ quality });
  }

  @Action(SetQuality)
  setQuality(ctx: StateContext<BandwidthStateModel>, action: SetQuality): void {
    ctx.patchState({ quality: action.quality });
    // Restart camera stream at new quality (no-op if currently recording — guard in InitializeCamera)
    this.store.dispatch(new InitializeCamera());
  }
}
