import { protect } from '../middleware/middleware.js';
import request from 'supertest';
import express from 'express';
// import { expect, jest, test } from '@jest/globals';
import {verifyToken} from '../auth_utils/jwt.js';

jest.mock('../auth_utils/jwt.js', () => ({
    verifyToken: jest.fn(),
  }));

// mock an express app
const createApp = () => {
    const app = express();
    app.use(protect);
    app.get('/protected', (req, res) => {
      res.status(200).json({ message: 'Success', user: req.user });
    });
    return app;
  };

  describe('protect middleware', () => {
    beforeEach(() => {
      jest.clearAllMocks(); // Clear mock data before each test
    });

    test('should return 401 if no token provided', async () =>{
        const app = createApp();
        const response = await request(app).get('/protected');
        expect(response.status).toBe(401);
        expect(response.body).toEqual({ message: 'No token provided' });
    });

    test('should return 401 if invalid token is provided', async () => {
        const app = createApp();
        verifyToken.mockImplementation(() => { throw new Error('Invalid token'); });
        const response = await request(app)
          .get('/protected')
          .set('Authorization', 'Bearer invalidtoken');
        expect(response.status).toBe(401);
        expect(response.body).toEqual({ message: 'Invalid token' });
      });

    test('should call next middleware if valid token is provided', async () => {
        const app = createApp();
        const mockDecoded = { id: 4, username: 'Bob Ross' };
        verifyToken.mockReturnValue(mockDecoded);

        const response = await request(app)
        .get('/protected')
        .set('Authorization', 'Bearer validtoken');
    
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: 'Success', user: mockDecoded });
    });  
  })