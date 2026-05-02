import { TestBed } from '@angular/core/testing';

import { ThemeService } from './theme.service';
import { COOKIE, CookiePort } from '../cookie/cookie-port';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ThemeService,
        {
          provide: COOKIE,
          useValue: {
            get: vi.fn(),
            set: vi.fn(),
          } as Pick<CookiePort, 'get' | 'set'>,
        },
      ],
    });
    service = TestBed.inject(ThemeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
