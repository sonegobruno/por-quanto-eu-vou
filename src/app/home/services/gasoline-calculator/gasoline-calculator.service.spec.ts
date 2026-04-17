import { TestBed } from '@angular/core/testing';

import { GasolineCalculatorService } from './gasoline-calculator.service';

describe('GasolineCalculatorService', () => {
  let service: GasolineCalculatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GasolineCalculatorService],
    });
    service = TestBed.inject(GasolineCalculatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should calculate the gasoline cost correctly', () => {
    const result = service.calculate({
      distance: 100,
      isRoundTrip: false,
      gasolinePrice: 6.5,
      distancePerLiter: 9.53,
    });
    expect(result).toBe(68.21);
  });

  it('should calculate the round trip correctly', () => {
    const result = service.calculate({
      distance: 100,
      isRoundTrip: true,
      gasolinePrice: 6.5,
      distancePerLiter: 9.53,
    });
    expect(result).toBe(136.41);
  });

  it('should throw error if distance is invalid', () => {
    expect(() =>
      service.calculate({
        distance: -100,
        isRoundTrip: false,
        gasolinePrice: 6.5,
        distancePerLiter: 9.53,
      })
    ).toThrow('Invalid distance value. Distance must be a positive number.');

    expect(() =>
      service.calculate({
        distance: NaN,
        isRoundTrip: false,
        gasolinePrice: 6.5,
        distancePerLiter: 9.53,
      })
    ).toThrow('Invalid distance value. Distance must be a positive number.');

    expect(() =>
      service.calculate({
        distance: 0,
        isRoundTrip: false,
        gasolinePrice: 6.5,
        distancePerLiter: 9.53,
      })
    ).toThrow('Invalid distance value. Distance must be a positive number.');
  });

  it('should throw error if gasoline price is invalid', () => {
    expect(() =>
      service.calculate({
        distance: 100,
        isRoundTrip: false,
        gasolinePrice: -6.5,
        distancePerLiter: 9.53,
      })
    ).toThrow('Invalid gasoline price value. Gasoline price must be a positive number.');

    expect(() =>
      service.calculate({
        distance: 100,
        isRoundTrip: false,
        gasolinePrice: 0,
        distancePerLiter: 9.53,
      })
    ).toThrow('Invalid gasoline price value. Gasoline price must be a positive number.');

    expect(() =>
      service.calculate({
        distance: 100,
        isRoundTrip: false,
        gasolinePrice: NaN,
        distancePerLiter: 9.53,
      })
    ).toThrow('Invalid gasoline price value. Gasoline price must be a positive number.');
  });

  it('should throw error if distance per liter is invalid', () => {
    expect(() =>
      service.calculate({
        distance: 100,
        isRoundTrip: false,
        gasolinePrice: 6.5,
        distancePerLiter: -9.53,
      })
    ).toThrow('Invalid distance per liter value. Distance per liter must be a positive number.');

    expect(() =>
      service.calculate({
        distance: 100,
        isRoundTrip: false,
        gasolinePrice: 6.5,
        distancePerLiter: 0,
      })
    ).toThrow('Invalid distance per liter value. Distance per liter must be a positive number.');

    expect(() =>
      service.calculate({
        distance: 100,
        isRoundTrip: false,
        gasolinePrice: 6.5,
        distancePerLiter: NaN,
      })
    ).toThrow('Invalid distance per liter value. Distance per liter must be a positive number.');
  });
});
