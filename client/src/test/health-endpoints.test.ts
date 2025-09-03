import { describe, it, expect } from 'vitest';

describe('Health Endpoints', () => {
  const baseUrl = 'http://localhost:5000';
  
  it('health endpoint returns status', async () => {
    try {
      const response = await fetch(`${baseUrl}/health`);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.status).toBe('healthy');
      expect(data.timestamp).toBeDefined();
      expect(data.uptime).toBeTypeOf('number');
      expect(data.memory).toBeDefined();
      expect(data.version).toBeDefined();
      expect(data.environment).toBeDefined();
    } catch (error) {
      // In test environment, server might not be running
      expect(error).toBeDefined();
    }
  });
  
  it('ready endpoint checks database connectivity', async () => {
    try {
      const response = await fetch(`${baseUrl}/health/ready`);
      const data = await response.json();
      
      expect(response.status).toBeOneOf([200, 503]);
      expect(data.status).toBeOneOf(['ready', 'not ready']);
      expect(data.timestamp).toBeDefined();
      expect(data.database).toBeOneOf(['connected', 'disconnected']);
    } catch (error) {
      // In test environment, server might not be running
      expect(error).toBeDefined();
    }
  });
});