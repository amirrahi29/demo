import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Codex Copilot branding', () => {
  render(<App />);
  expect(screen.getAllByText(/Codex Copilot/i).length).toBeGreaterThan(0);
});
