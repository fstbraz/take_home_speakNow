import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval } from 'rxjs';
import { RecordingStatus } from '../../state/recording.state';

@Component({
  selector: 'app-recorder-controls',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="controls">
      <div class="elapsed" [class.visible]="isRecording()">
        <span class="dot"></span>
        {{ elapsedDisplay() }}
      </div>

      @if (isRecording()) {
        <button class="btn btn-stop" (click)="stop.emit()" aria-label="Stop recording">
          <span class="icon-stop"></span>
          Stop
        </button>
      } @else {
        <button
          class="btn btn-record"
          (click)="record.emit()"
          [disabled]="!canRecord()"
          aria-label="Start recording"
        >
          <span class="icon-rec"></span>
          Record
        </button>
      }

      <button
        class="btn btn-settings"
        (click)="settings.emit()"
        [disabled]="isRecording()"
        aria-label="Open settings"
      >
        ⚙
      </button>
    </div>
  `,
  styles: `
    .controls {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      padding: 16px 0;
    }

    .elapsed {
      font-size: 13px;
      color: #888;
      height: 20px;
      display: flex;
      align-items: center;
      gap: 6px;
      visibility: hidden;

      &.visible {
        visibility: visible;
        color: #e55;
      }
    }

    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #e55;
      animation: blink 1s step-start infinite;
    }

    @keyframes blink {
      50% { opacity: 0; }
    }

    .btn {
      width: 100%;
      padding: 10px 0;
      border: none;
      border-radius: 6px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: opacity 0.15s;

      &:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }
    }

    .btn-record {
      background: #e53935;
      color: #fff;
      &:not(:disabled):hover { opacity: 0.85; }
    }

    .btn-stop {
      background: #333;
      color: #fff;
      border: 2px solid #e53935;
      &:hover { opacity: 0.85; }
    }

    .btn-settings {
      background: transparent;
      color: #aaa;
      font-size: 20px;
      padding: 6px 0;
      &:not(:disabled):hover { color: #fff; }
    }

    .icon-rec {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: currentColor;
      display: inline-block;
    }

    .icon-stop {
      width: 12px;
      height: 12px;
      border-radius: 2px;
      background: currentColor;
      display: inline-block;
    }
  `,
})
export class RecorderControlsComponent {
  private destroyRef = inject(DestroyRef);

  status = input.required<RecordingStatus>();

  record = output<void>();
  stop = output<void>();
  settings = output<void>();

  isRecording = computed(() => this.status() === 'recording');
  canRecord = computed(() => this.status() === 'idle');

  private elapsedMs = signal(0);
  private startMs = signal(0);

  elapsedDisplay = computed(() => {
    const s = Math.floor(this.elapsedMs() / 1000);
    const m = Math.floor(s / 60);
    const ss = String(s % 60).padStart(2, '0');
    return `${m}:${ss}`;
  });

  constructor() {
    // Tick every second while recording to update the elapsed display
    interval(1000)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        if (this.isRecording()) {
          this.elapsedMs.set(Date.now() - this.startMs());
        }
      });

    // Reset / capture start time when recording state changes
    effect(() => {
      if (this.isRecording()) {
        this.startMs.set(Date.now());
        this.elapsedMs.set(0);
      } else {
        this.elapsedMs.set(0);
      }
    });
  }
}
