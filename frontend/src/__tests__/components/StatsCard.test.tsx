// src/__tests__/components/StatsCard.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import { BarChart } from 'lucide-react';
import StatsCard from '../../components/StatsCard';

describe('StatsCard', () => {
  const mockStats = {
    icon: <BarChart size={20} />,
    label: 'Test Label',
    value: '42',
  };

  it('renders stats card with correct information', () => {
    render(<StatsCard {...mockStats} />);

    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByTestId('stats-icon')).toBeInTheDocument();
  });

  it('applies custom className when provided', () => {
    render(<StatsCard {...mockStats} className="custom-class" />);
    
    const card = screen.getByText('Test Label').closest('.custom-class');
    expect(card).toBeInTheDocument();
  });
});