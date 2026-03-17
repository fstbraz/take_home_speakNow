import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnDestroy,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Store } from '@ngxs/store';
import { distinctUntilChanged, filter, timer } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { DestroyRef } from '@angular/core';
import { VideosState } from '../../state/videos.state';

@Component({
  selector: 'app-toast',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (visible()) {
      <div class="toast" role="alert">
        <span class="icon" aria-hidden="true">⚠</span>
        {{ message() }}
      </div>
    }
  `,
  styles: `
    .toast {
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      background: #2a2a2a;
      border: 1px solid #e53935;
      border-radius: 6px;
      padding: 12px 20px;
      color: #eee;
      font-size: 13px;
      display: flex;
      align-items: center;
      gap: 8px;
      z-index: 300;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
      animation: slide-up 0.2s ease;
    }

    .icon { color: #e53935; }

    @keyframes slide-up {
      from { opacity: 0; transform: translateX(-50%) translateY(8px); }
      to   { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
  `,
})
export class ToastComponent implements OnDestroy {
  private store = inject(Store);
  private destroyRef = inject(DestroyRef);

  private saveError = this.store.selectSignal(VideosState.lastSaveError);
  private deleteError = this.store.selectSignal(VideosState.lastDeleteError);

  message = computed(() => this.saveError() ?? this.deleteError() ?? '');
  visible = signal(false);

  constructor() {
    const error$ = toObservable(this.message).pipe(
      filter(m => m.length > 0),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef),
    );

    error$.subscribe(() => {
      this.visible.set(true);
      timer(4000)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => this.visible.set(false));
    });
  }

  ngOnDestroy(): void {}
}
