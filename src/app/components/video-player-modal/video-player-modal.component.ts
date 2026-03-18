import {
  ChangeDetectionStrategy,
  Component,
  input,
  OnDestroy,
  OnInit,
  output,
} from '@angular/core';

@Component({
  selector: 'app-video-player-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="backdrop" (click)="close.emit()" role="dialog" aria-modal="true" aria-label="Video playback">
      <div class="modal" (click)="$event.stopPropagation()">
        <button class="btn-close" (click)="close.emit()" aria-label="Close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
        <video
          [src]="blobUrl()"
          controls
          autoplay
          class="player"
        ></video>
      </div>
    </div>
  `,
  styles: `
    .backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.85);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 100;
    }

    .modal {
      position: relative;
      background: #000;
      border-radius: 8px;
      overflow: hidden;
      width: min(1200px, 92vw);
      height: min(800px, 80vh);
      box-shadow: 0 24px 64px rgba(0, 0, 0, 0.7);
    }

    .player {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: contain;
      background: #000;
    }

    .btn-close {
      position: absolute;
      top: 12px;
      right: 12px;
      z-index: 1;
      background: rgba(0, 0, 0, 0.6);
      border: none;
      border-radius: 50%;
      width: 36px;
      height: 36px;
      color: rgba(255, 255, 255, 0.8);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.15s;

      &:hover { background: rgba(229, 57, 53, 0.8); color: #fff; }
    }
  `,
})
export class VideoPlayerModalComponent implements OnInit, OnDestroy {
  blobUrl = input.required<string>();
  close = output<void>();

  ngOnInit(): void {
    document.addEventListener('keydown', this.onKeydown);
  }

  ngOnDestroy(): void {
    document.removeEventListener('keydown', this.onKeydown);
  }

  private onKeydown = (e: KeyboardEvent): void => {
    if (e.key === 'Escape') this.close.emit();
  };
}
