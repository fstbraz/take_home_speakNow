import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  OnChanges,
  SimpleChanges,
  viewChild,
} from '@angular/core';
import { SpinnerComponent } from '../spinner/spinner.component';

@Component({
  selector: 'app-video-preview',
  standalone: true,
  imports: [SpinnerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="preview-container">
      @if (!stream()) {
        <app-spinner />
      }
      <video
        #videoEl
        autoplay
        playsinline
        muted
        [class.hidden]="!stream()"
        aria-label="Camera preview"
      ></video>
    </div>
  `,
  styles: [`
    .preview-container {
      width: 100%;
      height: 100%;
      background: #000;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    video {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    video.hidden {
      display: none;
    }
  `],
})
export class VideoPreviewComponent implements AfterViewInit, OnChanges {
  stream = input<MediaStream | null>(null);
  private videoEl = viewChild.required<ElementRef<HTMLVideoElement>>('videoEl');

  ngAfterViewInit(): void {
    this.applyStream();
  }

  ngOnChanges(_changes: SimpleChanges): void {
    this.applyStream();
  }

  private applyStream(): void {
    const el = this.videoEl()?.nativeElement;
    if (el) {
      el.srcObject = this.stream();
    }
  }
}
