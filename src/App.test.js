import { render, screen } from '@testing-library/react';
import App from './App';

beforeAll(() => {
  window.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

test('renders landing page headline', () => {
  render(<App />);
  expect(screen.getByText(/Drop your links/i)).toBeInTheDocument();
});
