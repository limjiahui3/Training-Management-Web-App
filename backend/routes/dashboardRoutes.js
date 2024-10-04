import express from "express";
import { getEmployeeDetails, getRelevantCourses, getTrainingDates, getCombinedEmployeeTrainingDetails, getPercentageValidEmployees, getTrainingStats} from "../models/dashboardModel.js";
import { protect } from '../middleware/middleware.js'; //add this
const router = express.Router();    

router.use(protect); //add this

export const getDashboardData = async (req, res) => {
  const combinedEmployeeTrainingDetails = await getCombinedEmployeeTrainingDetails();
  if (!Array.isArray(combinedEmployeeTrainingDetails) || combinedEmployeeTrainingDetails.length === 0) {
    return res.status(500).send({ message: 'No combined employee training details found' });
  }
  return res.status(200).send(combinedEmployeeTrainingDetails);
};

router.get('/', getDashboardData);

export const getPercentage = async (req, res) => {
  const percentageValidEmployees = await getPercentageValidEmployees();
  if (percentageValidEmployees === null) {
    return res.status(500).send({ message: 'Error calculating percentage of valid employees' });
  }
  return res.status(200).send({
    percentageValidEmployees: percentageValidEmployees
  });
}

router.get("/percentage", getPercentage);

export const getNumbers = async (req, res) => {
  const trainingStatsJson = await getTrainingStats();
  if (typeof trainingStatsJson !== 'object' || trainingStatsJson === null) {
    return res.status(500).send({ message: 'No training stats found' });
  }
  res.status(200).json(trainingStatsJson);
}

router.get("/numbers", getNumbers);

router.get("/employeeDetails", async (req, res) => {
  try {
    const details = await getEmployeeDetails();
    return res.status(200).json(details);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send({ message: error.message });
  }
});

router.get("/relevantTrainings", async (req, res) => {
  try {
    const details = await getRelevantCourses();
    return res.status(200).json(details);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send({ message: error.message });
  }
})

router.get("/trainingDates", async (req, res) => {
  try {
    const details = await getTrainingDates();
    return res.status(200).json(details);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send({ message: error.message });
  }
})

export default router;