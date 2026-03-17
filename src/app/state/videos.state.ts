import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
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

  // Populated in Step 6 when VideoStorageService is added
  @Action(LoadVideos)
  loadVideos(_ctx: StateContext<VideosStateModel>): void {
    // stub — implemented in Step 6
  }

  @Action(SaveVideo)
  saveVideo(ctx: StateContext<VideosStateModel>, action: SaveVideo): void {
    ctx.patchState({
      videos: [...ctx.getState().videos, action.meta],
      lastSaveError: null,
    });
  }

  @Action(SaveVideoFailed)
  saveVideoFailed(ctx: StateContext<VideosStateModel>, action: SaveVideoFailed): void {
    ctx.patchState({ lastSaveError: action.error });
  }

  @Action(DeleteVideo)
  deleteVideo(ctx: StateContext<VideosStateModel>, action: DeleteVideo): void {
    ctx.patchState({
      videos: ctx.getState().videos.filter((v) => v.id !== action.id),
      lastDeleteError: null,
    });
  }

  @Action(DeleteVideoFailed)
  deleteVideoFailed(ctx: StateContext<VideosStateModel>, action: DeleteVideoFailed): void {
    ctx.patchState({
      videos: [...ctx.getState().videos, action.meta],
      lastDeleteError: `Failed to delete "${action.meta.name}"`,
    });
  }
}
