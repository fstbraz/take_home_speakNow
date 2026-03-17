import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Quality } from '../../state/bandwidth.state';

const LABELS: Record<Quality, { title: string; subtitle: string }> = {
  low:    { title: '360p',  subtitle: 'Low bandwidth' },
  medium: { title: '720p',  subtitle: 'Balanced' },
  high:   { title: '1080p', subtitle: 'High quality' },
};

@Component({
  selector: 'app-quality-option',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      class="option"
      [class.selected]="selected()"
      [class.recommended]="recommended()"
      (click)="select.emit(quality())"
      [attr.aria-pressed]="selected()"
    >
      <span class="title">{{ label().title }}</span>
      <span class="subtitle">{{ label().subtitle }}</span>
      @if (recommended()) {
        <span class="badge">Recommended</span>
      }
      @if (selected()) {
        <span class="check" aria-hidden="true">✓</span>
      }
    </button>
  `,
  styles: `
    .option {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 12px;
      background: #1a1a1a;
      border: 1px solid #2a2a2a;
      border-radius: 6px;
      color: #bbb;
      cursor: pointer;
      text-align: left;
      transition: border-color 0.15s, background 0.15s;

      &:hover { background: #222; border-color: #444; }

      &.selected {
        border-color: #e53935;
        background: rgba(229, 57, 53, 0.08);
        color: #fff;
      }

      &.recommended:not(.selected) {
        border-color: #555;
      }
    }

    .title {
      font-size: 14px;
      font-weight: 600;
      min-width: 44px;
    }

    .subtitle {
      font-size: 12px;
      color: #666;
      flex: 1;
    }

    .badge {
      font-size: 10px;
      padding: 2px 6px;
      background: #2a2a2a;
      border-radius: 10px;
      color: #888;
      letter-spacing: 0.3px;
    }

    .check {
      color: #e53935;
      font-size: 14px;
    }
  `,
})
export class QualityOptionComponent {
  quality = input.required<Quality>();
  selected = input(false);
  recommended = input(false);
  select = output<Quality>();

  label = () => LABELS[this.quality()];
}
