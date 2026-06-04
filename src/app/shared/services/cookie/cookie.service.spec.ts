import { TestBed } from '@angular/core/testing';

import { CookieService } from './cookie.service';
import { addMonths } from '@app/shared/utils/date/date-utils';
import { CookieService as NgxCookieService } from 'ngx-cookie-service';

describe('CookieService', () => {
  let service: CookieService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CookieService,
        {
          provide: NgxCookieService,
          useValue: { get: vi.fn(), set: vi.fn() } as Pick<CookieService, 'get' | 'set'>,
        },
      ],
    });
    service = TestBed.inject(CookieService);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call get method of cookie service', () => {
    const cookieService = TestBed.inject(NgxCookieService);
    const cookieName = 'testCookie';

    service.get(cookieName);

    expect(cookieService.get).toHaveBeenCalledWith(cookieName);
  });

  it('should call set method of cookie service with expiration default', () => {
    const fixedNow = new Date('2024-06-15T12:00:00.000Z');
    vi.useFakeTimers();
    vi.setSystemTime(fixedNow);

    const cookieService = TestBed.inject(NgxCookieService);
    const cookieName = 'testCookie';
    const cookieValue = 'testValue';

    service.set(cookieName, cookieValue);

    expect(cookieService.set).toHaveBeenCalledWith(cookieName, cookieValue, addMonths(fixedNow, 6));
  });

  it('should call set method of cookie service with expiration', () => {
    const cookieService = TestBed.inject(NgxCookieService);
    const cookieName = 'testCookie';
    const cookieValue = 'testValue';
    const expiredDate = new Date('2024-12-31');

    service.set(cookieName, cookieValue, expiredDate);

    expect(cookieService.set).toHaveBeenCalledWith(cookieName, cookieValue, expiredDate);
  });
});
