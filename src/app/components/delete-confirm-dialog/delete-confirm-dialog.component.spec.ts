import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { By } from '@angular/platform-browser';
import { DeleteConfirmDialogComponent } from './delete-confirm-dialog.component';

async function createComponent() {
  await TestBed.configureTestingModule({
    imports: [DeleteConfirmDialogComponent],
    providers: [provideZonelessChangeDetection()],
  }).compileComponents();

  const fixture = TestBed.createComponent(DeleteConfirmDialogComponent);
  fixture.componentRef.setInput('videoId', 'test-id');
  fixture.detectChanges();
  return fixture;
}

describe('DeleteConfirmDialogComponent', () => {
  it('should render dialog', async () => {
    const fixture = await createComponent();
    expect(fixture.debugElement.query(By.css('.dialog'))).toBeTruthy();
  });

  it('should emit confirm with videoId on Delete click', async () => {
    const fixture = await createComponent();
    let confirmed: string | undefined;
    fixture.componentInstance.confirm.subscribe((id: string) => (confirmed = id));
    fixture.debugElement.query(By.css('.btn-delete')).nativeElement.click();
    expect(confirmed).toBe('test-id');
  });

  it('should emit cancel on Cancel click', async () => {
    const fixture = await createComponent();
    let cancelled = false;
    fixture.componentInstance.cancel.subscribe(() => (cancelled = true));
    fixture.debugElement.query(By.css('.btn-cancel')).nativeElement.click();
    expect(cancelled).toBe(true);
  });

  it('should emit cancel on backdrop click', async () => {
    const fixture = await createComponent();
    let cancelled = false;
    fixture.componentInstance.cancel.subscribe(() => (cancelled = true));
    fixture.debugElement.query(By.css('.backdrop')).nativeElement.click();
    expect(cancelled).toBe(true);
  });

  it('should emit cancel on Escape key', async () => {
    const fixture = await createComponent();
    let cancelled = false;
    fixture.componentInstance.cancel.subscribe(() => (cancelled = true));
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(cancelled).toBe(true);
  });
});
