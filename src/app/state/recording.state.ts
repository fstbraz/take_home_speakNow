import { inject, Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { RecordingService } from '../services/recording.service';
import { BandwidthState } from './bandwidth.state';
import {
  AbortRecording,
  CameraError,
  InitializeCamera,
  StartRecording,
  StopRecording,
} from './recording.actions';
import { SaveVideo } from './videos.actions';

export type RecordingStatus = 'idle' | 'initializing' | 'recording' | 'stopping' | 'error';

export interface RecordingStateModel {
  status: RecordingStatus;
  errorMessage: string | null;
}

@State<RecordingStateModel>({
  name: 'recording',
  defaults: { status: 'idle', errorMessage: null },
})
@Injectable()
export class RecordingState {
  private recordingService = inject(RecordingService);
  private store = inject(Store);

  @Selector()
  static status(state: RecordingStateModel): RecordingStatus {
    return state.status;
  }

  @Selector()
  static errorMessage(state: RecordingStateModel): string | null {
    return state.errorMessage;
  }

  @Action(InitializeCamera)
  async initializeCamera(ctx: StateContext<RecordingStateModel>): Promise<void> {
    const currentStatus = ctx.getState().status;
    if (currentStatus === 'recording') return; // guard: no restart during recording

    if (!this.recordingService.isSupported) {
      ctx.dispatch(new CameraError('MediaRecorder is not supported in this browser.'));
      return;
    }

    ctx.patchState({ status: 'initializing', errorMessage: null });
    const quality = this.store.selectSnapshot(BandwidthState.quality);
    try {
      await this.recordingService.initStream(quality);
      ctx.patchState({ status: 'idle' });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Camera initialization failed.';
      ctx.dispatch(new CameraError(msg));
    }
  }

  @Action(StartRecording)
  startRecording(ctx: StateContext<RecordingStateModel>): void {
    if (ctx.getState().status !== 'idle') return;
    this.recordingService.start();
    ctx.patchState({ status: 'recording' });
  }

  @Action(StopRecording)
  async stopRecording(ctx: StateContext<RecordingStateModel>): Promise<void> {
    ctx.patchState({ status: 'stopping' });
    try {
      const { meta, blob } = await this.recordingService.stop();
      await ctx.dispatch(new SaveVideo(meta, blob)).toPromise();
    } finally {
      ctx.patchState({ status: 'idle' });
    }
  }

  @Action(AbortRecording)
  abortRecording(ctx: StateContext<RecordingStateModel>): void {
    this.recordingService.abort();
    ctx.patchState({ status: 'idle' });
  }

  @Action(CameraError)
  cameraError(ctx: StateContext<RecordingStateModel>, action: CameraError): void {
    ctx.patchState({ status: 'error', errorMessage: action.message });
  }
}
