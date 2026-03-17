import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { Store } from '@ngxs/store';
import { RecordingState } from '../../state/recording.state';
import { RecordingService } from '../../services/recording.service';
import { StartRecording, StopRecording } from '../../state/recording.actions';
import { VideoPreviewComponent } from '../video-preview/video-preview.component';
import { RecorderControlsComponent } from '../recorder-controls/recorder-controls.component';

@Component({
  selector: 'app-video-recorder',
  standalone: true,
  imports: [VideoPreviewComponent, RecorderControlsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './video-recorder.component.html',
  styleUrl: './video-recorder.component.scss',
})
export class VideoRecorderComponent {
  private store = inject(Store);
  private recordingService = inject(RecordingService);

  status = this.store.selectSignal(RecordingState.status);
  errorMessage = this.store.selectSignal(RecordingState.errorMessage);

  stream = signal<MediaStream | null>(null);

  isError = computed(() => this.status() === 'error');

  constructor() {
    // Keep stream signal in sync whenever status changes
    effect(() => {
      this.status(); // track dependency
      this.stream.set(this.recordingService.getStream());
    });
  }

  onRecord(): void {
    this.store.dispatch(new StartRecording());
  }

  onStop(): void {
    this.store.dispatch(new StopRecording());
  }

  onSettings(): void {}
}
