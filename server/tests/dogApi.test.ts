import request from 'supertest'
import {describe, it, expect } from 'vitest'
import app from '../index'


describe('dog API', () => {
  it('should return a random dog image', async () => {
    const response = await request(app).get('/api/dogs/random');
    expect(response.status).toBe(200);

    const body = response.body;

    expect(body.success).toBe(true);
    expect(body.data).toBeDefined();
    expect(body.data).toHaveProperty('imageUrl');
    expect(typeof body.data.imageUrl).toBe('string');
    expect(body.data.imageUrl.length).toBeGreaterThan(0);
    expect(body.data.status).toBe('success');
  });

  it('should return 404 and error message', async () => {
    const response = await request(app).get('/api/dogs/invalid');

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Route not found');
  });
});