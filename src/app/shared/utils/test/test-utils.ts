import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { vi } from 'vitest';
import type { Mock } from 'vitest';

export const getByTestId = <T>(fixture: ComponentFixture<T>, testId: string) =>
  fixture.debugElement.query(By.css(`[data-testid="${testId}"]`));

type SpyOf<T> = {
  [K in keyof T]: T[K] extends (...args: infer A) => infer R ? Mock<(...args: A) => R> : T[K];
};

export type SpyMock<T> = SpyOf<T> & T;

export function createMock<T>(methods: (keyof T)[]): SpyMock<T> {
  const mock = {} as SpyOf<T> & T;

  for (const method of methods) {
    (mock as Record<keyof T, unknown>)[method] = vi.fn();
  }

  return mock;
}
