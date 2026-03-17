import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
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
  template: `
    <div class="backdrop" (click)="close.emit()" role="dialog" aria-modal="true" aria-label="Settings">
      <div class="panel" (click)="$event.stopPropagation()">
        <div class="header">
          <h2 class="title">Settings</h2>
          <button class="btn-close" (click)="close.emit()" aria-label="Close">✕</button>
        </div>

        <section>
          <h3 class="section-title">Video quality</h3>
          <div class="options">
            @for (q of qualities; track q) {
              <app-quality-option
                [quality]="q"
                [selected]="currentQuality() === q"
                [recommended]="recommendedQuality() === q"
                (select)="onSelect($event)"
              />
            }
          </div>
        </section>
      </div>
    </div>
  `,
  styles: `
    .backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 150;
    }

    .panel {
      background: #181818;
      border: 1px solid #2a2a2a;
      border-radius: 10px;
      width: 360px;
      padding: 24px;
      box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5);
    }

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
    }

    .title {
      margin: 0;
      font-size: 16px;
      color: #eee;
    }

    .btn-close {
      background: transparent;
      border: none;
      color: #666;
      font-size: 16px;
      cursor: pointer;
      padding: 4px;

      &:hover { color: #ccc; }
    }

    .section-title {
      margin: 0 0 10px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: #555;
    }

    .options {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
  `,
})
export class SettingsPanelComponent {
  private store = inject(Store);

  currentQuality = input.required<Quality>();
  recommendedQuality = input.required<Quality>();
  close = output<void>();

  qualities = QUALITIES;

  onSelect(quality: Quality): void {
    this.store.dispatch(new SetQuality(quality));
    this.close.emit();
  }
}
