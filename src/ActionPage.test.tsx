import React from 'react';
import { render, screen } from '@testing-library/react';
import ActionPage from './ActionPage';

test('renders text with extension name', () => {
  render(<ActionPage />);
  const cleaverApplyText = screen.getByText(/Clever Apply/i);
  expect(cleaverApplyText).toBeInTheDocument();
});
