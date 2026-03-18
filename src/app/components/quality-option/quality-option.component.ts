import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Quality } from '../../state/bandwidth.state';

const LABELS: Record<Quality, { res: string; label: string }> = {
  low:    { res: '360',  label: 'Low Quality' },
  medium: { res: '720',  label: 'Medium Quality' },
  high:   { res: '1080', label: 'High Quality' },
};

@Component({
  selector: 'app-quality-option',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './quality-option.component.html',
  styleUrl: './quality-option.component.scss',
})
export class QualityOptionComponent {
  quality = input.required<Quality>();
  selected = input(false);
  recommended = input(false);
  select = output<Quality>();

  label = () => LABELS[this.quality()];
}
