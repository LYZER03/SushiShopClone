// Simple error handling hook for API responses
import { useEffect } from 'react';

// Used for typing API error responses
interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

export function useApiError(error: unknown, isError: boolean): void {
  // We're using a simple alert for error messages instead of Chakra UI toast

  useEffect(() => {
    if (!isError || !error) return;

    let errorMessage = 'An unexpected error occurred';
    let errorDetails: string[] = [];

    // Handle axios error response
    if (error && typeof error === 'object' && 'response' in error) {
      const response = error.response as { data?: { message?: string; errors?: Record<string, string[]> }; status?: number };
      
      if (response?.data?.message) {
        errorMessage = response.data.message;
      }

      if (response?.data?.errors) {
        errorDetails = Object.values(response.data.errors).flat();
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    // Show error alert
    console.error('API Error:', errorMessage);
    
    // Don't show alerts during development to avoid interrupting workflow
    if (import.meta.env.PROD) {
      alert(`Error: ${errorMessage}`);
    }

    // For validation errors, show additional details
    if (errorDetails.length > 0) {
      console.error('Validation errors:', errorDetails);
      
      // Don't show alerts during development to avoid interrupting workflow
      if (import.meta.env.PROD && errorDetails.length > 0) {
        alert(`Validation errors: ${errorDetails.join('\n')}`);
      }
    }
  }, [error, isError]);
}
