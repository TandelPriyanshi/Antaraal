import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import Footer from '../../components/Footer';

// Extend expect with jest-dom matchers
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveAttribute(attr: string, value?: string): R;
    }
  }
}

describe('Footer Component', () => {
  // Render the Footer component with Router for Link components
  const renderFooter = () => {
    return render(
      <Router>
        <Footer />
      </Router>
    );
  };

  test('renders the footer with the correct brand name', () => {
    const { getAllByText } = renderFooter();
    const brandElements = getAllByText(/Antaraal Life Scribe/i);
    expect(brandElements.length).toBeGreaterThan(0);
    // Check that at least one of them is in the header
    const headerBrand = brandElements.find(el => 
      el.closest('header') || 
      el.closest('div[class*="flex items-center"]')
    );
    expect(headerBrand).toBeInTheDocument();
  });

  test('displays contact information', () => {
    const { getByText } = renderFooter();
    
    // Check email
    const emailElement = getByText(/support@antaraal.com/i);
    expect(emailElement).toBeInTheDocument();
    
    // Check phone
    const phoneElement = getByText(/\(555\) JOURNAL/i);
    expect(phoneElement).toBeInTheDocument();
    
    // Check address
    const addressElement = getByText(/San Francisco, CA/i);
    expect(addressElement).toBeInTheDocument();
  });

  test('displays contact information correctly', () => {
    const { getByText } = renderFooter();
    
    // Check contact info
    const emailElement = getByText(/support@antaraal.com/i);
    const phoneElement = getByText(/\(555\) JOURNAL/i);
    const addressElement = getByText(/San Francisco, CA/i);
    
    expect(emailElement).toBeInTheDocument();
    expect(phoneElement).toBeInTheDocument();
    expect(addressElement).toBeInTheDocument();
  });

  test('displays copyright information', () => {
    const { container } = renderFooter();
    
    // Find the footer element first
    const footer = container.querySelector('footer');
    expect(footer).toBeInTheDocument();
    
    // Find the copyright text within the footer
    const copyrightElement = Array.from(footer.querySelectorAll('p'))
      .find(p => p.textContent?.includes('©'));
    
    expect(copyrightElement).toBeInTheDocument();
    expect(copyrightElement).toHaveTextContent('Antaraal Life Scribe');
  });
});
