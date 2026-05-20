import { TestBed } from '@angular/core/testing';

import { ThemeService } from './theme.service';
import { CookieService } from '../cookie/cookie.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ThemeService,
        {
          provide: CookieService,
          useValue: {
            get: vi.fn(),
            set: vi.fn(),
          } as Pick<CookieService, 'get' | 'set'>,
        },
      ],
    });
    service = TestBed.inject(ThemeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
