import { ChangeDetectionStrategy, Component } from '@angular/core';
import { VideoRecorderComponent } from './components/video-recorder/video-recorder.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [VideoRecorderComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
