import { Directive, effect, ElementRef, HostListener, inject, input } from '@angular/core';

const INSERT_INPUT_TYPES = new Set([
  'insertText',
  'insertFromPaste',
  'insertFromDrop',
  'insertReplacementText',
]);

@Directive({
  selector: 'input[type="number"][pqevMaxNumber]',
})
export class MaxInputNumber {
  public readonly pqevMaxNumber = input.required<number>();

  private readonly inputElement = inject<ElementRef<HTMLInputElement>>(ElementRef).nativeElement;

  #isCorrectingValue = false;

  #lastValidValue = '';

  #pqevMaxNumberEffect = effect(() => {
    this.inputElement.setAttribute('max', String(this.pqevMaxNumber()));
    this.syncLastValidValue();
  });

  @HostListener('beforeinput', ['$event'])
  onBeforeInput(event: InputEvent): void {
    if (!INSERT_INPUT_TYPES.has(event.inputType)) {
      return;
    }
    const insertedText = event.data;
    if (!insertedText) {
      return;
    }
    if (event.inputType === 'insertFromPaste') {
      const parsed = Number.parseFloat(insertedText);
      if (!Number.isNaN(parsed) && parsed > this.pqevMaxNumber()) {
        event.preventDefault();
      }
      return;
    }
    const selectionStart = this.inputElement.selectionStart;
    const selectionEnd = this.inputElement.selectionEnd;
    // number inputs do not expose selection; rely on the input handler instead
    if (selectionStart === null || selectionEnd === null) {
      return;
    }
    const futureValue = this.getFutureValue(insertedText, selectionStart, selectionEnd);
    if (this.wouldExceedMax(futureValue)) {
      event.preventDefault();
    }
  }

  @HostListener('input')
  onInput(): void {
    if (this.#isCorrectingValue) {
      return;
    }
    const value = this.inputElement.value;
    if (!this.wouldExceedMax(value)) {
      this.#lastValidValue = value;
      return;
    }
    this.#isCorrectingValue = true;
    this.inputElement.value = this.#lastValidValue;
    this.inputElement.dispatchEvent(new Event('input', { bubbles: true }));
    this.#isCorrectingValue = false;
  }

  private syncLastValidValue(): void {
    const value = this.inputElement.value;
    if (!this.wouldExceedMax(value)) {
      this.#lastValidValue = value;
    }
  }

  private getFutureValue(
    insertedText: string,
    selectionStart: number,
    selectionEnd: number
  ): string {
    const currentValue = this.inputElement.value;
    return currentValue.slice(0, selectionStart) + insertedText + currentValue.slice(selectionEnd);
  }

  private wouldExceedMax(value: string): boolean {
    if (value === '' || value === '-') {
      return false;
    }
    const parsed = Number.parseFloat(value);
    return !Number.isNaN(parsed) && parsed > this.pqevMaxNumber();
  }
}
