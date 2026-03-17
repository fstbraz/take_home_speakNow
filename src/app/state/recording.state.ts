import { inject, Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { catchError, EMPTY, finalize, switchMap, take, tap, timer } from 'rxjs';
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

const MAX_RECORDING_MS = 10_000;

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
  initializeCamera(ctx: StateContext<RecordingStateModel>) {
    if (ctx.getState().status === 'recording') return EMPTY;

    if (!this.recordingService.isSupported) {
      ctx.dispatch(new CameraError('MediaRecorder is not supported in this browser.'));
      return EMPTY;
    }

    ctx.patchState({ status: 'initializing', errorMessage: null });
    const quality = this.store.selectSnapshot(BandwidthState.quality);

    return this.recordingService.initStream(quality).pipe(
      tap(() => ctx.patchState({ status: 'idle' })),
      catchError((err: Error) => {
        ctx.dispatch(new CameraError(err.message ?? 'Camera initialization failed.'));
        return EMPTY;
      }),
    );
  }

  @Action(StartRecording)
  startRecording(ctx: StateContext<RecordingStateModel>) {
    if (ctx.getState().status !== 'idle') return EMPTY;
    this.recordingService.start();
    ctx.patchState({ status: 'recording' });

    // Auto-stop after MAX_RECORDING_MS
    return timer(MAX_RECORDING_MS).pipe(
      take(1),
      switchMap(() => {
        if (ctx.getState().status === 'recording') {
          return ctx.dispatch(new StopRecording());
        }
        return EMPTY;
      }),
    );
  }

  @Action(StopRecording)
  stopRecording(ctx: StateContext<RecordingStateModel>) {
    if (ctx.getState().status !== 'recording') return EMPTY;
    ctx.patchState({ status: 'stopping' });

    return this.recordingService.stop().pipe(
      tap(({ meta, blob }) => ctx.dispatch(new SaveVideo(meta, blob))),
      catchError(() => EMPTY),
      finalize(() => ctx.patchState({ status: 'idle' })),
    );
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
