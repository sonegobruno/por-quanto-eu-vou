import {
  isGreaterThan,
  isGreaterThanOrEqual,
  isLessThan,
  isLessThanOrEqual,
  isValidNumber,
} from './number';

describe('isValidNumber', () => {
  it('should return true for valid numbers', () => {
    expect(isValidNumber(0)).toBe(true);
    expect(isValidNumber(1)).toBe(true);
    expect(isValidNumber(3.14)).toBe(true);
  });

  it('should return false for invalid numbers', () => {
    expect(isValidNumber(NaN)).toBe(false);
    expect(isValidNumber(Infinity)).toBe(false);
    expect(isValidNumber(-Infinity)).toBe(false);
    expect(isValidNumber('string')).toBe(false);
    expect(isValidNumber(null)).toBe(false);
    expect(isValidNumber(undefined)).toBe(false);
  });
});

describe('isLessThan', () => {
  it('should return true if input is less than the specified value', () => {
    expect(isLessThan(5, 10)).toBe(true);
    expect(isLessThan(-1, 0)).toBe(true);
  });

  it('should return false if input is not less than the specified value', () => {
    expect(isLessThan(10, 5)).toBe(false);
    expect(isLessThan(0, -1)).toBe(false);
    expect(isLessThan(5, 5)).toBe(false);
  });
});

describe('isLessThanOrEqual', () => {
  it('should return true if input is less than or equal to the specified value', () => {
    expect(isLessThanOrEqual(5, 10)).toBe(true);
    expect(isLessThanOrEqual(5, 5)).toBe(true);
    expect(isLessThanOrEqual(-1, 0)).toBe(true);
  });

  it('should return false if input is greater than the specified value', () => {
    expect(isLessThanOrEqual(10, 5)).toBe(false);
    expect(isLessThanOrEqual(0, -1)).toBe(false);
  });
});

describe('isGreaterThan', () => {
  it('should return true if input is greater than the specified value', () => {
    expect(isGreaterThan(10, 5)).toBe(true);
    expect(isGreaterThan(0, -1)).toBe(true);
  });

  it('should return false if input is not greater than the specified value', () => {
    expect(isGreaterThan(5, 10)).toBe(false);
    expect(isGreaterThan(-1, 0)).toBe(false);
    expect(isGreaterThan(5, 5)).toBe(false);
  });
});

describe('isGreaterThanOrEqual', () => {
  it('should return true if input is greater than or equal to the specified value', () => {
    expect(isGreaterThanOrEqual(10, 5)).toBe(true);
    expect(isGreaterThanOrEqual(5, 5)).toBe(true);
    expect(isGreaterThanOrEqual(0, -1)).toBe(true);
  });

  it('should return false if input is less than the specified value', () => {
    expect(isGreaterThanOrEqual(5, 10)).toBe(false);
    expect(isGreaterThanOrEqual(-1, 0)).toBe(false);
  });
});
