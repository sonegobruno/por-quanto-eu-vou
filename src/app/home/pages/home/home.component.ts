import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
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
import { COOKIE } from '@app/shared/services/cookie/cookie-port';
import {
  LAST_DISTANCE_PER_LITER_COOKIE_NAME,
  LAST_GASOLINE_PRICE_COOKIE_NAME,
} from '@app/home/constants/last-usage-cookie-name';
import { isValidNumber, toNumber } from '@app/shared/utils/number';
import { IconComponent } from '@app/shared/components/icon/icon.component';

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
    IconComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [GasolineCalculatorService],
})
export class HomeComponent implements OnInit {
  private readonly gasolineCalculatorService = inject(GasolineCalculatorService);
  private readonly formService = inject(FormService);
  private readonly cookie = inject(COOKIE);

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

        this.cookie.set(LAST_GASOLINE_PRICE_COOKIE_NAME, gasolinePrice.toString());
        this.cookie.set(LAST_DISTANCE_PER_LITER_COOKIE_NAME, distancePerLiter.toString());

        this.result.set(calcResult);
      },
      onInvalid: field => {
        this.result.set(0);
        this.formService.handleError(field().errorSummary());
      },
    },
  });

  protected result = signal<number>(0);

  ngOnInit(): void {
    this.restoreLastValues();
  }

  private restoreLastValues(): void {
    const lastGasolinePrice = toNumber(this.cookie.get(LAST_GASOLINE_PRICE_COOKIE_NAME));
    const lastDistancePerLiter = toNumber(this.cookie.get(LAST_DISTANCE_PER_LITER_COOKIE_NAME));

    const hasChanges = isValidNumber(lastGasolinePrice) || isValidNumber(lastDistancePerLiter);

    if (hasChanges) {
      this.calculator.update(calculator => ({
        ...calculator,
        gasolinePrice: isValidNumber(lastGasolinePrice)
          ? lastGasolinePrice
          : calculator.gasolinePrice,
        distancePerLiter: isValidNumber(lastDistancePerLiter)
          ? lastDistancePerLiter
          : calculator.distancePerLiter,
      }));
    }
  }
}
