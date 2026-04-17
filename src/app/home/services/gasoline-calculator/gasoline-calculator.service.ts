import { Injectable } from '@angular/core';
import { GasolineCalculatePayload } from '../../entities/gasoline-calculate-payload';
import { ROUND_TRIP_MULTIPLIER } from '../../constants/calculate';
import { isLessThanOrEqual, isValidNumber } from '@app/shared/utils/number';

@Injectable()
export class GasolineCalculatorService {
  public calculate(input: GasolineCalculatePayload): number {
    if (!isValidNumber(input.distance) || isLessThanOrEqual(input.distance, 0)) {
      throw new ReferenceError('Invalid distance value. Distance must be a positive number.');
    }

    if (!isValidNumber(input.gasolinePrice) || isLessThanOrEqual(input.gasolinePrice, 0)) {
      throw new ReferenceError(
        'Invalid gasoline price value. Gasoline price must be a positive number.'
      );
    }

    if (!isValidNumber(input.distancePerLiter) || isLessThanOrEqual(input.distancePerLiter, 0)) {
      throw new ReferenceError(
        'Invalid distance per liter value. Distance per liter must be a positive number.'
      );
    }

    const distanceSanitized = input.isRoundTrip
      ? input.distance * ROUND_TRIP_MULTIPLIER
      : input.distance;

    const litersNeeded = distanceSanitized / input.distancePerLiter;

    const result = litersNeeded * input.gasolinePrice;

    const resultRounded = Number(result.toFixed(2));

    return resultRounded;
  }
}
