import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh', background: '#f0f7f4',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            background: 'white', padding: '48px', borderRadius: '16px',
            textAlign: 'center', maxWidth: '400px', boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>⚠️</div>
            <h2 style={{ color: '#2d6a4f', marginBottom: '12px' }}>Something went wrong</h2>
            <p style={{ color: '#666', marginBottom: '24px' }}>
              An unexpected error occurred. Please refresh the page and try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: '#2d6a4f', color: 'white', border: 'none',
                padding: '12px 28px', borderRadius: '8px', cursor: 'pointer',
                fontSize: '15px', fontWeight: '500'
              }}
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;