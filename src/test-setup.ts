import { getTestBed, TestBed } from '@angular/core/testing';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';

function isTestEnvironmentInitialized(): boolean {
  try {
    getTestBed();
    return true;
  } catch {
    return false;
  }
}

if (!isTestEnvironmentInitialized()) {
  TestBed.initTestEnvironment(BrowserTestingModule, platformBrowserTesting());
}
