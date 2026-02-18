import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from './store';
import App from './App';

jest.mock('react-router-bootstrap', () => ({
  LinkContainer: ({ children, to }) => <span data-testid="link" data-to={to}>{children}</span>,
}));

const renderApp = () =>
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );

describe('App', () => {
  it('renders without crashing', () => {
    renderApp();
  });

  it('renders header brand', () => {
    renderApp();
    expect(screen.getByText('WebShop')).toBeInTheDocument();
  });

  it('shows home content', () => {
    renderApp();
    expect(screen.getByText('Latest Products')).toBeInTheDocument();
  });
});
