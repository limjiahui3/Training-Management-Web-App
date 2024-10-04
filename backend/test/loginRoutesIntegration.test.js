import pool from '../models/database.js';
import { generateToken, verifyToken} from '../auth_utils/jwt.js';
import bcrypt from 'bcryptjs';
import {login} from "../models/loginController.js"
import loginRoutes from "../routes/loginRoutes.js";
import request from 'supertest';
import express from 'express';

const app = express();
app.use(express.json());
app.use('/login', loginRoutes);

describe('Integration Test: login Routes', () => {
    let conn;   
    let testUsername = 'testusername';
    let testPassword = 'testPassword';
    beforeAll(async () => {
    
       console.log(testUsername, testPassword);
        const hashedPassword = await bcrypt.hash(testPassword, 10); //hash first before inserting database
        await pool.query(
            'INSERT INTO user_credentials (username, password) VALUES (?, ?)',
            [testUsername, hashedPassword]
          );
        });
    

    afterAll(async () => {
        
            await pool.query('DELETE FROM user_credentials WHERE username = ?', [testUsername]);
          
        
        await pool.end(); // Close the pool to end all connections
    })

    it('should return valid token if credentials are correct', async () =>{
        const response = await request(app)
            .post('/login')
            .send({ username: testUsername, password: testPassword });
       
        expect(response.status).toBe(200);  
        expect(response.body).toHaveProperty('token');

        const decodedToken = verifyToken(response.body.token);
        expect(decodedToken).toHaveProperty('id');
        expect(decodedToken).toHaveProperty('username', testUsername);
    })

    it('should return 401 if incorrect password', async () => {
        const response = await request(app)
            .post('/login')
            .send({ username: testUsername, password: 'wrongpassword' });

        expect(response.status).toBe(401);
        expect(response.body).toEqual({ message: 'Invalid username or password' });
    });

    it('should return 401 if incorrect username', async () => {
        const response = await request(app)
            .post('/login')
            .send({ username: 'dummyuser', password: testPassword });

        expect(response.status).toBe(401);
        expect(response.body).toEqual({ message: 'Invalid username or password' });
    });

    it('should return 401 for missing username', async () => {
        const response = await request(app)
            .post('/login')
            .send({ password: testPassword });

        expect(response.status).toBe(401);
        expect(response.body).toEqual({ message: 'Missing username or password' });
    });

    it('should return 401 for missing password', async () => {
        const response = await request(app)
            .post('/login')
            .send({ username: testUsername });

        expect(response.status).toBe(401);
        expect(response.body).toEqual({ message: 'Missing username or password' });
    });

    it('should log access to login route', async () => {
        const consoleSpy = jest.spyOn(console, 'log');
        await request(app).post('/login').send({ username: testUsername, password: testPassword });
        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('LoginRoute accessed: /login'));
        consoleSpy.mockRestore();
    });
})