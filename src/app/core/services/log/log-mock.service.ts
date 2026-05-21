export class LogMockService {
  info = vi.fn();
  error = vi.fn();
  debug = vi.fn();
  warn = vi.fn();
  log = vi.fn();
}
