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

const MAX_MS = 10_000;

@Component({
  selector: 'app-recorder-controls',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="pill">
      @if (isRecording()) {
        <!-- Stop button + progress bar -->
        <button class="btn-stop" (click)="stop.emit()" aria-label="Stop recording">
          <span class="stop-icon"></span>
        </button>
        <div class="progress-wrap" aria-label="Recording progress">
          <div class="progress-bar" [style.width.%]="progressPct()"></div>
          <span class="elapsed-label">{{ elapsedLabel() }}</span>
        </div>
      } @else {
        <!-- Record button -->
        <button
          class="btn-record"
          (click)="record.emit()"
          [disabled]="!canRecord()"
          aria-label="Start recording"
        >
          <span class="record-dot"></span>
        </button>
      }
    </div>
  `,
  styles: `
    .pill {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      width: 320px;
      height: 80px;
      border-radius: 100px;
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(6px);
      padding: 10px 40px;
    }

    .btn-record, .btn-stop {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: opacity 0.15s;

      &:disabled { opacity: 0.4; cursor: not-allowed; }
      &:not(:disabled):hover { opacity: 0.85; }
    }

    .btn-record {
      background: rgba(255, 255, 255, 0.15);
      border: 2px solid rgba(255, 255, 255, 0.3);
    }

    .record-dot {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: #e53935;
      display: block;
    }

    .btn-stop {
      background: rgba(80, 97, 208, 0.3);
      border: 2px solid #5061d0;
    }

    .stop-icon {
      width: 22px;
      height: 22px;
      border-radius: 4px;
      background: #5061d0;
      display: block;
    }

    .progress-wrap {
      position: relative;
      flex: 1;
      height: 24px;
      border-radius: 4px;
      background: rgba(255, 255, 255, 0.2);
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .progress-bar {
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      background: #5061d0;
      border-radius: 4px;
      transition: width 0.1s linear;
    }

    .elapsed-label {
      position: relative;
      z-index: 1;
      font-size: 16px;
      font-weight: 900;
      color: #fff;
      white-space: nowrap;
    }
  `,
})
export class RecorderControlsComponent {
  private destroyRef = inject(DestroyRef);

  status = input.required<RecordingStatus>();

  record = output<void>();
  stop = output<void>();

  isRecording = computed(() => this.status() === 'recording');
  canRecord = computed(() => this.status() === 'idle');

  private elapsedMs = signal(0);
  private startMs = signal(0);

  progressPct = computed(() => Math.min((this.elapsedMs() / MAX_MS) * 100, 100));
  elapsedLabel = computed(() => `${(this.elapsedMs() / 1000).toFixed(1)} s`);

  constructor() {
    interval(100)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        if (this.isRecording()) {
          this.elapsedMs.set(Date.now() - this.startMs());
        }
      });

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
