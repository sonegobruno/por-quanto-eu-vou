import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { GasolineCalculatorService } from '@app/home/services/gasoline-calculator/gasoline-calculator.service';
import { signal } from '@angular/core';
import { form, required, FormField, FormRoot } from '@angular/forms/signals';
import { SnackbarService } from '@app/shared/services/snackbar/snackbar.service';
import { LogService } from '@app/core/services/log/log.service';

@Component({
  selector: 'pqev-home',
  imports: [FormField, FormRoot],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [GasolineCalculatorService],
})
export class HomeComponent {
  private readonly gasolineCalculatorService = inject(GasolineCalculatorService);
  private readonly snackBarService = inject(SnackbarService);
  private readonly logService = inject(LogService);

  private calculator = signal({
    distance: NaN,
    gasolinePrice: NaN,
    distancePerLiter: NaN,
    isRoundTrip: false,
  });

  protected calculatorForm = form(
    this.calculator,
    schemaPath => {
      required(schemaPath.distance, { message: 'Distancia é obrigatória' });
      required(schemaPath.gasolinePrice, { message: 'Preço do combustível é obrigatório' });
      required(schemaPath.distancePerLiter, { message: 'Distância por litro é obrigatória' });
    },
    {
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
          const errorSummary = field().errorSummary();
          const firstError = errorSummary[0];

          const message = field()
            .errorSummary()
            .map(error => error.message)
            .join('\n');

          this.snackBarService.warn(message);

          this.logService.warn('Formulário inválido', field().errorSummary());

          firstError?.fieldTree()?.focusBoundControl();
        },
      },
    }
  );

  protected result = signal<number | null>(null);
}
