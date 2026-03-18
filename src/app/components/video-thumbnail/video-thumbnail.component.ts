import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { VideoMeta } from '../../state/videos.state';

function formatDuration(ms: number): string {
  return `${Math.round(ms / 1000)}s`;
}

function formatDateParts(iso: string): { date: string; time: string } {
  const d = new Date(iso);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return { date: `${day}.${month}.${year}`, time: `${hh}:${mm}` };
}

@Component({
  selector: 'app-video-thumbnail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './video-thumbnail.component.html',
  styleUrl: './video-thumbnail.component.scss',
})
export class VideoThumbnailComponent {
  meta = input.required<VideoMeta>();
  play = output<string>();
  delete = output<string>();

  formatDuration = formatDuration;
  formatDateParts = formatDateParts;
}
