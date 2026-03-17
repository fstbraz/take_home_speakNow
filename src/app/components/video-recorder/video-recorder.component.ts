import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-video-recorder',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="recorder-shell">Loading…</div>`,
  styles: [`
    .recorder-shell {
      width: 1920px;
      height: 1080px;
      background: #111;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: sans-serif;
    }
  `],
})
export class VideoRecorderComponent {}
