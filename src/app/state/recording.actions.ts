export class InitializeCamera {
  static readonly type = '[Recording] Initialize Camera';
}

export class StartRecording {
  static readonly type = '[Recording] Start Recording';
}

export class StopRecording {
  static readonly type = '[Recording] Stop Recording';
}

export class AbortRecording {
  static readonly type = '[Recording] Abort Recording';
}

export class CameraError {
  static readonly type = '[Recording] Camera Error';
  constructor(public message: string) {}
}
