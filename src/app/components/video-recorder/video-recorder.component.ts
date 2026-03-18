import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { Store } from '@ngxs/store';
import { RecordingState } from '../../state/recording.state';
import { BandwidthState } from '../../state/bandwidth.state';
import { RecordingService } from '../../services/recording.service';
import { VideoStorageService } from '../../services/video-storage.service';
import { StartRecording, StopRecording } from '../../state/recording.actions';
import { DeleteVideo } from '../../state/videos.actions';
import { VideoPreviewComponent } from '../video-preview/video-preview.component';
import { SpinnerComponent } from '../spinner/spinner.component';
import { RecorderControlsComponent } from '../recorder-controls/recorder-controls.component';
import { RecordedVideosSidebarComponent } from '../recorded-videos-sidebar/recorded-videos-sidebar.component';
import { VideoPlayerModalComponent } from '../video-player-modal/video-player-modal.component';
import { DeleteConfirmDialogComponent } from '../delete-confirm-dialog/delete-confirm-dialog.component';
import { SettingsPanelComponent } from '../settings-panel/settings-panel.component';
import { ToastComponent } from '../toast/toast.component';

@Component({
  selector: 'app-video-recorder',
  standalone: true,
  imports: [
    VideoPreviewComponent,
    SpinnerComponent,
    RecorderControlsComponent,
    RecordedVideosSidebarComponent,
    VideoPlayerModalComponent,
    DeleteConfirmDialogComponent,
    SettingsPanelComponent,
    ToastComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './video-recorder.component.html',
  styleUrl: './video-recorder.component.scss',
})
export class VideoRecorderComponent {
  private store = inject(Store);
  private recordingService = inject(RecordingService);
  private storage = inject(VideoStorageService);

  status = this.store.selectSignal(RecordingState.status);
  errorMessage = this.store.selectSignal(RecordingState.errorMessage);
  currentQuality = this.store.selectSignal(BandwidthState.quality);
  recommendedQuality = this.store.selectSignal(BandwidthState.quality);

  stream = signal<MediaStream | null>(null);
  activeBlobUrl = signal<string | null>(null);
  deleteTargetId = signal<string | null>(null);
  settingsOpen = signal(false);

  isError = computed(() => this.status() === 'error');

  constructor() {
    effect(() => {
      this.status();
      this.stream.set(this.recordingService.getStream());
    });
  }

  onRecord(): void {
    this.store.dispatch(new StartRecording());
  }

  onStop(): void {
    this.store.dispatch(new StopRecording());
  }

  onSettings(): void {
    this.settingsOpen.set(true);
  }

  onPlay(id: string): void {
    this.storage.getBlobUrl(id).subscribe(url => {
      if (url) this.activeBlobUrl.set(url);
    });
  }

  onClosePlayer(): void {
    const url = this.activeBlobUrl();
    if (url) URL.revokeObjectURL(url);
    this.activeBlobUrl.set(null);
  }

  onDeleteRequest(id: string): void {
    this.deleteTargetId.set(id);
  }

  onDeleteConfirm(id: string): void {
    this.store.dispatch(new DeleteVideo(id));
    this.deleteTargetId.set(null);
  }

  onDeleteCancel(): void {
    this.deleteTargetId.set(null);
  }
}
