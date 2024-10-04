import express from "express";
import {
  getRelevantTrainings,
  getRelevantTrainingsById,
  getRelevantTrainingsByTrainingId,
  getRelevantTrainingsByEmployeeId,
  getRelevantTrainingsByEmployeeTrainingId,
  createRelevantTraining,
  deleteRelevantTraining,
  updateRelevantTraining,
} from "../models/relevantTrainingsModel.js";

const router = express.Router();

// Route for Get All Relevant Trainings from database
router.get("/", async (req, res) => {
  try {
    console.log("Fetching all relevant trainings...");
    const trainings = await getRelevantTrainings();
    return res.status(200).json(trainings);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send({ message: error.message });
  }
});

// Route for Get a specific employee training by ID
router.get("/:id", async (req, res) => {
    try {
      console.log(`Fetching relevant training by ID: ${req.params.id}`);
      const relevantTrainings = await getRelevantTrainingsById(req.params.id);
      if (relevantTrainings) {
        return res.status(200).json(relevantTrainings);
      } else {
        return res.status(404).send({ message: "Relevant training not found" });
      }
    } catch (error) {
      console.error(error.message);
      return res.status(500).send({ message: error.message });
    }
  });

// Route for Get Relevant Trainings by Employee ID
router.get("/employee/:employee_id", async (req, res) => {
  try {
    const trainings = await getRelevantTrainingsByEmployeeId(req.params.employee_id);
    if (trainings.length > 0) {
      return res.status(200).json(trainings);
    } else {
      return res.status(404).send({ message: "Relevant trainings not found" });
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).send({ message: error.message });
  }
});

// Route for Get Relevant Trainings by Training ID
router.get("/training/:training_id", async (req, res) => {
    try {
      const trainings = await getRelevantTrainingsByTrainingId(req.params.training_id);
      if (trainings.length > 0) {
        return res.status(200).json(trainings);
      } else {
        return res.status(404).send({ message: "Relevant trainings not found" });
      }
    } catch (error) {
      console.error(error.message);
      return res.status(500).send({ message: error.message });
    }
  });

// Route for Get relevant training by employee and training by ID
router.get("/:employee_id/:training_id", async (req, res) => {
  try {
    console.log(`Fetching relevant training by employee ID: ${req.params.employee_id} and training ID: ${req.params.training_id}`);
    const { employee_id, training_id } = req.params;
    const relevantTraining = await getRelevantTrainingsByEmployeeTrainingId(employee_id, training_id); // Adjust this function to take both parameters
    if (relevantTraining) {
      return res.status(200).json(relevantTraining);
    } else {
      return res.status(404).send({ message: "Relevant training not found" });
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).send({ message: error.message });
  }
});


// Route for adding a new Relevant Training
router.post("/", async (req, res) => {
  try {
    const { employee_id, training_id, validity } = req.body;
    if (!employee_id || !training_id || !validity) {
      return res.status(400).send({
        message: "Send all required fields: employee_id, training_id, validity",
      });
    }
    const newTraining = await createRelevantTraining(employee_id, training_id, validity);
    return res.status(201).json(newTraining);
  } catch (error) {
    console.error(error.message);
    if (error.message.includes("already exists")) {
      return res.status(409).send({ message: error.message });
    }
    return res.status(500).send({ message: error.message });
  }
});

// Route for Deleting a Relevant Training
router.delete("/:employeeId/:trainingId", async (req, res) => {
  try {
    // Correctly extract employeeId and trainingId from req.params
    const { employeeId, trainingId } = req.params;
    console.log(`Delete relevant training by employee ID: ${employeeId} and training ID: ${trainingId}`);

    // Call the function to delete the relevant training
    const message = await deleteRelevantTraining(employeeId, trainingId);

    // Respond with a success message
    return res.status(200).send({ message });
  } catch (error) {
    // Log and respond with an error message in case of failure
    console.error(error.message);
    return res.status(500).send({ message: error.message });
  }
});

// Route for Updating a Relevant Training
router.put("/:employeeId/:trainingId/", async (req, res) => {
  try {
    const { employeeId, trainingId } = req.params;
    const { training_id: currentTrainingId } = req.body;

    // This check seems out of place if we're not dealing with 'validity'
    if (!currentTrainingId) {
      return res.status(400).send({
        message: "currentTrainingId is required",
      });
    }

    const updatedTraining = await updateRelevantTraining(employeeId, trainingId, currentTrainingId);
    if (updatedTraining) {
      return res.status(200).json(updatedTraining);
    } else {
      return res.status(404).send({ message: "Relevant training not found" });
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).send({ message: error.message });
  }
});


export default router;
