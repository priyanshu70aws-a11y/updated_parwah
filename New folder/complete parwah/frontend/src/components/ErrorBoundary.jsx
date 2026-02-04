import React from 'react';
import { Card, Button } from './ui';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ maxWidth: '600px', margin: '4rem auto', padding: '2rem', textAlign: 'center' }}>
          <Card>
            <div style={{ padding: '3rem' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⚠️</div>
              <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Something went wrong</h1>
              <p style={{ color: '#64748b', marginBottom: '2rem' }}>
                We're sorry, but something unexpected happened. Please try refreshing the page.
              </p>
              <Button variant="primary" onClick={() => window.location.reload()}>
                Refresh Page
              </Button>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;