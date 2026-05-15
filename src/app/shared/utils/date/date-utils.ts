import { addMonths as dateFnsAddMonths } from 'date-fns';

export const addMonths = (date: Date, months: number): Date => {
  return dateFnsAddMonths(date, months);
};

export const now = (): Date => {
  return new Date();
};
