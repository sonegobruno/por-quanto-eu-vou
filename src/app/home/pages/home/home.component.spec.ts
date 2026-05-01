import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { By } from '@angular/platform-browser';
import { GasolineCalculatorService } from '@app/home/services/gasoline-calculator/gasoline-calculator.service';
import { FormService } from '@app/shared/services/form/form.service';
import { COOKIE, CookiePort } from '@app/shared/services/cookie/cookie-port';
import {
  LAST_DISTANCE_PER_LITER_COOKIE_NAME,
  LAST_GASOLINE_PRICE_COOKIE_NAME,
} from '@app/home/constants/last-usage-cookie-name';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        {
          provide: FormService,
          useValue: { handleError: vi.fn() } as Pick<FormService, 'handleError'>,
        },
        {
          provide: COOKIE,
          useValue: {
            get: vi.fn(),
            set: vi.fn(),
          } as Pick<CookiePort, 'get' | 'set'>,
        },
      ],
    })
      .overrideComponent(HomeComponent, {
        set: {
          providers: [
            {
              provide: GasolineCalculatorService,
              useValue: { calculate: vi.fn() } as Pick<GasolineCalculatorService, 'calculate'>,
            },
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  function submitForm(
    distance: number | null,
    gasolinePrice: number | null,
    distancePerLiter: number | null,
    isRoundTrip: boolean = false
  ) {
    const form = fixture.debugElement.query(By.css('[data-testid="home-form"]'));
    const inputDistance = fixture.debugElement.query(By.css('[data-testid="home-distance"]'));
    const inputGasolinePrice = fixture.debugElement.query(
      By.css('[data-testid="home-gasoline-price"]')
    );
    const inputDistancePerLiter = fixture.debugElement.query(
      By.css('[data-testid="home-distance-per-liter"]')
    );
    const inputIsRoundTrip = fixture.debugElement.query(
      By.css('[data-testid="home-is-round-trip"]')
    );

    inputGasolinePrice.nativeElement.value = gasolinePrice?.toString() || '';
    inputGasolinePrice.nativeElement.dispatchEvent(new Event('input'));

    inputDistancePerLiter.nativeElement.value = distancePerLiter?.toString() || '';
    inputDistancePerLiter.nativeElement.dispatchEvent(new Event('input'));

    inputDistance.nativeElement.value = distance?.toString() || '';
    inputDistance.nativeElement.dispatchEvent(new Event('input'));

    inputIsRoundTrip.nativeElement.checked = isRoundTrip;
    inputIsRoundTrip.nativeElement.dispatchEvent(new Event('input'));

    form.nativeElement.dispatchEvent(new Event('submit'));
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call formService handleErrors if fields has required error', () => {
    const formService = TestBed.inject(FormService);

    submitForm(null, null, null);

    expect(formService.handleError).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ message: 'Distância é obrigatória' }),
        expect.objectContaining({ message: 'Preço do combustível é obrigatório' }),
        expect.objectContaining({ message: 'Distância por litro é obrigatória' }),
      ])
    );
  });
  it('should call formService handleErrors if field has min error', () => {
    const formService = TestBed.inject(FormService);

    submitForm(1, 1, 1);

    expect(formService.handleError).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ message: 'Distância precisa ser maior que 1' }),
        expect.objectContaining({ message: 'Preço do combustível precisa ser maior que 1' }),
        expect.objectContaining({ message: 'Distância por litro precisa ser maior que 1' }),
      ])
    );
  });

  it('should call formService handleErrors if field has max error', () => {
    const formService = TestBed.inject(FormService);

    submitForm(1000000, 100, 100);

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

  it('should call calculation if form is valid', () => {
    const gasolineCalculatorService = fixture.debugElement.injector.get(GasolineCalculatorService);
    submitForm(100, 6.5, 10);

    expect(gasolineCalculatorService.calculate).toHaveBeenCalledWith({
      distance: 100,
      gasolinePrice: 6.5,
      distancePerLiter: 10,
      isRoundTrip: false,
    });
  });

  // TODO: fix round trip
  it.skip('should reflect isRoundTrip value', () => {
    const gasolineCalculatorService = fixture.debugElement.injector.get(GasolineCalculatorService);
    submitForm(100, 6.5, 10, true);

    expect(gasolineCalculatorService.calculate).toHaveBeenCalledWith({
      distance: 100,
      gasolinePrice: 6.5,
      distancePerLiter: 10,
      isRoundTrip: true,
    });
  });

  it('should reflect calculation result in the view', () => {
    const gasolineCalculatorService = fixture.debugElement.injector.get(
      GasolineCalculatorService
    ) as any; // TODO: add correct type
    gasolineCalculatorService.calculate.mockReturnValue(68.21);

    submitForm(100, 6.5, 10);

    fixture.detectChanges();

    expect(
      fixture.debugElement.query(By.css('[data-testid="home-result"]')).nativeElement.textContent
    ).toBe('R$68.21');
  });

  it('should reset result to 0 after submitting invalid form', () => {
    const gasolineCalculatorService = fixture.debugElement.injector.get(
      GasolineCalculatorService
    ) as any; // TODO: add correct type
    gasolineCalculatorService.calculate.mockReturnValue(68.21);

    submitForm(100, 6.5, 10);
    fixture.detectChanges();

    const result = fixture.debugElement.query(By.css('[data-testid="home-result"]'));
    expect(result.nativeElement.textContent).toContain('R$68.21');

    submitForm(null, null, null);
    fixture.detectChanges();

    expect(result.nativeElement.textContent).toContain('R$0.00');
  });

  it('should set cookies with last valid form values', () => {
    const expectedGasolinePrice = 6.5;
    const expectedDistancePerLiter = 10;
    const cookieService = TestBed.inject(COOKIE);

    submitForm(100, expectedGasolinePrice, expectedDistancePerLiter, true);

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
    const cookieService = TestBed.inject(COOKIE) as any; // TODO: add correct type

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
});
