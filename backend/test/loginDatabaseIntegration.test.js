import pool from '../models/database.js';
import { generateToken, verifyToken} from '../auth_utils/jwt.js';
import bcrypt from 'bcryptjs';
import {login} from "../models/loginController.js"

describe('Integration test: Login functions', () => {
    let req,res;
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
    });

    beforeEach(() => {
        req = {
          body: {
            username: testUsername,
            password: testPassword,
          },
        };
        res = {
          json: jest.fn(),
          status: jest.fn().mockReturnThis(),
        };
      });

    it('should return valid token if credentials are correct', async () =>{
        await login(req, res);
        expect(res.json).toHaveBeenCalled();
        const resBody = res.json.mock.calls[0][0];
        expect(resBody).toHaveProperty('token');

        //  verify token
        const decodedToken = verifyToken(resBody.token);
        expect(decodedToken).toHaveProperty('id');
        expect(decodedToken).toHaveProperty('username', 'testusername');
    }); 

    it('should return 401 error if incorrect password', async () =>{
        req.body.password = 'wrongPassword';
        await login(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid username or password' });
    })

    it('should return 401 error if incorrect username', async () =>{
        req.body.username = 'clouds';
        await login(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid username or password' });
    })

    it('should return 401 error if missing password', async () =>{
      delete req.body.password;
      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Missing username or password' });
    })

    it('should return 401 error if missing username', async () =>{
      delete req.body.username;
      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Missing username or password' });
    })
})

