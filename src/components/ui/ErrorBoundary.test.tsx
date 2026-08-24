import { render, screen, act } from '@testing-library/react';
import { expect, test, vi, beforeEach, afterEach } from 'vitest';
import { ErrorBoundary } from './ErrorBoundary';
import React from 'react';

const ThrowError = () => {
  throw new Error('Test error');
};

test('renders children when there is no error', () => {
  render(
    <ErrorBoundary>
      <div>Safe content</div>
    </ErrorBoundary>
  );
  
  expect(screen.getByText('Safe content')).toBeInTheDocument();
});

test('renders error fallback when a child throws', () => {
  // Prevent React from logging the error to the console during the test
  const originalError = console.error;
  console.error = vi.fn();

  render(
    <ErrorBoundary>
      <ThrowError />
    </ErrorBoundary>
  );
  
  expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  expect(screen.getByText('Test error')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /reload page/i })).toBeInTheDocument();

  console.error = originalError;
});
