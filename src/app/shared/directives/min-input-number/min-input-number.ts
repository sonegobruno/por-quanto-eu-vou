import { Directive, effect, ElementRef, HostListener, inject, input } from '@angular/core';
import { SnackbarService } from '@app/shared/services/snackbar/snackbar.service';

const INSERT_INPUT_TYPES = new Set([
  'insertText',
  'insertFromPaste',
  'insertFromDrop',
  'insertReplacementText',
]);

@Directive({
  selector: 'input[type="number"][pqevMinNumber]',
})
export class MinInputNumber {
  public readonly pqevMinNumber = input.required<number>();

  private readonly inputElement = inject<ElementRef<HTMLInputElement>>(ElementRef).nativeElement;

  private readonly snackbarService = inject(SnackbarService);

  #isCorrectingValue = false;

  #lastValidValue = '';

  #pqevMinNumberEffect = effect(() => {
    this.inputElement.setAttribute('min', String(this.pqevMinNumber()));
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
      if (!Number.isNaN(parsed) && parsed < this.pqevMinNumber()) {
        event.preventDefault();
        this.snackbarService.warn('Valor minimo deve ser ' + this.pqevMinNumber());
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
    if (this.wouldExceedMin(futureValue)) {
      event.preventDefault();
    }
  }

  @HostListener('input')
  onInput(): void {
    if (this.#isCorrectingValue) {
      return;
    }
    const value = this.inputElement.value;
    if (!this.wouldExceedMin(value)) {
      this.#lastValidValue = value;
      return;
    }
    this.#isCorrectingValue = true;
    this.inputElement.value = this.#lastValidValue;
    this.inputElement.dispatchEvent(new Event('input', { bubbles: true }));
    this.#isCorrectingValue = false;
    this.snackbarService.warn('Valor minimo deve ser ' + this.pqevMinNumber());
  }

  private syncLastValidValue(): void {
    const value = this.inputElement.value;
    if (!this.wouldExceedMin(value)) {
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

  private wouldExceedMin(value: string): boolean {
    if (value === '' || value === '-') {
      return false;
    }
    const parsed = Number.parseFloat(value);
    return !Number.isNaN(parsed) && parsed < this.pqevMinNumber();
  }
}
