import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { By } from '@angular/platform-browser';
import { GasolineCalculatorService } from '@app/home/services/gasoline-calculator/gasoline-calculator.service';
import { GasolineCalculatorMockService } from '@app/home/services/gasoline-calculator/gasoline-calculator-mock.service';
import { FormService } from '@app/shared/services/form/form.service';
import { FormMockService } from '@app/shared/services/form/form-mock.service';
import {
  LAST_DISTANCE_PER_LITER_COOKIE_NAME,
  LAST_GASOLINE_PRICE_COOKIE_NAME,
} from '@app/home/constants/last-usage-cookie-name';
import { CookieService } from '@app/shared/services/cookie/cookie.service';
import { CookieMockService } from '@app/shared/services/cookie/cookie-mock.service';
import { getByTestId } from '@app/shared/utils/test/test-utils';
import { SnackbarMockService } from '@app/shared/services/snackbar/snackbar-mock.service';
import { SnackbarService } from '@app/shared/services/snackbar/snackbar.service';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        FormMockService,
        {
          provide: FormService,
          useExisting: FormMockService,
        },
        CookieMockService,
        {
          provide: CookieService,
          useExisting: CookieMockService,
        },
        GasolineCalculatorMockService,
      ],
    })
      .overrideComponent(HomeComponent, {
        set: {
          providers: [
            {
              provide: GasolineCalculatorService,
              useExisting: GasolineCalculatorMockService,
            },
            SnackbarMockService,
            {
              provide: SnackbarService,
              useExisting: SnackbarMockService,
            },
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  async function submitForm(
    distance: number | null,
    gasolinePrice: number | null,
    distancePerLiter: number | null,
    isRoundTrip: boolean = false
  ) {
    const form = getByTestId(fixture, 'home-form');
    const inputDistance = getByTestId(fixture, 'home-distance');
    const inputGasolinePrice = getByTestId(fixture, 'home-gasoline-price');
    const inputDistancePerLiter = getByTestId(fixture, 'home-distance-per-liter');
    const inputIsRoundTrip = getByTestId(fixture, 'home-is-round-trip');

    inputGasolinePrice.nativeElement.value = gasolinePrice?.toString() || '';
    inputGasolinePrice.nativeElement.dispatchEvent(new Event('input'));

    inputDistancePerLiter.nativeElement.value = distancePerLiter?.toString() || '';
    inputDistancePerLiter.nativeElement.dispatchEvent(new Event('input'));

    inputDistance.nativeElement.value = distance?.toString() || '';
    inputDistance.nativeElement.dispatchEvent(new Event('input'));

    inputIsRoundTrip.nativeElement.checked = isRoundTrip;
    inputIsRoundTrip.nativeElement.dispatchEvent(new Event('input'));

    form.nativeElement.dispatchEvent(new Event('submit'));

    await fixture.whenStable();
    fixture.detectChanges();
  }

  async function calculateWithResult(result: number) {
    const gasolineCalculatorService = fixture.debugElement.injector.get(
      GasolineCalculatorMockService
    );
    gasolineCalculatorService.calculate.mockReturnValue(result);
    await submitForm(100, 6.5, 10);
  }

  function setDividedBy(value: string) {
    const input = getByTestId(fixture, 'home-divided-by');
    input.nativeElement.value = value;
    input.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call formService handleErrors if fields has required error', async () => {
    const formService = TestBed.inject(FormMockService);

    await submitForm(null, null, null);

    expect(formService.handleError).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ message: 'Distância é obrigatória' }),
        expect.objectContaining({ message: 'Preço do combustível é obrigatório' }),
        expect.objectContaining({ message: 'Distância por litro é obrigatória' }),
      ])
    );
  });
  it('should call formService handleErrors if field has min error', async () => {
    const formService = TestBed.inject(FormMockService);

    await submitForm(1, 1, 1);

    expect(formService.handleError).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ message: 'Distância precisa ser maior que 1' }),
        expect.objectContaining({ message: 'Preço do combustível precisa ser maior que 1' }),
        expect.objectContaining({ message: 'Distância por litro precisa ser maior que 1' }),
      ])
    );
  });

  it('should call formService handleErrors if field has max error', async () => {
    const formService = TestBed.inject(FormMockService);

    await submitForm(1000000, 100, 100);

    expect(formService.handleError).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ message: 'Distância precisa ser menor que 1 milhão' }),
        expect.objectContaining({
          message: 'Preço do combustível precisa ser menor que R$ 100,00',
        }),
        expect.objectContaining({ message: 'Distância por litro precisa ser menor que 100 Km/L' }),
      ])
    );
  });

  it('should call calculation if form is valid', async () => {
    const gasolineCalculatorService = fixture.debugElement.injector.get(
      GasolineCalculatorMockService
    );
    await submitForm(100, 6.5, 10);

    expect(gasolineCalculatorService.calculate).toHaveBeenCalledWith({
      distance: 100,
      gasolinePrice: 6.5,
      distancePerLiter: 10,
      isRoundTrip: false,
    });
  });

  // TODO: fix round trip
  it.skip('should reflect isRoundTrip value', async () => {
    const gasolineCalculatorService = fixture.debugElement.injector.get(
      GasolineCalculatorMockService
    );
    await submitForm(100, 6.5, 10, true);

    expect(gasolineCalculatorService.calculate).toHaveBeenCalledWith({
      distance: 100,
      gasolinePrice: 6.5,
      distancePerLiter: 10,
      isRoundTrip: true,
    });
  });

  it('should reflect calculation result in the view', async () => {
    const gasolineCalculatorService = fixture.debugElement.injector.get(
      GasolineCalculatorMockService
    );
    gasolineCalculatorService.calculate.mockReturnValue(68.21);

    await submitForm(100, 6.5, 10);

    expect(
      fixture.debugElement.query(By.css('[data-testid="home-result"]')).nativeElement.textContent
    ).toBe('R$68.21');
  });

  it('should reset result to 0 after submitting invalid form', async () => {
    const gasolineCalculatorService = fixture.debugElement.injector.get(
      GasolineCalculatorMockService
    );
    gasolineCalculatorService.calculate.mockReturnValue(68.21);

    await submitForm(100, 6.5, 10);

    const result = fixture.debugElement.query(By.css('[data-testid="home-result"]'));
    expect(result.nativeElement.textContent).toContain('R$68.21');

    await submitForm(null, null, null);

    expect(result.nativeElement.textContent).toContain('R$0.00');
  });

  it('should set cookies with last valid form values', async () => {
    const expectedGasolinePrice = 6.5;
    const expectedDistancePerLiter = 10;
    const cookieService = TestBed.inject(CookieMockService);

    await submitForm(100, expectedGasolinePrice, expectedDistancePerLiter, true);

    expect(cookieService.set).toHaveBeenCalledWith(
      LAST_GASOLINE_PRICE_COOKIE_NAME,
      expectedGasolinePrice.toString()
    );
    expect(cookieService.set).toHaveBeenCalledWith(
      LAST_DISTANCE_PER_LITER_COOKIE_NAME,
      expectedDistancePerLiter.toString()
    );
  });

  it('should get last valid form values from cookies on init', () => {
    const expectedGasolinePrice = '6.5';
    const expectedDistancePerLiter = '10';
    const cookieService = TestBed.inject(CookieMockService);

    cookieService.get.mockImplementation((name: string) => {
      if (name === LAST_GASOLINE_PRICE_COOKIE_NAME) {
        return expectedGasolinePrice;
      }
      if (name === LAST_DISTANCE_PER_LITER_COOKIE_NAME) {
        return expectedDistancePerLiter;
      }
      return null;
    });

    component.ngOnInit();
    fixture.detectChanges();

    const inputGasolinePrice = fixture.debugElement.query(
      By.css('[data-testid="home-gasoline-price"]')
    );
    const inputDistancePerLiter = fixture.debugElement.query(
      By.css('[data-testid="home-distance-per-liter"]')
    );

    expect(inputGasolinePrice.nativeElement.value).toBe(expectedGasolinePrice);
    expect(inputDistancePerLiter.nativeElement.value).toBe(expectedDistancePerLiter);
  });

  describe('divided by', () => {
    it('should not show divided by input when result is 0', () => {
      const dividedByInput = getByTestId(fixture, 'home-divided-by');

      expect(dividedByInput).toBeNull();
    });

    it('should show divided by input when result is greater than 0', async () => {
      await calculateWithResult(68.21);

      const dividedByInput = getByTestId(fixture, 'home-divided-by');

      expect(dividedByInput).not.toBeNull();
    });

    it('should not show divided result when divisor is empty', async () => {
      await calculateWithResult(68.21);

      const dividedResult = getByTestId(fixture, 'home-divided-result');

      expect(dividedResult).toBeNull();
    });

    it('should not show divided result when divisor is 0', async () => {
      await calculateWithResult(68.21);
      setDividedBy('0');

      const dividedResult = getByTestId(fixture, 'home-divided-result');

      expect(dividedResult).toBeNull();
    });

    it('should reflect divided result in the view', async () => {
      await calculateWithResult(68.21);
      setDividedBy('2');

      const dividedResult = getByTestId(fixture, 'home-divided-result');

      expect(dividedResult.nativeElement.textContent).toBe('R$34.11');
    });

    it('should hide divided by input after submitting invalid form', async () => {
      await calculateWithResult(68.21);
      expect(getByTestId(fixture, 'home-divided-by')).not.toBeNull();

      await submitForm(null, null, null);

      expect(getByTestId(fixture, 'home-divided-by')).toBeNull();
    });
  });
});
