import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { GasolineCalculatorService } from '@app/home/services/gasoline-calculator/gasoline-calculator.service';
import { signal } from '@angular/core';
import { form, FormField, FormRoot } from '@angular/forms/signals';
import { FormService } from '@app/shared/services/form/form.service';
import { CalculatorForm, calculatorFormSchema } from '@app/home/form/calculator-form';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'pqev-home',
  imports: [
    FormField,
    FormRoot,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    CurrencyPipe,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [GasolineCalculatorService],
})
export class HomeComponent {
  private readonly gasolineCalculatorService = inject(GasolineCalculatorService);
  private readonly formService = inject(FormService);

  private calculator = signal<CalculatorForm>({
    distance: NaN,
    gasolinePrice: NaN,
    distancePerLiter: NaN,
    isRoundTrip: false,
  });

  protected calculatorForm = form(this.calculator, calculatorFormSchema, {
    submission: {
      action: async field => {
        const { distance, gasolinePrice, distancePerLiter, isRoundTrip } = field().value();

        const calcResult = this.gasolineCalculatorService.calculate({
          distance,
          gasolinePrice,
          distancePerLiter,
          isRoundTrip,
        });

        this.result.set(calcResult);
      },
      onInvalid: field => {
        this.result.set(0);
        this.formService.handleError(field().errorSummary());
      },
    },
  });

  protected result = signal<number>(0);
}
