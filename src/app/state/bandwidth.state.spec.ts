import { TestBed } from '@angular/core/testing';
import { provideStore, Store } from '@ngxs/store';
import { provideZonelessChangeDetection } from '@angular/core';
import { of } from 'rxjs';
import { BandwidthState } from './bandwidth.state';
import { BandwidthService } from '../services/bandwidth.service';
import { DetectBandwidth, SetQuality } from './bandwidth.actions';

describe('BandwidthState', () => {
  let store: Store;
  let bandwidthService: BandwidthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideStore([BandwidthState]),
        { provide: BandwidthService, useValue: { detect: vi.fn(() => of('high')) } },
      ],
    });
    store = TestBed.inject(Store);
    bandwidthService = TestBed.inject(BandwidthService);
  });

  it('should have default quality of medium', () => {
    expect(store.selectSnapshot(BandwidthState.quality)).toBe('medium');
  });

  it('should update quality after DetectBandwidth', async () => {
    await store.dispatch(new DetectBandwidth()).toPromise();
    expect(store.selectSnapshot(BandwidthState.quality)).toBe('high');
  });

  it('should update quality on SetQuality', async () => {
    await store.dispatch(new SetQuality('low')).toPromise();
    expect(store.selectSnapshot(BandwidthState.quality)).toBe('low');
  });

  it('should expose quality via selector', () => {
    store.dispatch(new SetQuality('medium'));
    expect(store.selectSnapshot(BandwidthState.quality)).toBe('medium');
  });
});
