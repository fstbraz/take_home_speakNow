import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { Store } from '@ngxs/store';
import { VideosState } from '../../state/videos.state';
import { EmptyStateComponent } from '../empty-state/empty-state.component';
import { VideoThumbnailComponent } from '../video-thumbnail/video-thumbnail.component';

@Component({
  selector: 'app-recorded-videos-sidebar',
  standalone: true,
  imports: [EmptyStateComponent, VideoThumbnailComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './recorded-videos-sidebar.component.html',
  styleUrl: './recorded-videos-sidebar.component.scss',
})
export class RecordedVideosSidebarComponent {
  private store = inject(Store);

  videos = this.store.selectSignal(VideosState.videos);

  play = output<string>();
  delete = output<string>();
}
