// src/__tests__/components/PromptCard.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import PromptCard from '../../components/PromptCard';

const mockPrompt = {
  id: 1,
  title: 'Test Prompt',
  question: 'What are you grateful for today?',
  category: 'Gratitude',
  difficulty: 'Easy',
  estimatedTime: '5 min',
  tags: ['gratitude', 'daily', 'reflection']
};

const getDifficultyColor = vi.fn((difficulty: string) => {
  const colors: Record<string, string> = {
    'Easy': 'bg-green-100 text-green-800',
    'Medium': 'bg-yellow-100 text-yellow-800',
    'Hard': 'bg-red-100 text-red-800'
  };
  return colors[difficulty] || 'bg-gray-100 text-gray-800';
});

describe('PromptCard', () => {
  const onStartWriting = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders prompt card with correct information', () => {
    render(
      <PromptCard 
        prompt={mockPrompt} 
        getDifficultyColor={getDifficultyColor}
      />
    );

    // Check if the title is rendered
    expect(screen.getByText('Test Prompt')).toBeInTheDocument();
    
    // Check if the question is rendered
    expect(screen.getByText('What are you grateful for today?')).toBeInTheDocument();
    
    // Check if the category is rendered
    expect(screen.getByText('Gratitude')).toBeInTheDocument();
    
    // Check if the difficulty is rendered
    expect(screen.getByText('Easy')).toBeInTheDocument();
    
    // Check if the estimated time is rendered
    expect(screen.getByText('5 min')).toBeInTheDocument();
    
    // Check if tags are rendered
    expect(screen.getByText('#gratitude')).toBeInTheDocument();
    expect(screen.getByText('#daily')).toBeInTheDocument();
    expect(screen.getByText('#reflection')).toBeInTheDocument();
  });

  it('calls onStartWriting when start writing button is clicked', () => {
    render(
      <PromptCard 
        prompt={mockPrompt} 
        getDifficultyColor={getDifficultyColor}
        onStartWriting={onStartWriting}
      />
    );

    // Hover to make the button visible
    const card = screen.getByText('Test Prompt').closest('.group');
    fireEvent.mouseOver(card!);

    const button = screen.getByText('Start Writing');
    fireEvent.click(button);
    
    expect(onStartWriting).toHaveBeenCalledWith(1);
  });

  it('applies correct difficulty color class', () => {
    render(
      <PromptCard 
        prompt={mockPrompt} 
        getDifficultyColor={getDifficultyColor}
      />
    );

    // Check if getDifficultyColor was called with the correct difficulty
    expect(getDifficultyColor).toHaveBeenCalledWith('Easy');
    
    // Check if the correct class is applied to the difficulty badge
    const difficultyBadge = screen.getByText('Easy');
    expect(difficultyBadge).toHaveClass('bg-green-100');
    expect(difficultyBadge).toHaveClass('text-green-800');
  });

  it('limits displayed tags to 3', () => {
    const promptWithManyTags = {
      ...mockPrompt,
      tags: ['one', 'two', 'three', 'four', 'five', 'six']
    };

    render(
      <PromptCard 
        prompt={promptWithManyTags} 
        getDifficultyColor={getDifficultyColor}
      />
    );

    // Should show only first 3 tags
    expect(screen.getByText('#one')).toBeInTheDocument();
    expect(screen.getByText('#two')).toBeInTheDocument();
    expect(screen.getByText('#three')).toBeInTheDocument();
    
    // Should not show tags beyond the first 3
    expect(screen.queryByText('#four')).not.toBeInTheDocument();
    expect(screen.queryByText('#five')).not.toBeInTheDocument();
    expect(screen.queryByText('#six')).not.toBeInTheDocument();
  });
});