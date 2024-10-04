import express from "express";
import { getAllTrainingSessions, getTrainingSession, createTrainingSession, deleteTrainingSession, updateTrainingSession, markAttendance, getEmployeesbySessionId } from "../models/trainingSessionModel.js";
import { protect } from '../middleware/middleware.js'; //add this
const router = express.Router();    

router.use(protect);    //add this

router.get("/", async (req, res) => {
    const trainingSessionsDict = await getAllTrainingSessions();
    return res.status(200).send(trainingSessionsDict);
})

router.get("/:session_id", async (req, res) => {
    // const trainingSession = await getTrainingSession(req.params.session_id);
    // return res.status(200).send(trainingSession);
    try {
      const session = await getTrainingSession(req.params.session_id);
  
      if (!session) {
        // If session not found, send a 404 response
        return res.status(404).json({ error: 'Session ID not found' });
      }
  
      res.json(session);
    } catch (error) {
      // Handle unexpected errors
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
})

router.post("/", async(req, res) => {
    try {
        console.log(req.body)
        const { employee_ids, training_id, status, start_date, end_date } = req.body;
        if (!employee_ids || !training_id || !status || !start_date || !end_date) {
          return res.status(400).send({
            message: "Send required fields: employee_ids, training_id, status, start_date, end_date",
          });
        }

        const trainingSession = await createTrainingSession(
          employee_ids,
          training_id,
          status,
          start_date,
          end_date
        );
        // return res.status(201).send({ message: "Training session created successfully" });
        return res.status(201).json(trainingSession);
      } catch (error) {
        console.error(error.message);
        return res.status(500).send({ message: error.message });
    }
})

router.put("/:session_id", async (req, res) => {
    try {
      console.log(req.body)
      const { employee_ids, training_id, status, start_date, end_date } = req.body;
      const session_id = req.params.session_id;
      if (!session_id || !employee_ids || !training_id || !status || !start_date || !end_date) {
        return res.status(400).send({
          message: "Send required fields: session_id, employee_ids, training_id, status, start_date, end_date",
        });
      }

      const trainingSession = await updateTrainingSession(
        session_id,
        employee_ids,
        training_id,
        status,
        start_date,
        end_date
      );
      // return res.status(201).send({ message: "Training session created successfully" });
      return res.status(201).json(trainingSession);
    } catch (error) {
      console.error(error.message);
      return res.status(500).send({ message: error.message });
  }
})

router.delete("/:session_id", async (req, res) => {
    try {
        const session_id = req.params.session_id;
        if (!session_id) {
          return res.status(400).send({ message: "Send session_id in the params" });
        }
    
        const deletedTrainingSession = await deleteTrainingSession(session_id);
        return res.status(200).json(deletedTrainingSession);
      } catch (error) {
        console.error(error.message);
        return res.status(500).send({ message: error.message });
      }
})

// To mark attendance for a training session
router.post("/attendance", async(req, res) => {
    try {
        console.log(req.body)
        const { session_id, employee_ids } = req.body;
        if (!session_id || !employee_ids) {
          return res.status(400).send({
            message: "Send required fields: session_id, employee_ids",
          });
        }
        const trainingSession = await markAttendance(
          session_id,
          employee_ids
        );
        return res.status(201).json(trainingSession);
      } catch (error) {
        console.error(error.message);
        return res.status(500).send({ message: error.message });
    }
})

// to get all the employees for a training session
router.get("/employees/:session_id", async (req, res) => {
    try {
        const employees = await getEmployeesbySessionId(req.params.session_id);
        if (!employees) {
          return res.status(404).send({ message: "No employees found for this session" });
        }
        return res.status(200).json(employees);
      } catch (error) {
        console.error(error.message);
        return res.status(500).send({ message: error.message });
    }
})

export default router;