/**
 * Jest test setup
 * 
 * This file runs before all tests
 */

// Set test timeout to 30 seconds for emulator tests
jest.setTimeout(30000);

// Suppress console logs during tests unless debugging
if (!process.env.DEBUG_TESTS) {
  global.console = {
    ...console,
    log: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
  };
}
