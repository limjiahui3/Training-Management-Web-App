import { verifyToken } from '../auth_utils/jwt.js';
//middleware verifies token for authentication
export const protect = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    //return 401 if no token
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    try{
        //verify token and get decode payload
        const decoded = verifyToken(token);
        req.user = decoded
        
        //pass to next middleware 
        next();
    }
    catch(err){
        //return 401 if invalid token
        return res.status(401).json({ message: 'Invalid token' });
    }
}