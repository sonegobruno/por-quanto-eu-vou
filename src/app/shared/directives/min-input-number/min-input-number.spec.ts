import { Component, ElementRef, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MinInputNumber } from './min-input-number';

@Component({
  template: `<input #input type="number" [pqevMinNumber]="min" />`,
  imports: [MinInputNumber],
})
class TestHostComponent {
  readonly min = 0;
  readonly input = viewChild.required<ElementRef<HTMLInputElement>>('input');
}

describe('MinInputNumber', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let input: HTMLInputElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
    input = fixture.componentInstance.input().nativeElement;
  });

  const setValueWithInput = (value: string): void => {
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
  };

  const dispatchPaste = (data: string): boolean => {
    const event = new InputEvent('beforeinput', {
      bubbles: true,
      cancelable: true,
      inputType: 'insertFromPaste',
      data,
    });

    return input.dispatchEvent(event);
  };

  it('should allow replacing the entire value with a valid number', () => {
    setValueWithInput('10');
    expect(input.value).toBe('10');

    setValueWithInput('2');
    expect(input.value).toBe('2');
  });

  it('should revert to the last valid value when input exceeds the min', () => {
    setValueWithInput('10');

    setValueWithInput('-1');
    expect(input.value).toBe('10');
  });

  it('should block pasting a value above the min', () => {
    const allowed = dispatchPaste('-1');
    expect(allowed).toBe(false);
  });
});
