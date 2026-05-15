import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { ThemeService } from '@app/shared/services/theme/theme.service';
import { getByTestId } from '@app/shared/utils/test/test-utils';
import { signal, WritableSignal } from '@angular/core';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let isLightMode: WritableSignal<boolean>;

  beforeEach(async () => {
    isLightMode = signal(false);

    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        {
          provide: ThemeService,
          useValue: {
            isLightMode,
            toggleTheme: vi.fn(),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call toggleTheme on themeService when toggle theme button is clicked', () => {
    const themeService = TestBed.inject(ThemeService);

    const toggleButton = getByTestId(fixture, 'header-theme-button');
    toggleButton.triggerEventHandler('click', null);

    expect(themeService.toggleTheme).toHaveBeenCalled();
  });

  it('should reflect the current theme mode in the toggle button', () => {
    isLightMode.set(true);
    fixture.detectChanges();

    const icon = getByTestId(fixture, 'header-theme-button-icon');
    expect(icon.componentInstance.icon()).toEqual('dark_mode');

    isLightMode.set(false);
    fixture.detectChanges();

    expect(icon.componentInstance.icon()).toEqual('light_mode');
  });
});
