import { generateToken, verifyToken } from '../auth_utils/jwt.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import fc from 'fast-check';

dotenv.config({path:'./.env'})  //get secret

const user = { id: 1, username: 'testuser' };
const secret = process.env.JWT_SECRET;
console.log('JWT_SECRET:', process.env.JWT_SECRET);
const valid_string = /^[a-zA-Z][a-zA-Z0-9_]*$/;   // valid string
const digits = /^\d/;

afterEach(() => {
    if (console.error.mockRestore) {
        console.error.mockRestore();
    };
  });

describe('generateToken', () => {
    it('should generate a token', () => {
        const token = generateToken(user);
        expect(token).toBeDefined();
        expect(typeof token).toBe('string');
    });

    it('should have correct payload', () =>{
        const token = generateToken(user);
        const decoded = jwt.decode(token);
        expect(decoded).toMatchObject({ id: user.id, username: user.username });
    });

    
    // token expiry test
    it('should expire after 1 hour', async () => {  // boundary testing with fast-check
        jest.useFakeTimers();
        try {
          const expiresInHours = 1;
          const expiresInSeconds = expiresInHours * 3600; // 1 hour in seconds
          
          
              const token = jwt.sign(
                { id: user.id, username: user.username }, 
                secret, 
                { expiresIn: '1h' }
              );
              
              // Check just before expiration (at 59 minutes 59 seconds)
              jest.advanceTimersByTime((expiresInSeconds - 1) * 1000);
              expect(() => verifyToken(token)).not.toThrow();
              
              // Check right at expiration (at 60 minutes)
              jest.advanceTimersByTime(1000);
              expect(() => verifyToken(token)).toThrow("jwt expired");
              
              // Check just after expiration (at 60 minutes and 1 second)
              jest.advanceTimersByTime(1000);
              expect(() => verifyToken(token)).toThrow("jwt expired");
            
          
        } finally {
          jest.useRealTimers();
        }
      });

    // valid regions
    it('should accept valid input', () => {     //boundary testing with fast-check
        fc.assert(
            fc.property(fc.integer({min: 1}), fc.string({minLength: 1}).filter(str => valid_string.test(str)), (id, username) => {
                const user = {id, username};
                const token = generateToken(user);
                const decoded = verifyToken(token);

                    expect(decoded).not.toBeNull();
                    expect(typeof decoded).toBe('object');
                    expect(decoded.id).toBe(user.id);
                    expect(decoded.username).toBe(user.username);
            })
        )
    })

    // invalid region
    it('should throw error if invalid input id', () => {   //boundary testing with fast-check
        fc.assert(
            fc.property(
                fc.oneof(fc.integer({max:0}), fc.constant(null), fc.constant(undefined)),
                fc.oneof(fc.string({minLength:1}).filter(str => valid_string.test(str))), 
                (id, username) => {
                const user = {id, username};
                expect(() => generateToken(user)).toThrow('Invalid user data');
                
            })
        )
    })       
    
    // invalid region
    it('should throw error if invalid input username', () => {   //boundary testing with fast-check
        fc.assert(
            fc.property(
                fc.oneof(fc.integer({min:1})),
                fc.oneof(
                    fc.string().filter(str => !valid_string.test(str)),
                    fc.constant(null),
                    fc.constant(undefined)), 
                (id, username) => {
                const user = {id, username};
                expect(() => generateToken(user)).toThrow('Invalid user data');
                
            })
        )
    })
})

describe('verifyToken', () => {
    it('should verify a valid token', () => {
        const user = { id: 1, username: 'admin' };
        const token = generateToken(user);
        const decoded = verifyToken(token);
        expect(decoded).toMatchObject({ id: user.id, username: user.username });
    });

    it('should fail to verify invalid token', () => {
        
        const user = { id: 3, username: 'hod' };
        const token = generateToken(user);
        const invalidToken = token.slice(0, -1) + 'x';

        // Verify the tampered token should throw an error
        expect(() => verifyToken(invalidToken)).toThrow();
        })

    });


