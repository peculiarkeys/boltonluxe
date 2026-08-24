import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test, vi } from 'vitest';
import { Button } from './button';

test('renders button with correct text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
});

test('calls onClick handler when clicked', async () => {
  const handleClick = vi.fn();
  const user = userEvent.setup();
  
  render(<Button onClick={handleClick}>Click me</Button>);
  
  await user.click(screen.getByRole('button', { name: /click me/i }));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
