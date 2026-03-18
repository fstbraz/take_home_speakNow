import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Quality } from '../../state/bandwidth.state';

const LABELS: Record<Quality, { title: string; subtitle: string }> = {
  low:    { title: 'Low',    subtitle: '360p · Low bandwidth' },
  medium: { title: 'Medium', subtitle: '720p · Balanced' },
  high:   { title: 'High',   subtitle: '1080p · High quality' },
};

@Component({
  selector: 'app-quality-option',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      class="option"
      [class.selected]="selected()"
      (click)="select.emit(quality())"
      [attr.aria-pressed]="selected()"
    >
      <span class="label-wrap">
        <span class="title">{{ label().title }}</span>
        <span class="subtitle">{{ label().subtitle }}</span>
      </span>
      @if (recommended()) {
        <span class="badge">Recommended</span>
      }
      @if (selected()) {
        <svg class="check" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
        </svg>
      }
    </button>
  `,
  styles: `
    .option {
      width: 280px;
      height: 48px;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 0 16px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 8px;
      color: rgba(255, 255, 255, 0.7);
      cursor: pointer;
      text-align: left;
      transition: background 0.15s, border-color 0.15s;

      &:hover {
        background: rgba(255, 255, 255, 0.1);
        border-color: rgba(255, 255, 255, 0.2);
      }

      &.selected {
        background: rgba(80, 97, 208, 0.2);
        border-color: #5061d0;
        color: #fff;
      }
    }

    .label-wrap {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 1px;
    }

    .title {
      font-size: 14px;
      font-weight: 700;
      line-height: 1;
    }

    .subtitle {
      font-size: 11px;
      opacity: 0.6;
      line-height: 1;
    }

    .badge {
      font-size: 10px;
      padding: 2px 8px;
      background: rgba(80, 97, 208, 0.25);
      border: 1px solid rgba(80, 97, 208, 0.5);
      border-radius: 10px;
      color: #8fa0f0;
      white-space: nowrap;
    }

    .check {
      color: #5061d0;
      flex-shrink: 0;
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
