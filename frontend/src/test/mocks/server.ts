// Update this import
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw'; 

// Mock API responses
export const handlers = [
  http.post('/api/auth/register', async () => {
    return HttpResponse.json({
      success: true,
      data: {
        user: {
          id: 1,
          email: 'test@example.com',
          username: 'testuser',
          isEmailVerified: false,
        },
        token: 'test-token',
      },
    });
  }),
  // Add more handlers as needed
];

export const server = setupServer(...handlers);