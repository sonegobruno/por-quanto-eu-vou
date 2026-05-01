import { TestBed } from '@angular/core/testing';

import { CookieService } from './cookie.service';

describe('CookieService', () => {
  let service: CookieService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CookieService,
        {
          provide: CookieService,
          useValue: { get: vi.fn(), set: vi.fn() } as Pick<CookieService, 'get' | 'set'>,
        },
      ],
    });
    service = TestBed.inject(CookieService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call get method of cookie service', () => {
    const cookieService = TestBed.inject(CookieService);
    const cookieName = 'testCookie';

    service.get(cookieName);

    expect(cookieService.get).toHaveBeenCalledWith(cookieName);
  });

  it('should call set method of cookie service', () => {
    const cookieService = TestBed.inject(CookieService);
    const cookieName = 'testCookie';
    const cookieValue = 'testValue';

    service.set(cookieName, cookieValue);

    expect(cookieService.set).toHaveBeenCalledWith(cookieName, cookieValue);
  });
});
