import { VideoMeta } from './videos.state';

export class LoadVideos {
  static readonly type = '[Videos] Load Videos';
}

export class SaveVideo {
  static readonly type = '[Videos] Save Video';
  constructor(public meta: VideoMeta, public blob: Blob) {}
}

export class SaveVideoFailed {
  static readonly type = '[Videos] Save Video Failed';
  constructor(public error: string) {}
}

export class DeleteVideo {
  static readonly type = '[Videos] Delete Video';
  constructor(public id: string) {}
}

export class DeleteVideoFailed {
  static readonly type = '[Videos] Delete Video Failed';
  constructor(public id: string, public meta: VideoMeta) {}
}
