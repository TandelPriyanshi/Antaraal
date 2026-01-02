// frontend/src/test/setup.ts
import '@testing-library/jest-dom/vitest';
import { vi, beforeAll, afterEach, afterAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import { server } from './mocks/server';

// Add global type definitions
declare const global: typeof globalThis & {
  localStorage: Storage;
};

// Mock the Navigation component
vi.mock('@/components/ui/navigation', () => ({
  __esModule: true,
  default: () => 'Navigation',
}));

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useLocation: () => ({
      pathname: '/',
      search: '',
      hash: '',
      state: null,
      key: 'test-key',
    }),
  };
});

// Mock window.matchMedia
const matchMediaMock = (query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
});

// Mock window.scrollTo
window.scrollTo = vi.fn();

// Set up mocks before all tests
beforeAll(() => {
  // Start the mock service worker
  server.listen({ onUnhandledRequest: 'error' });
  
  // Mock matchMedia
  window.matchMedia = window.matchMedia || matchMediaMock;
  
  // Mock localStorage
  const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  };
  
  global.localStorage = localStorageMock as unknown as Storage;
});

// Clean up after each test
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  // Reset any request handlers that may have been added during tests
  server.resetHandlers();
});

// Clean up after all tests are done
afterAll(() => {
  // Close the mock service worker
  server.close();
});

// Mock next/router
vi.mock('next/router', () => ({
  useRouter: () => ({
    route: '/',
    pathname: '/',
    query: {},
    asPath: '/',
    push: vi.fn(),
    replace: vi.fn(),
    reload: vi.fn(),
    back: vi.fn(),
    prefetch: vi.fn(),
    beforePopState: vi.fn(),
    events: {
      on: vi.fn(),
      off: vi.fn(),
      emit: vi.fn(),
    },
    isFallback: false,
  }),
}));

// Mock any API clients or services
vi.mock('@/lib/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));