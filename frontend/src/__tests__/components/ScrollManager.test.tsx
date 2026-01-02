// src/__tests__/components/ScrollManager.test.tsx
import React from 'react';
import { render } from '@testing-library/react';
import { vi, beforeAll, afterAll, beforeEach, afterEach, describe, it, expect, Mock } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ScrollManager from '../../components/ScrollManager';

// Mock the useLocation hook
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useLocation: vi.fn(),
  };
});

// Import the mocked useLocation
import { useLocation } from 'react-router-dom';

// Cast to Mock for TypeScript
const mockUseLocation = useLocation as Mock;

describe('ScrollManager', () => {
  const scrollToMock = vi.fn();
  const originalScrollTo = window.scrollTo;
  const originalRequestAnimationFrame = global.requestAnimationFrame;

  beforeAll(() => {
    // Mock requestAnimationFrame
    global.requestAnimationFrame = (cb: FrameRequestCallback) => {
      return setTimeout(cb, 0) as unknown as number;
    };
  });

  afterAll(() => {
    // Restore the original
    global.requestAnimationFrame = originalRequestAnimationFrame;
  });

  beforeEach(() => {
    window.scrollTo = scrollToMock;
    vi.clearAllMocks();
    // Set default mock implementation
    mockUseLocation.mockImplementation(() => ({
      pathname: '/',
      search: '',
      hash: '',
      state: null,
      key: 'testKey',
    }));
  });

  afterEach(() => {
    window.scrollTo = originalScrollTo;
  });

  it('scrolls to top when pathname changes', async () => {
    // First render with initial pathname
    mockUseLocation.mockImplementation(() => ({
      pathname: '/initial',
      search: '',
      hash: '',
      state: null,
      key: 'testKey1',
    }));

    const { rerender } = render(
      <MemoryRouter initialEntries={['/initial']}>
        <Routes>
          <Route path="*" element={<ScrollManager />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for the next tick to allow requestAnimationFrame to execute
    await new Promise(resolve => setTimeout(resolve, 0));

    // First render should scroll to top
    expect(scrollToMock).toHaveBeenCalledWith({ top: 0, left: 0, behavior: "auto" });
    scrollToMock.mockClear();

    // Update the location
    mockUseLocation.mockImplementation(() => ({
      pathname: '/new-path',
      search: '',
      hash: '',
      state: null,
      key: 'testKey2',
    }));

    // Trigger re-render
    rerender(
      <MemoryRouter initialEntries={['/new-path']} initialIndex={0}>
        <Routes>
          <Route path="*" element={<ScrollManager />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for the next tick again
    await new Promise(resolve => setTimeout(resolve, 0));

    // Should scroll to top again
    expect(scrollToMock).toHaveBeenCalledWith({ top: 0, left: 0, behavior: "auto" });
  });

  it('does not scroll when pathname does not change', async () => {
    const location = {
      pathname: '/same-path',
      search: '',
      hash: '',
      state: null,
      key: 'testKey3',
    };

    mockUseLocation.mockImplementation(() => location);

    const { rerender } = render(
      <MemoryRouter initialEntries={['/same-path']}>
        <Routes>
          <Route path="*" element={<ScrollManager />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for the next tick to allow any initial scroll to complete
    await new Promise(resolve => setTimeout(resolve, 0));
    
    // Reset mock after initial render
    scrollToMock.mockClear();

    // Re-render with the same pathname
    rerender(
      <MemoryRouter initialEntries={['/same-path']}>
        <Routes>
          <Route path="*" element={<ScrollManager />} />
        </Routes>
      </MemoryRouter>
    );
    
    // Should not call scrollTo
    expect(scrollToMock).not.toHaveBeenCalled();
  });
});