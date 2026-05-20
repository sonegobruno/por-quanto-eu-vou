import { isPlatformBrowser } from '@angular/common';
import { DestroyRef, inject, Injectable, PLATFORM_ID, RendererFactory2 } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { CookieService } from '../cookie/cookie.service';

const themes = ['light', 'dark'] as const;

type Theme = (typeof themes)[number];

const DEFAULT_THEME: Theme = 'light';

@Injectable()
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);

  private readonly cookieService = inject(CookieService);

  private readonly destroyRef = inject(DestroyRef);

  private readonly theme$ = new BehaviorSubject<Theme>(DEFAULT_THEME);

  public readonly isLightMode = toSignal(this.theme$.pipe(map(theme => theme === 'light')), {
    initialValue: true,
  });

  private readonly themeCookieKey = 'pqev-theme-selected';

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.onChangeTheme();
    }

    const themeSelected = this.cookieService.get(this.themeCookieKey);

    if (this.isValidTheme(themeSelected)) {
      this.theme$.next(themeSelected);
    }
  }

  toggleTheme(): void {
    const currentTheme = this.theme$.getValue();
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    this.theme$.next(newTheme);
    this.cookieService.set(this.themeCookieKey, newTheme);
  }

  private isValidTheme(theme: unknown): theme is Theme {
    return themes.includes(theme as Theme);
  }

  private onChangeTheme(): void {
    const rendererFactory = inject(RendererFactory2);
    const renderer = rendererFactory.createRenderer(null, null);

    this.theme$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(theme => {
      switch (theme) {
        case 'light':
          renderer.removeClass(document.body, 'body--dark');
          break;
        case 'dark':
          renderer.addClass(document.body, 'body--dark');
          break;
        default:
          throw new Error(`Unsupported theme: ${theme}`);
      }
    });
  }
}
