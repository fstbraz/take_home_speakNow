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
      align-items: center;
      justify-content: center;
    }

    .list {
      width: 100%;
      height: 100%;
      overflow-y: auto;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      box-sizing: border-box;
      justify-content: flex-start;
      align-self: flex-start;

      &::-webkit-scrollbar { width: 4px; }
      &::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 2px; }
    }
  `,
})
export class RecordedVideosSidebarComponent {
  private store = inject(Store);

  videos = this.store.selectSignal(VideosState.videos);

  play = output<string>();
  delete = output<string>();
}
