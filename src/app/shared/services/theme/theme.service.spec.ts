import { PLATFORM_ID, RendererFactory2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';
import { CookieService } from '../cookie/cookie.service';
import { CookieMockService } from '../cookie/cookie-mock.service';

const THEME_COOKIE_KEY = 'pqev-theme-selected';

describe('ThemeService', () => {
  let cookieMock: CookieMockService;
  let renderer: { addClass: ReturnType<typeof vi.fn>; removeClass: ReturnType<typeof vi.fn> };

  function createService(
    options: {
      cookieValue?: string;
      platformId?: string;
    } = {}
  ): ThemeService {
    cookieMock = new CookieMockService();
    cookieMock.get.mockReturnValue(options.cookieValue ?? '');

    renderer = {
      addClass: vi.fn(),
      removeClass: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        ThemeService,
        {
          provide: CookieService,
          useValue: cookieMock,
        },
        {
          provide: PLATFORM_ID,
          useValue: options.platformId ?? 'browser',
        },
        {
          provide: RendererFactory2,
          useValue: {
            createRenderer: vi.fn().mockReturnValue(renderer),
          },
        },
      ],
    });

    return TestBed.inject(ThemeService);
  }

  afterEach(() => {
    TestBed.resetTestingModule();
    document.body.classList.remove('body--dark');
    vi.clearAllMocks();
  });

  it('should be created', () => {
    const service = createService();
    expect(service).toBeTruthy();
  });

  describe('initialization', () => {
    it('should default to light mode when the theme cookie is missing', () => {
      const service = createService({ cookieValue: '' });

      expect(cookieMock.get).toHaveBeenCalledWith(THEME_COOKIE_KEY);
      expect(service.isLightMode()).toBe(true);
    });

    it('should default to light mode when the theme cookie value is invalid', () => {
      const service = createService({ cookieValue: 'sepia' });

      expect(service.isLightMode()).toBe(true);
    });

    it('should restore light mode from a valid light theme cookie', () => {
      const service = createService({ cookieValue: 'light' });

      expect(service.isLightMode()).toBe(true);
    });

    it('should restore dark mode from a valid dark theme cookie', () => {
      const service = createService({ cookieValue: 'dark' });

      expect(service.isLightMode()).toBe(false);
    });
  });

  describe('toggleTheme', () => {
    it('should switch from light to dark and persist the theme in the cookie', () => {
      const service = createService({ cookieValue: 'light' });

      service.toggleTheme();

      expect(service.isLightMode()).toBe(false);
      expect(cookieMock.set).toHaveBeenCalledWith(THEME_COOKIE_KEY, 'dark');
    });

    it('should switch from dark to light and persist the theme in the cookie', () => {
      const service = createService({ cookieValue: 'dark' });

      service.toggleTheme();

      expect(service.isLightMode()).toBe(true);
      expect(cookieMock.set).toHaveBeenCalledWith(THEME_COOKIE_KEY, 'light');
    });

    it('should toggle the theme back and forth on consecutive calls', () => {
      const service = createService();

      expect(service.isLightMode()).toBe(true);

      service.toggleTheme();
      expect(service.isLightMode()).toBe(false);

      service.toggleTheme();
      expect(service.isLightMode()).toBe(true);

      expect(cookieMock.set).toHaveBeenNthCalledWith(1, THEME_COOKIE_KEY, 'dark');
      expect(cookieMock.set).toHaveBeenNthCalledWith(2, THEME_COOKIE_KEY, 'light');
    });
  });

  describe('browser DOM updates', () => {
    it('should remove the dark body class when the theme is light', () => {
      document.body.classList.add('body--dark');
      createService({ cookieValue: 'light' });

      expect(renderer.removeClass).toHaveBeenCalledWith(document.body, 'body--dark');
      expect(renderer.addClass).not.toHaveBeenCalled();
    });

    it('should add the dark body class when the theme is dark', () => {
      createService({ cookieValue: 'dark' });

      expect(renderer.addClass).toHaveBeenCalledWith(document.body, 'body--dark');
    });

    it('should update the body class when the theme is toggled', () => {
      const service = createService({ cookieValue: 'light' });

      renderer.addClass.mockClear();
      renderer.removeClass.mockClear();

      service.toggleTheme();

      expect(renderer.addClass).toHaveBeenCalledWith(document.body, 'body--dark');

      renderer.addClass.mockClear();
      renderer.removeClass.mockClear();

      service.toggleTheme();

      expect(renderer.removeClass).toHaveBeenCalledWith(document.body, 'body--dark');
    });
  });

  describe('server platform', () => {
    it('should not update the document body when running on the server', () => {
      createService({ platformId: 'server', cookieValue: 'dark' });

      expect(renderer.addClass).not.toHaveBeenCalled();
      expect(renderer.removeClass).not.toHaveBeenCalled();
    });

    it('should still toggle the theme and persist the cookie on the server', () => {
      const service = createService({ platformId: 'server' });

      service.toggleTheme();

      expect(service.isLightMode()).toBe(false);
      expect(cookieMock.set).toHaveBeenCalledWith(THEME_COOKIE_KEY, 'dark');
      expect(renderer.addClass).not.toHaveBeenCalled();
    });
  });
});
