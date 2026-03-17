import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  OnDestroy,
  OnInit,
  output,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'app-video-player-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="backdrop" (click)="close.emit()" role="dialog" aria-modal="true" aria-label="Video playback">
      <div class="modal" (click)="$event.stopPropagation()">
        <button class="btn-close" (click)="close.emit()" aria-label="Close">✕</button>
        <video
          #videoEl
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
      background: #111;
      border-radius: 8px;
      overflow: hidden;
      width: min(1200px, 90vw);
      box-shadow: 0 24px 64px rgba(0, 0, 0, 0.6);
    }

    .player {
      display: block;
      width: 100%;
      max-height: 80vh;
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
      width: 32px;
      height: 32px;
      color: #fff;
      font-size: 14px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.15s;

      &:hover { background: rgba(229, 57, 53, 0.8); }
    }
  `,
})
export class VideoPlayerModalComponent implements OnInit, OnDestroy {
  blobUrl = input.required<string>();
  close = output<void>();

  private videoEl = viewChild<ElementRef<HTMLVideoElement>>('videoEl');

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
