import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import DEF from './DEF';

describe('DEF dashboard', () => {
  it('renders Command Center Cockpit', () => {
    render(<DEF />);
    expect(screen.getAllByText(/Command Center Cockpit/i).length).toBeGreaterThan(0);
  });
});
