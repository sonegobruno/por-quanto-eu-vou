import { TestBed } from '@angular/core/testing';

import { ThemeService } from './theme.service';
import { CookieService } from '../cookie/cookie.service';
import { CookieMockService } from '../cookie/cookie-mock.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ThemeService,
        CookieMockService,
        {
          provide: CookieService,
          useExisting: CookieMockService,
        },
      ],
    });
    service = TestBed.inject(ThemeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
