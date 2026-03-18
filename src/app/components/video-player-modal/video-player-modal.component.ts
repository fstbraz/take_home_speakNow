import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  OnDestroy,
  OnInit,
  output,
  signal,
  viewChild,
} from '@angular/core';

function formatTime(s: number): string {
  if (!isFinite(s) || isNaN(s)) return '00:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

@Component({
  selector: 'app-video-player-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './video-player-modal.component.html',
  styleUrl: './video-player-modal.component.scss',
})
export class VideoPlayerModalComponent implements OnInit, OnDestroy {
  blobUrl = input.required<string>();
  close = output<void>();

  private videoEl = viewChild.required<ElementRef<HTMLVideoElement>>('videoEl');
  private seekEl  = viewChild.required<ElementRef<HTMLInputElement>>('seekEl');

  paused      = signal(false);
  currentTime = signal(0);   // used only for the time label
  duration    = signal(0);

  formatTime = formatTime;

  private rafId: number | null = null;

  ngOnInit(): void {
    document.addEventListener('keydown', this.onKeydown);
  }

  ngOnDestroy(): void {
    document.removeEventListener('keydown', this.onKeydown);
    this.stopRaf();
  }

  private onKeydown = (e: KeyboardEvent): void => {
    if (e.key === 'Escape') this.close.emit();
    if (e.key === ' ') { e.preventDefault(); this.togglePlay(); }
  };

  // ── RAF loop ───────────────────────────────────────────────────────────────
  // Writes directly to DOM — bypasses Angular's change detection entirely
  // for the seek thumb so it moves at native display refresh rate.

  private tick = (): void => {
    const ct  = this.videoEl().nativeElement.currentTime;
    const dur = this.duration();

    // Update label signal (cheap — only re-renders the tiny time span)
    this.currentTime.set(ct);

    // Direct DOM writes for the seek bar (zero Angular overhead)
    const seek = this.seekEl().nativeElement;
    seek.value = String(ct);
    seek.style.setProperty('--pct', dur > 0 ? `${(ct / dur) * 100}%` : '0%');

    this.rafId = requestAnimationFrame(this.tick);
  };

  private startRaf(): void {
    if (this.rafId === null) this.rafId = requestAnimationFrame(this.tick);
  }

  private stopRaf(): void {
    if (this.rafId !== null) { cancelAnimationFrame(this.rafId); this.rafId = null; }
  }

  // ── Video event handlers ───────────────────────────────────────────────────

  onDurationChange(): void {
    const d = this.videoEl().nativeElement.duration;
    if (isFinite(d) && d > 0) {
      this.duration.set(d);
      this.seekEl().nativeElement.max = String(d);
    }
  }

  onPlay(): void  { this.paused.set(false); this.startRaf(); }

  onPause(): void {
    this.paused.set(true);
    this.stopRaf();
    this.syncSeekToCurrent();
  }

  onEnded(): void {
    this.paused.set(true);
    this.stopRaf();
    this.syncSeekToCurrent();
  }

  private syncSeekToCurrent(): void {
    const ct  = this.videoEl().nativeElement.currentTime;
    const dur = this.duration();
    this.currentTime.set(ct);
    const seek = this.seekEl().nativeElement;
    seek.value = String(ct);
    seek.style.setProperty('--pct', dur > 0 ? `${(ct / dur) * 100}%` : '0%');
  }

  onSeek(event: Event): void {
    const value = +(event.target as HTMLInputElement).value;
    this.videoEl().nativeElement.currentTime = value;
    this.currentTime.set(value);
    const dur = this.duration();
    (event.target as HTMLInputElement).style.setProperty(
      '--pct', dur > 0 ? `${(value / dur) * 100}%` : '0%'
    );
  }

  togglePlay(): void {
    const v = this.videoEl().nativeElement;
    v.paused ? v.play() : v.pause();
  }
}
