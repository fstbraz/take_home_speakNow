import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { By } from '@angular/platform-browser';
import { RecorderControlsComponent } from './recorder-controls.component';

async function createComponent(status: 'idle' | 'recording' | 'initializing' | 'stopping' | 'error') {
  await TestBed.configureTestingModule({
    imports: [RecorderControlsComponent],
    providers: [provideZonelessChangeDetection()],
  }).compileComponents();

  const fixture = TestBed.createComponent(RecorderControlsComponent);
  fixture.componentRef.setInput('status', status);
  fixture.detectChanges();
  return fixture;
}

describe('RecorderControlsComponent', () => {
  it('should show Record button when idle', async () => {
    const fixture = await createComponent('idle');
    const btn = fixture.debugElement.query(By.css('.btn-record'));
    expect(btn).toBeTruthy();
  });

  it('should show Stop button when recording', async () => {
    const fixture = await createComponent('recording');
    const btn = fixture.debugElement.query(By.css('.btn-stop'));
    expect(btn).toBeTruthy();
  });

  it('should disable Record button when not idle', async () => {
    const fixture = await createComponent('initializing');
    const btn = fixture.debugElement.query(By.css('.btn-record'));
    expect(btn.nativeElement.disabled).toBe(true);
  });

  it('should emit record event on Record click', async () => {
    const fixture = await createComponent('idle');
    let emitted = false;
    fixture.componentInstance.record.subscribe(() => (emitted = true));
    fixture.debugElement.query(By.css('.btn-record')).nativeElement.click();
    expect(emitted).toBe(true);
  });

  it('should emit stop event on Stop click', async () => {
    const fixture = await createComponent('recording');
    let emitted = false;
    fixture.componentInstance.stop.subscribe(() => (emitted = true));
    fixture.debugElement.query(By.css('.btn-stop')).nativeElement.click();
    expect(emitted).toBe(true);
  });

  it('should show progress bar when recording', async () => {
    const fixture = await createComponent('recording');
    const progress = fixture.debugElement.query(By.css('.progress-wrap'));
    expect(progress).toBeTruthy();
  });

  it('should show elapsed label when recording', async () => {
    const fixture = await createComponent('recording');
    const label = fixture.debugElement.query(By.css('.elapsed-label'));
    expect(label).toBeTruthy();
  });
});
