import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnDestroy,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { Store } from '@ngxs/store';
import { distinctUntilChanged, filter, timer } from 'rxjs';
import { BandwidthState } from '../../state/bandwidth.state';
import { VideosState } from '../../state/videos.state';

@Component({
  selector: 'app-toast',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
})
export class ToastComponent implements OnDestroy {
  private store = inject(Store);
  private destroyRef = inject(DestroyRef);

  private saveError = this.store.selectSignal(VideosState.lastSaveError);
  private deleteError = this.store.selectSignal(VideosState.lastDeleteError);
  private bandwidthFailed = this.store.selectSignal(BandwidthState.detectionFailed);

  message = computed(() => {
    if (this.bandwidthFailed()) return 'Bandwidth detection failed — defaulting to Medium quality';
    return this.saveError() ?? this.deleteError() ?? '';
  });

  visible = signal(false);

  constructor() {
    toObservable(this.message).pipe(
      filter(m => m.length > 0),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(() => {
      this.visible.set(true);
      timer(4000)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => this.visible.set(false));
    });
  }

  ngOnDestroy(): void {}
}
