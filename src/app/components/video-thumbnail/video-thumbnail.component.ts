import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { VideoMeta } from '../../state/videos.state';

function formatDuration(ms: number): string {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const ss = String(s % 60).padStart(2, '0');
  return `${m}:${ss}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

@Component({
  selector: 'app-video-thumbnail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card" (click)="play.emit(meta().id)" role="button" [attr.aria-label]="'Play ' + meta().name" tabindex="0" (keydown.enter)="play.emit(meta().id)">
      <div class="thumb-wrap">
        <img [src]="meta().thumbnailDataUrl" [alt]="meta().name" class="thumb" />
        <div class="overlay">
          <button class="btn-play" (click)="$event.stopPropagation(); play.emit(meta().id)" aria-label="Play">▶</button>
          <button class="btn-delete" (click)="$event.stopPropagation(); delete.emit(meta().id)" aria-label="Delete">✕</button>
        </div>
      </div>
      <div class="info">
        <span class="name" [title]="meta().name">{{ meta().name }}</span>
        <span class="meta-row">
          <span class="duration">{{ duration() }}</span>
          <span class="quality">{{ meta().quality }}</span>
        </span>
        <span class="date">{{ date() }}</span>
      </div>
    </div>
  `,
  styles: `
    .card {
      background: #1e1e1e;
      border-radius: 6px;
      overflow: hidden;
      cursor: pointer;
      transition: background 0.15s;

      &:hover {
        background: #252525;

        .overlay { opacity: 1; }
      }
    }

    .thumb-wrap {
      position: relative;
      width: 100%;
      aspect-ratio: 16/9;
      background: #111;
    }

    .thumb {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .overlay {
      position: absolute;
      inset: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      opacity: 0;
      transition: opacity 0.15s;
    }

    .btn-play, .btn-delete {
      background: rgba(255,255,255,0.15);
      border: none;
      border-radius: 50%;
      width: 36px;
      height: 36px;
      color: #fff;
      font-size: 14px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.15s;

      &:hover { background: rgba(255,255,255,0.3); }
    }

    .btn-delete:hover { background: rgba(229,57,53,0.6); }

    .info {
      padding: 8px 10px;
      display: flex;
      flex-direction: column;
      gap: 3px;
    }

    .name {
      font-size: 12px;
      font-weight: 600;
      color: #ddd;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .meta-row {
      display: flex;
      justify-content: space-between;
      font-size: 11px;
    }

    .duration { color: #aaa; }

    .quality {
      color: #666;
      text-transform: uppercase;
      font-size: 10px;
      letter-spacing: 0.5px;
    }

    .date {
      font-size: 10px;
      color: #555;
    }
  `,
})
export class VideoThumbnailComponent {
  meta = input.required<VideoMeta>();
  play = output<string>();
  delete = output<string>();

  duration = () => formatDuration(this.meta().durationMs);
  date = () => formatDate(this.meta().date);
}
