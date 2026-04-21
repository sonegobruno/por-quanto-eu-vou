import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { GasolineCalculatorService } from '@app/home/services/gasoline-calculator/gasoline-calculator.service';
import { signal } from '@angular/core';
import { form, required, FormField, FormRoot, min, max } from '@angular/forms/signals';
import { FormService } from '@app/shared/services/form/form.service';

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
  private readonly formService = inject(FormService);

  private calculator = signal({
    distance: NaN,
    gasolinePrice: NaN,
    distancePerLiter: NaN,
    isRoundTrip: false,
  });

  protected calculatorForm = form(
    this.calculator,
    schemaPath => {
      required(schemaPath.distance, { message: 'Distância é obrigatória' });
      min(schemaPath.distance, 1.1, { message: 'Distância precisa ser maior que 1' });
      max(schemaPath.distance, 999999, { message: 'Distância precisa ser menor que 1 milhão' });
      required(schemaPath.gasolinePrice, { message: 'Preço do combustível é obrigatório' });
      min(schemaPath.gasolinePrice, 1.1, {
        message: 'Preço do combustível precisa ser maior que 1',
      });
      max(schemaPath.gasolinePrice, 99, {
        message: 'Preço do combustível precisa ser menor que R$ 100,00',
      });
      required(schemaPath.distancePerLiter, { message: 'Distância por litro é obrigatória' });
      min(schemaPath.distancePerLiter, 1.1, {
        message: 'Distância por litro precisa ser maior que 1',
      });
      max(schemaPath.distancePerLiter, 99, {
        message: 'Distância por litro precisa ser menor que 100 Km/L',
      });
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
          this.formService.handleError(field().errorSummary());
        },
      },
    }
  );

  protected result = signal<number | null>(null);
}
