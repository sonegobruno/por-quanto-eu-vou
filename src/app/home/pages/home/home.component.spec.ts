import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { By } from '@angular/platform-browser';
import { SnackbarService } from '@app/shared/services/snackbar/snackbar.service';
import { LogService } from '@app/core/services/log/log.service';
import { GasolineCalculatorService } from '@app/home/services/gasoline-calculator/gasoline-calculator.service';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        { provide: SnackbarService, useValue: { open: vi.fn() } as Pick<SnackbarService, 'open'> },
        { provide: LogService, useValue: { warn: vi.fn() } as Pick<LogService, 'warn'> },
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

  it('should call snackbar warning if distance is invalid', () => {
    const snackbarService = TestBed.inject(SnackbarService);

    submitForm(null, null, null);

    expect(snackbarService.open).toHaveBeenCalledWith(
      expect.stringContaining('Distancia é obrigatória')
    );
    expect(snackbarService.open).toHaveBeenCalledWith(
      expect.stringContaining('Preço do combustível é obrigatório')
    );
    expect(snackbarService.open).toHaveBeenCalledWith(
      expect.stringContaining('Distância por litro é obrigatória')
    );
  });
  it('should call snackbar warning if gasoline price is invalid', () => {
    const snackbarService = TestBed.inject(SnackbarService);

    submitForm(100, null, null);

    expect(snackbarService.open).not.toHaveBeenCalledWith(
      expect.stringContaining('Distancia é obrigatória')
    );
    expect(snackbarService.open).toHaveBeenCalledWith(
      expect.stringContaining('Preço do combustível é obrigatório')
    );
    expect(snackbarService.open).toHaveBeenCalledWith(
      expect.stringContaining('Distância por litro é obrigatória')
    );
  });

  it('should call snackbar warning if distance per liter is invalid', () => {
    submitForm(100, 6.5, null);

    const snackbarService = TestBed.inject(SnackbarService);

    expect(snackbarService.open).not.toHaveBeenCalledWith(
      expect.stringContaining('Distancia é obrigatória')
    );
    expect(snackbarService.open).not.toHaveBeenCalledWith(
      expect.stringContaining('Preço do combustível é obrigatório')
    );
    expect(snackbarService.open).toHaveBeenCalledWith(
      expect.stringContaining('Distância por litro é obrigatória')
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

  it('should reflect isRoundTrip value', () => {
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
    ).toContain('68.21');
  });
});
