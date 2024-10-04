import pool from "./database.js"
import bcrypt from 'bcryptjs';
import { generateToken } from '../auth_utils/jwt.js';

// login controller 
//compares entered password and username with one in database
export const login = async (req, res) => {
    const { username, password } = req.body;
    console.log('Login controller called with:', { username, password });

    if (!username || !password) {
        return res.status(401).json({ message: 'Missing username or password' });
    }

    try {
        const [rows] = await pool.query('SELECT * FROM user_credentials WHERE username = ?', [username]);
        const user = rows[0];
        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                const token = generateToken(user);
                return res.json({token});
            } else {
                return res.status(401).json({ message: 'Invalid username or password' });
            }
        } else {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
};

