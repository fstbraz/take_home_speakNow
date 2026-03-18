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
  templateUrl: './delete-confirm-dialog.component.html',
  styleUrl: './delete-confirm-dialog.component.scss',
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
