// Using standard React elements instead of Chakra UI to avoid TypeScript issues
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import apiClient from '../../api/client';
import { useApiError } from '../../hooks/useApiError';

/**
 * A test component to verify React Query is working properly
 * This component fetches data from the server health endpoint
 */
function QueryTest() {
  const [isEnabled, setIsEnabled] = useState(false);
  
  // Example query to test React Query configuration
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['healthCheck'],
    queryFn: async () => {
      // Simple health check endpoint that should return { status: 'ok' }
      const { data } = await apiClient.get('/health');
      return data;
    },
    enabled: isEnabled, // Only run the query when the button is clicked
    retry: 1,
  });
  
  // Handle and display any API errors
  useApiError(error, isError);
  
  return (
    <div style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem', maxWidth: '500px', margin: '0 auto' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>React Query Test</h3>
        
        <p>
          This component tests the React Query configuration by fetching data 
          from the server's health endpoint.
        </p>
        
        <button
          style={{
            backgroundColor: isLoading ? '#90cdf4' : '#3182ce',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '0.25rem',
            border: 'none',
            cursor: 'pointer'
          }}
          disabled={isLoading}
          onClick={() => {
            if (!isEnabled) {
              setIsEnabled(true);
            } else {
              refetch();
            }
          }}
        >
          {isLoading ? 'Loading...' : isEnabled ? 'Refetch Data' : 'Fetch Data'}
        </button>
        
        {data && (
          <div style={{ padding: '0.75rem', backgroundColor: '#f7fafc', borderRadius: '0.375rem' }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              Response:
            </h4>
            <pre style={{ fontSize: '0.875rem', whiteSpace: 'pre-wrap' }}>
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}
        
        {isError && (
          <div style={{ padding: '0.75rem', backgroundColor: '#fed7d7', color: '#822727', borderRadius: '0.375rem' }}>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              Error:
            </h4>
            <p>
              {error instanceof Error 
                ? error.message 
                : 'An unexpected error occurred'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default QueryTest;
