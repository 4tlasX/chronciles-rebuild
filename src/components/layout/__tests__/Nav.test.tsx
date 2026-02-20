import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Nav } from '../Nav';

describe('Nav', () => {
  it('renders brand text', () => {
    render(<Nav />);
    expect(screen.getByText('Chronicles')).toBeInTheDocument();
  });

  it('renders custom brand text', () => {
    render(<Nav brand="My Blog" />);
    expect(screen.getByText('My Blog')).toBeInTheDocument();
  });

  it('renders brand as link to home', () => {
    render(<Nav />);
    const brandLink = screen.getByText('Chronicles');
    expect(brandLink).toHaveAttribute('href', '/');
  });

  it('renders custom brand href', () => {
    render(<Nav brandHref="/dashboard" />);
    const brandLink = screen.getByText('Chronicles');
    expect(brandLink).toHaveAttribute('href', '/dashboard');
  });

  it('renders default navigation links', () => {
    render(<Nav />);
    expect(screen.getByText('Posts')).toBeInTheDocument();
    expect(screen.getByText('Topics')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('renders custom navigation links', () => {
    render(
      <Nav
        links={[
          { href: '/custom1', label: 'Custom 1' },
          { href: '/custom2', label: 'Custom 2' },
        ]}
      />
    );
    expect(screen.getByText('Custom 1')).toBeInTheDocument();
    expect(screen.getByText('Custom 2')).toBeInTheDocument();
    expect(screen.queryByText('Posts')).not.toBeInTheDocument();
  });

  it('applies nav class', () => {
    const { container } = render(<Nav />);
    expect(container.querySelector('nav')).toHaveClass('nav');
  });

  it('renders links with correct hrefs', () => {
    render(<Nav />);
    expect(screen.getByText('Posts')).toHaveAttribute('href', '/');
    expect(screen.getByText('Topics')).toHaveAttribute('href', '/topics');
    expect(screen.getByText('Settings')).toHaveAttribute('href', '/settings');
  });

  it('renders brand link with correct text', () => {
    render(<Nav />);
    // Note: The className is applied by next/link which is mocked
    const brandLink = screen.getByText('Chronicles');
    expect(brandLink.closest('a')).toHaveAttribute('href', '/');
  });
});
