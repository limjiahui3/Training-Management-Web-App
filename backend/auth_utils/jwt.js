import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
//generate and verify tokens 
dotenv.config({ path: './.env' }); // Load environment variables

const secret = process.env.JWT_SECRET;
// console.log('JWT_SECRET:', secret); // Log the secret to verify for debug

const USERNAME_REGEX = /^[a-zA-Z][a-zA-Z0-9_]*$/;

if (!secret) {
    throw new Error('JWT secret is not defined');
}

export const generateToken = (user, expiresIn = '1h') => {
    if (!user || typeof user !== 'object') {    // user must be an object 
        throw new Error('Invalid user data');
    }

    if (!Number.isInteger(user.id) || user.id < 1) {   // id must be integer
        throw new Error('Invalid user data');
    }

    if (typeof user.username !== 'string' || !USERNAME_REGEX.test(user.username)) {     // username must be valid
        throw new Error('Invalid user data');
    }

    return jwt.sign({ id: user.id, username: user.username }, secret, { expiresIn });
    // console.log('Generated token:', token);
};

export const verifyToken = (token) => {
    try {
        return jwt.verify(token, secret);
    }catch(error){
        throw error;
    }
};