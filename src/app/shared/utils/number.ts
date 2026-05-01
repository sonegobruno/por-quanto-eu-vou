export const isValidNumber = (input: unknown): input is number => {
  if (typeof input !== 'number' || isNaN(input) || !isFinite(input)) {
    return false;
  }

  return true;
};

export const isLessThan = (input: number, lessThan: number): boolean => {
  return input < lessThan;
};

export const isLessThanOrEqual = (input: number, lessThan: number): boolean => {
  return input <= lessThan;
};

export const isGreaterThan = (input: number, greaterThan: number): boolean => {
  return input > greaterThan;
};

export const isGreaterThanOrEqual = (input: number, greaterThan: number): boolean => {
  return input >= greaterThan;
};

export const toNumber = (input: unknown): number => {
  if (typeof input === 'number') {
    return input;
  }

  if (typeof input === 'string') {
    const parsed = parseFloat(input);
    if (!isNaN(parsed) && isFinite(parsed)) {
      return parsed;
    }
  }

  return NaN;
};
