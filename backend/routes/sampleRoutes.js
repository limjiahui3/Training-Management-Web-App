// use this sample for all routes to prevent unauthorised access
//implement on every single router except login
import express from 'express';
import { protect } from '../middleware/authMiddleware'; //add this
const router = express.Router();    

router.use(protect);    //add this

router.get('/protected', (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

export default router;

