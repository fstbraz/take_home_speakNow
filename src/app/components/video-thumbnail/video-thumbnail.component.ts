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
    <div
      class="card"
      role="button"
      tabindex="0"
      [attr.aria-label]="'Play ' + meta().name"
      (click)="play.emit(meta().id)"
      (keydown.enter)="play.emit(meta().id)"
    >
      <div class="thumb-wrap">
        <img [src]="meta().thumbnailDataUrl" [alt]="meta().name" class="thumb" />
        <div class="overlay">
          <button
            class="overlay-btn play-btn"
            (click)="$event.stopPropagation(); play.emit(meta().id)"
            aria-label="Play"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </button>
          <button
            class="overlay-btn delete-btn"
            (click)="$event.stopPropagation(); delete.emit(meta().id)"
            aria-label="Delete"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
            </svg>
          </button>
        </div>
        <span class="duration">{{ formatDuration(meta().durationMs) }}</span>
      </div>
      <div class="info">
        <span class="name" [title]="meta().name">{{ meta().name }}</span>
        <div class="meta-row">
          <span class="quality">{{ meta().quality.toUpperCase() }}</span>
          <span class="date">{{ formatDate(meta().date) }}</span>
        </div>
      </div>
    </div>
  `,
  styles: `
    .card {
      width: 260px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 6px;
      overflow: hidden;
      cursor: pointer;
      transition: background 0.15s;
      outline: none;

      &:hover, &:focus-visible {
        background: rgba(255, 255, 255, 0.09);

        .overlay { opacity: 1; }
      }
    }

    .thumb-wrap {
      position: relative;
      width: 260px;
      height: 180px;
      background: #111;
      flex-shrink: 0;
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
      background: rgba(0, 0, 0, 0.55);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 20px;
      opacity: 0;
      transition: opacity 0.15s;
    }

    .overlay-btn {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.15s;
    }

    .play-btn {
      background: rgba(255, 255, 255, 0.2);
      color: #fff;

      &:hover { background: rgba(255, 255, 255, 0.35); }
    }

    .delete-btn {
      background: rgba(229, 57, 53, 0.3);
      color: #ff6b6b;

      &:hover { background: rgba(229, 57, 53, 0.6); }
    }

    .duration {
      position: absolute;
      bottom: 6px;
      right: 8px;
      font-size: 11px;
      font-weight: 700;
      color: #fff;
      background: rgba(0, 0, 0, 0.6);
      padding: 2px 6px;
      border-radius: 4px;
    }

    .info {
      padding: 8px 10px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .name {
      font-size: 12px;
      font-weight: 700;
      color: rgba(255, 255, 255, 0.85);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .meta-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .quality {
      font-size: 10px;
      font-weight: 700;
      color: rgba(80, 97, 208, 0.9);
      letter-spacing: 0.5px;
    }

    .date {
      font-size: 10px;
      color: rgba(255, 255, 255, 0.35);
    }
  `,
})
export class VideoThumbnailComponent {
  meta = input.required<VideoMeta>();
  play = output<string>();
  delete = output<string>();

  formatDuration = formatDuration;
  formatDate = formatDate;
}
