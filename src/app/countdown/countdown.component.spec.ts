import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CountdownComponent } from './countdown.component';
import { FormsModule } from '@angular/forms';

describe('CountdownComponent', () => {
  let component: CountdownComponent;
  let fixture: ComponentFixture<CountdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CountdownComponent, FormsModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CountdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update remaining time correctly', () => {
    const now = new Date();
    const futureDate = new Date(now.getTime() + 100000000);
    component.ncEvent.dueDate = futureDate;
    fixture.detectChanges();

    component.updateRemaining();

    console.log('ncEvent.dueDate:', component.ncEvent.dueDate);
    console.log('remaining:', component.remaining);

    expect(component.remaining).toContain('days');
  });

  it('should handle invalid date input', () => {
    component.handleNCEventDueDateChange({ target: { value: 'invalid-date' } } as any);
    fixture.detectChanges();
    expect(component.ncEvent.dueDate).toBeNull();
    expect(component.remaining).toBe('Enter Event Date');
  });

  it('should clear the event', () => {
    component.handleClear();
    fixture.detectChanges();
    expect(component.ncEvent.title).toBe('');
    expect(component.ncEvent.dueDate).toBeNull();
    expect(component.remaining).toBe('Enter Event Date');
  });

  it('should handle valid date input', () => {
    const validDate = '2023-12-31';
    component.handleNCEventDueDateChange({ target: { value: validDate } } as any);
    fixture.detectChanges();
    expect(component.ncEvent.dueDate).not.toBeNull();
    expect(component.remaining).not.toBe('Enter Event Date');
  });

  it('should handle title change', () => {
    const title = 'Test Event';
    component.handleNCEventTitleChange({ target: { value: title } } as any);
    fixture.detectChanges();
    expect(component.ncEvent.title).toBe(title);
    expect(component.title).toBe(`Time to ${title}`);
  });

  it('should adjust font size on window resize', () => {
    spyOn<any>(component, 'adjustFontSize');
    window.dispatchEvent(new Event('resize'));
    expect(component.adjustFontSize).toHaveBeenCalled();
  });
});
