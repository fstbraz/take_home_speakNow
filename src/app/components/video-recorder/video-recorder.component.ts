import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { Store } from '@ngxs/store';
import { RecordingState } from '../../state/recording.state';
import { RecordingService } from '../../services/recording.service';
import { VideoPreviewComponent } from '../video-preview/video-preview.component';

@Component({
  selector: 'app-video-recorder',
  standalone: true,
  imports: [VideoPreviewComponent],
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
}
