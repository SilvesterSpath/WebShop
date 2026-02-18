import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Product from './Product';

const renderWithRouter = (ui) =>
  render(<Router>{ui}</Router>);

describe('Product', () => {
  const product = {
    _id: '1',
    name: 'Test Product',
    price: 29.99,
    image: '/images/test.jpg',
    rating: 4.5,
    numReviews: 10,
  };

  it('renders product name', () => {
    renderWithRouter(<Product product={product} />);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });

  it('renders product price', () => {
    renderWithRouter(<Product product={product} />);
    expect(screen.getByText('$29.99')).toBeInTheDocument();
  });

  it('renders link to product detail', () => {
    renderWithRouter(<Product product={product} />);
    const links = screen.getAllByRole('link', { name: /test product/i });
    expect(links.length).toBeGreaterThan(0);
    expect(links[0]).toHaveAttribute('href', '/product/1');
  });

  it('renders review count', () => {
    renderWithRouter(<Product product={product} />);
    expect(screen.getByText('10 reviews')).toBeInTheDocument();
  });
});
