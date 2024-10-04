import pool from "../models/database.js"
import bcrypt from 'bcryptjs';
import { generateToken } from '../auth_utils/jwt.js';
import request from 'supertest'
import fc from 'fast-check';
import {login} from "../models/loginController.js"

jest.mock('../models/database.js', () => ({
    query: jest.fn()
}));

jest.mock('bcryptjs', () => ({
    compare: jest.fn()
}));

jest.mock('../auth_utils/jwt.js', () => ({
    generateToken: jest.fn()
}));

describe('login controller', () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
        req = { body: { username: 'testuser', password: 'testpassword' } };
        res = {
            json: jest.fn().mockReturnValue(res),
            status: jest.fn().mockReturnThis()
        };
        next = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should return token for correct username and password', async () => {
        pool.query.mockResolvedValueOnce([[{ username: 'testuser', password: 'hashedpassword' }]]);
        bcrypt.compare.mockResolvedValueOnce(true);
        generateToken.mockReturnValueOnce('testtoken');

        await login(req, res, next);

        expect(pool.query).toHaveBeenCalledWith('SELECT * FROM user_credentials WHERE username = ?', ['testuser']);
        expect(bcrypt.compare).toHaveBeenCalledWith('testpassword', 'hashedpassword');
        expect(generateToken).toHaveBeenCalledWith({ username: 'testuser', password: 'hashedpassword' });
        expect(res.json).toHaveBeenCalledWith({ token: 'testtoken' });
    });

    test('should return 401 for invalid username', async () => {
        pool.query.mockResolvedValueOnce([[]]);

        await login(req, res, next);

        expect(pool.query).toHaveBeenCalledWith('SELECT * FROM user_credentials WHERE username = ?', ['testuser']);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid username or password' });
    });

    test('should return 401 for invalid password', async () => {
        pool.query.mockResolvedValueOnce([[{ username: 'testuser', password: 'hashedpassword' }]]);
        bcrypt.compare.mockResolvedValueOnce(false);

        await login(req, res, next);

        expect(pool.query).toHaveBeenCalledWith('SELECT * FROM user_credentials WHERE username = ?', ['testuser']);
        expect(bcrypt.compare).toHaveBeenCalledWith('testpassword', 'hashedpassword');
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid username or password' });
    });

    test('should return 500 for server error', async () => {
        pool.query.mockRejectedValueOnce(new Error('Database error'));

        await login(req, res, next);

        expect(pool.query).toHaveBeenCalledWith('SELECT * FROM user_credentials WHERE username = ?', ['testuser']);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Server error' });
    });

    test('bcrypt.compare should be called with correct arguments', async () => {
        pool.query.mockResolvedValueOnce([[{ username: 'testuser', password: 'hashedpassword' }]]);
        bcrypt.compare.mockResolvedValueOnce(true);

        await login(req, res, next);

        expect(bcrypt.compare).toHaveBeenCalledWith('testpassword', 'hashedpassword');
    });

    // Additional test cases
    test('should handle missing username or password in request body', async () => {
        req.body = {};

        await login(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Missing username or password' });
    });

    test('should return 500 if generateToken throws an error', async () => {
        pool.query.mockResolvedValueOnce([[{ username: 'testuser', password: 'hashedpassword' }]]);
        bcrypt.compare.mockResolvedValueOnce(true);
        generateToken.mockImplementationOnce(() => { throw new Error('Token error'); });

        await login(req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Server error' });
    });
});

    
