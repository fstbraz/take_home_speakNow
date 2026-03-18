import {
  ChangeDetectionStrategy,
  Component,
  input,
  OnDestroy,
  OnInit,
  output,
} from '@angular/core';

@Component({
  selector: 'app-delete-confirm-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="backdrop" (click)="cancel.emit()" role="dialog" aria-modal="true" aria-label="Confirm delete">
      <div class="dialog" (click)="$event.stopPropagation()">
        <button class="btn-x" (click)="cancel.emit()" aria-label="Close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>

        <div class="body">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="#e53935" aria-hidden="true">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
          <h2 class="heading">Delete video?</h2>
          <p class="sub">Are you sure you want to delete this video? This action cannot be undone.</p>
        </div>

        <div class="actions">
          <button class="btn btn-cancel" (click)="cancel.emit()">Cancel</button>
          <button class="btn btn-delete" (click)="confirm.emit(videoId())">Delete</button>
        </div>
      </div>
    </div>
  `,
  styles: `
    .backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.75);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 200;
    }

    .dialog {
      position: relative;
      background: #1e1e1e;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      width: 400px;
      min-height: 226px;
      padding: 20px 40px 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      box-shadow: 0 16px 48px rgba(0, 0, 0, 0.6);
    }

    .btn-x {
      position: absolute;
      top: 16px;
      right: 16px;
      background: transparent;
      border: none;
      color: rgba(255, 255, 255, 0.5);
      cursor: pointer;
      padding: 2px;
      display: flex;
      align-items: center;
      border-radius: 4px;
      transition: color 0.15s;

      &:hover { color: #fff; }
    }

    .body {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }

    .heading {
      margin: 0;
      font-size: 18px;
      font-weight: 700;
      color: #fff;
    }

    .sub {
      margin: 0;
      font-size: 13px;
      color: rgba(255, 255, 255, 0.5);
      line-height: 1.5;
    }

    .actions {
      display: flex;
      gap: 12px;
    }

    .btn {
      flex: 1;
      height: 36px;
      border: none;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: opacity 0.15s;

      &:hover { opacity: 0.85; }
    }

    .btn-cancel {
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
    }

    .btn-delete {
      background: #e53935;
      color: #fff;
    }
  `,
})
export class DeleteConfirmDialogComponent implements OnInit, OnDestroy {
  videoId = input.required<string>();
  confirm = output<string>();
  cancel = output<void>();

  ngOnInit(): void {
    document.addEventListener('keydown', this.onKeydown);
  }

  ngOnDestroy(): void {
    document.removeEventListener('keydown', this.onKeydown);
  }

  private onKeydown = (e: KeyboardEvent): void => {
    if (e.key === 'Escape') this.cancel.emit();
  };
}
