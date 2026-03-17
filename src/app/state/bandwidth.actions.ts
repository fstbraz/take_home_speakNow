export class DetectBandwidth {
  static readonly type = '[Bandwidth] Detect Bandwidth';
}

export class SetQuality {
  static readonly type = '[Bandwidth] Set Quality';
  constructor(public quality: 'low' | 'medium' | 'high') {}
}

export class BandwidthDetectionFailed {
  static readonly type = '[Bandwidth] Detection Failed';
}
