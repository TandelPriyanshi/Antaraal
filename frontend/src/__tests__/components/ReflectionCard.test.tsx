// src/__tests__/components/ReflectionCard.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import ReflectionCard from '../../components/ReflectionCard';

const mockMoodColors = {
  happy: 'bg-green-100 text-green-800',
  sad: 'bg-blue-100 text-blue-800',
  // Add other moods as needed
};

const mockReflection = {
  id: 1,
  title: 'Test Reflection',
  date: '2023-06-15T10:30:00Z',
  preview: 'This is a test reflection preview...',
  mood: 'happy',
  tags: ['test', 'reflection'],
  wordCount: 42
};

describe('ReflectionCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders reflection card with correct information', () => {
  render(
    <ReflectionCard 
      reflection={mockReflection}
      moodColors={mockMoodColors}
    />
  );

    expect(screen.getByText('Test Reflection')).toBeInTheDocument();
    expect(screen.getByText('This is a test reflection preview...')).toBeInTheDocument();
    expect(screen.getByText('2023-06-15T10:30:00Z')).toBeInTheDocument();
    expect(screen.getByText(/#test/)).toBeInTheDocument();
    expect(screen.getByText(/#reflection/)).toBeInTheDocument();
    expect(screen.getByText('42 words')).toBeInTheDocument();
    });

  it('applies correct mood color class', () => {
    render(
      <ReflectionCard 
        reflection={mockReflection}
        moodColors={mockMoodColors}
      />
    );

    const moodBadge = screen.getByText('happy');
    expect(moodBadge).toHaveClass('bg-green-100');
    expect(moodBadge).toHaveClass('text-green-800');
  });

  it('shows action buttons on hover', () => {
    render(
      <ReflectionCard 
        reflection={mockReflection}
        moodColors={mockMoodColors}
      />
    );

    // Get the action buttons container
  const buttonsContainer = screen.getByText('Test Reflection')
    .closest('.group')
    ?.querySelector('.opacity-0'); // Look for the element with opacity-0 class

  expect(buttonsContainer).toBeInTheDocument();
  
  // Get all buttons
  const buttons = screen.getAllByRole('button');
  expect(buttons).toHaveLength(2); // Should have two buttons (edit and delete)

    // Hover over the card
    const card = screen.getByText('Test Reflection').closest('.group');
    fireEvent.mouseOver(card!);

    // Buttons should now be visible
    buttons.forEach(button => {
      expect(button).not.toHaveClass('opacity-0');
    });
  });
});