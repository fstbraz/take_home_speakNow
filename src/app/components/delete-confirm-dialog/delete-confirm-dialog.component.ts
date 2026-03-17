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
        <span class="icon" aria-hidden="true">⚠</span>
        <h2 class="title">Delete recording?</h2>
        <p class="message">This action cannot be undone.</p>
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
      background: #1e1e1e;
      border: 1px solid #333;
      border-radius: 8px;
      padding: 32px;
      width: 360px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      text-align: center;
      box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5);
    }

    .icon {
      font-size: 32px;
      color: #e53935;
    }

    .title {
      margin: 0;
      font-size: 18px;
      color: #eee;
    }

    .message {
      margin: 0;
      font-size: 13px;
      color: #888;
    }

    .actions {
      display: flex;
      gap: 12px;
      margin-top: 8px;
    }

    .btn {
      padding: 8px 24px;
      border: none;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: opacity 0.15s;

      &:hover { opacity: 0.85; }
    }

    .btn-cancel {
      background: #333;
      color: #ccc;
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
