import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="empty">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="rgba(255,255,255,0.6)" aria-hidden="true">
        <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
      </svg>
      <p>There are no recorded videos yet</p>
    </div>
  `,
  styles: `
    .empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: 32px 16px;
      text-align: center;
    }

    p {
      margin: 0;
      font-size: 16px;
      color: rgba(255, 255, 255, 0.6);
      font-family: 'Lato', sans-serif;
    }
  `,
})
export class EmptyStateComponent {}
