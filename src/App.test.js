import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders Codex Copilot branding', () => {
    render(<App />);
    expect(screen.getAllByText(/Codex Copilot/i).length).toBeGreaterThan(0);
  });
});
