// jest.setup.js
import '@testing-library/jest-dom';
// Optional but recommended: Polyfill fetch if your code uses it

// Mock Next.js navigation hooks (adjust if needed)
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({}),
}));

// Example: Mock Next.js link behavior if needed
jest.mock('next/link', () => {
  return ({ children }: { children: React.ReactNode }) => {
    return children;
  };
});

// Optional: Reset mocks before each test if you prefer
beforeEach(() => {
  jest.clearAllMocks();
});
