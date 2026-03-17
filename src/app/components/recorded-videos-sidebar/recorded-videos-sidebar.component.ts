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
  template: `
    <div class="sidebar">
      <h2 class="title">Recordings</h2>

      @if (videos().length === 0) {
        <app-empty-state />
      } @else {
        <div class="list">
          @for (video of videos(); track video.id) {
            <app-video-thumbnail
              [meta]="video"
              (play)="play.emit($event)"
              (delete)="delete.emit($event)"
            />
          }
        </div>
      }
    </div>
  `,
  styles: `
    .sidebar {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
    }

    .title {
      margin: 0;
      padding: 12px 16px;
      font-size: 13px;
      font-weight: 700;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      border-bottom: 1px solid #222;
    }

    .list {
      flex: 1;
      overflow-y: auto;
      padding: 8px;
      display: flex;
      flex-direction: column;
      gap: 8px;

      &::-webkit-scrollbar { width: 4px; }
      &::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }
    }
  `,
})
export class RecordedVideosSidebarComponent {
  private store = inject(Store);

  videos = this.store.selectSignal(VideosState.videos);

  play = output<string>();
  delete = output<string>();
}
