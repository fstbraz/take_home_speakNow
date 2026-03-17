import { inject, Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { catchError, EMPTY, switchMap, tap } from 'rxjs';
import { VideoStorageService } from '../services/video-storage.service';
import {
  DeleteVideo,
  DeleteVideoFailed,
  LoadVideos,
  SaveVideo,
  SaveVideoFailed,
} from './videos.actions';

export interface VideoMeta {
  id: string;
  name: string;
  date: string;
  durationMs: number;
  quality: 'low' | 'medium' | 'high';
  thumbnailDataUrl: string;
}

export interface VideosStateModel {
  videos: VideoMeta[];
  lastSaveError: string | null;
  lastDeleteError: string | null;
}

@State<VideosStateModel>({
  name: 'videos',
  defaults: { videos: [], lastSaveError: null, lastDeleteError: null },
})
@Injectable()
export class VideosState {
  private storage = inject(VideoStorageService);

  @Selector()
  static videos(state: VideosStateModel): VideoMeta[] {
    return state.videos;
  }

  @Selector()
  static lastSaveError(state: VideosStateModel): string | null {
    return state.lastSaveError;
  }

  @Selector()
  static lastDeleteError(state: VideosStateModel): string | null {
    return state.lastDeleteError;
  }

  @Action(LoadVideos)
  loadVideos(ctx: StateContext<VideosStateModel>) {
    return this.storage.getAllMeta().pipe(
      tap(videos => ctx.patchState({ videos })),
      catchError(() => EMPTY),
    );
  }

  @Action(SaveVideo)
  saveVideo(ctx: StateContext<VideosStateModel>, action: SaveVideo) {
    return this.storage.saveVideo(action.meta, action.blob).pipe(
      tap(() =>
        ctx.patchState({
          videos: [...ctx.getState().videos, action.meta],
          lastSaveError: null,
        }),
      ),
      catchError(() => {
        ctx.dispatch(new SaveVideoFailed(`Failed to save "${action.meta.name}"`));
        return EMPTY;
      }),
    );
  }

  @Action(SaveVideoFailed)
  saveVideoFailed(ctx: StateContext<VideosStateModel>, action: SaveVideoFailed): void {
    ctx.patchState({ lastSaveError: action.error });
  }

  @Action(DeleteVideo)
  deleteVideo(ctx: StateContext<VideosStateModel>, action: DeleteVideo) {
    const snapshot = ctx.getState().videos;
    const meta = snapshot.find(v => v.id === action.id);
    if (!meta) return EMPTY;

    ctx.patchState({
      videos: snapshot.filter(v => v.id !== action.id),
      lastDeleteError: null,
    });

    return this.storage.deleteVideo(action.id).pipe(
      catchError(() => {
        ctx.dispatch(new DeleteVideoFailed(action.id, meta));
        return EMPTY;
      }),
    );
  }

  @Action(DeleteVideoFailed)
  deleteVideoFailed(ctx: StateContext<VideosStateModel>, action: DeleteVideoFailed): void {
    ctx.patchState({
      videos: [...ctx.getState().videos, action.meta],
      lastDeleteError: `Failed to delete "${action.meta.name}"`,
    });
  }
}
