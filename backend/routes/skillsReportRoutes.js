import express from 'express';
import { 
    getSkillsReport, 
    getFilteredSkillsReport 
} from '../models/skillsReportModel.js';

import { protect } from '../middleware/middleware.js'; //add this
const router = express.Router();    

router.use(protect);    //add this

// GET all skills report
router.get("/", async (req, res) => {
  try {
    const skillsReport = await getSkillsReport();
    res.json(skillsReport);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
});

// GET filtered skills report
router.get('/filter', async (req, res) => {
  try {
    const { job, training, validity } = req.query;
    const filteredSkillsReport = await getFilteredSkillsReport({ job, training, validity });
    res.json(filteredSkillsReport);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message});
  }
});

export default router;