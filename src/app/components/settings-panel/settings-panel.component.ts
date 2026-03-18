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
  template: `
    <div class="backdrop" (click)="close.emit()" role="dialog" aria-modal="true" aria-label="Settings">
      <div class="panel" (click)="$event.stopPropagation()">
        <div class="header">
          <h2 class="title">Settings</h2>
          <button class="btn-close" (click)="close.emit()" aria-label="Close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>

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
      </div>
    </div>
  `,
  styles: `
    .backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 150;
    }

    .panel {
      background: #1e1e1e;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      width: 360px;
      padding: 24px;
      box-shadow: 0 24px 64px rgba(0, 0, 0, 0.6);
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .title {
      margin: 0;
      font-size: 18px;
      font-weight: 700;
      color: #fff;
    }

    .btn-close {
      background: transparent;
      border: none;
      color: rgba(255, 255, 255, 0.5);
      cursor: pointer;
      padding: 4px;
      display: flex;
      align-items: center;
      border-radius: 4px;
      transition: color 0.15s;

      &:hover { color: #fff; }
    }

    .section-title {
      margin: 0;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: rgba(255, 255, 255, 0.4);
    }

    .options {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
  `,
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
