import React from 'react';
import { render, screen } from '@testing-library/react';
import Rating from './Rating';

describe('Rating', () => {
  it('renders custom text', () => {
    render(<Rating value={4} text="12 reviews" />);
    expect(screen.getByText('12 reviews')).toBeInTheDocument();
  });

  it('renders empty text when not provided', () => {
    const { container } = render(<Rating value={3} />);
    expect(container.querySelector('.rating')).toBeInTheDocument();
  });

  it('renders five star icons', () => {
    const { container } = render(<Rating value={2.5} text="reviews" />);
    const stars = container.querySelectorAll('.fa-star, .fa-star-half-alt, .far.fa-star');
    expect(stars.length).toBe(5);
  });
});
