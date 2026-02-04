import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card } from '../components/ui';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: '600px', margin: '4rem auto', padding: '2rem', textAlign: 'center' }}>
      <Card>
        <div style={{ padding: '3rem' }}>
          <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🔍</div>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Page Not Found</h1>
          <p style={{ color: '#64748b', marginBottom: '2rem' }}>
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Button variant="primary" onClick={() => navigate('/')}>
            Go to Homepage
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default NotFound;