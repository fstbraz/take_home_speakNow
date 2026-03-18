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
  templateUrl: './video-preview.component.html',
  styleUrl: './video-preview.component.scss',
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
