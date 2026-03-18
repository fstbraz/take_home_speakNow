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
  templateUrl: './recorder-controls.component.html',
  styleUrl: './recorder-controls.component.scss',
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
        if (this.isRecording()) this.elapsedMs.set(Date.now() - this.startMs());
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
