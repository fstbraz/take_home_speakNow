import { ChangeDetectionStrategy, Component, inject, input, OnDestroy, OnInit, output } from '@angular/core';
import { Store } from '@ngxs/store';
import { Quality } from '../../state/bandwidth.state';
import { SetQuality } from '../../state/bandwidth.actions';
import { QualityOptionComponent } from '../quality-option/quality-option.component';

const QUALITIES: Quality[] = ['low', 'medium', 'high'];

@Component({
  selector: 'app-settings-panel',
  standalone: true,
  imports: [QualityOptionComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './settings-panel.component.html',
  styleUrl: './settings-panel.component.scss',
})
export class SettingsPanelComponent implements OnInit, OnDestroy {
  private store = inject(Store);

  currentQuality = input.required<Quality>();
  recommendedQuality = input.required<Quality>();
  close = output<void>();

  qualities = QUALITIES;

  ngOnInit(): void {
    document.addEventListener('keydown', this.onKeydown);
  }

  ngOnDestroy(): void {
    document.removeEventListener('keydown', this.onKeydown);
  }

  private onKeydown = (e: KeyboardEvent): void => {
    if (e.key === 'Escape') this.close.emit();
  };

  onSelect(quality: Quality): void {
    this.store.dispatch(new SetQuality(quality));
    this.close.emit();
  }
}
