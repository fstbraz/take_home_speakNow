import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="empty">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="2" y="6" width="20" height="14" rx="2" stroke="#555" stroke-width="1.5"/>
        <path d="M16 13l-4-3v6l4-3z" fill="#555"/>
      </svg>
      <p>No recordings yet</p>
      <span>Hit Record to get started</span>
    </div>
  `,
  styles: `
    .empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 32px 16px;
      color: #555;
      text-align: center;
    }

    p {
      margin: 0;
      font-size: 14px;
      font-weight: 600;
      color: #666;
    }

    span {
      font-size: 12px;
      color: #444;
    }
  `,
})
export class EmptyStateComponent {}
