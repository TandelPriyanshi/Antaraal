// src/__tests__/components/AlbumCard.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom';
import AlbumCard from '../../components/AlbumCard';

const renderWithRouter = (ui: React.ReactElement) => {
  return {
    ...render(<Router>{ui}</Router>),
  };
};

describe('AlbumCard Component', () => {
  const mockAlbum = {
    id: '1',
    title: 'Test Album',
    photoCount: 10,
    coverUrl: 'test-image.jpg',
    updatedAt: '2023-01-01',
    tags: ['test', 'album'],
    visibility: 'public' as const,
  };

  
    test('renders album card with correct information', () => {
    renderWithRouter(<AlbumCard {...mockAlbum} />);
    
    // Check if the image has the correct alt text and src
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'test-image.jpg');
    expect(img).toHaveAttribute('alt', 'Test Album');
    
    // Check photo count
    expect(screen.getByText('10 photos')).toBeInTheDocument();
    });
  
  test('displays updated date when provided', () => {
    renderWithRouter(<AlbumCard {...mockAlbum} />);
    expect(screen.getByText(/Updated/)).toBeInTheDocument();
  });

  test('displays tags when provided', () => {
    renderWithRouter(<AlbumCard {...mockAlbum} />);
    expect(screen.getByText('test')).toBeInTheDocument();
    expect(screen.getByText('album')).toBeInTheDocument();
  });
});