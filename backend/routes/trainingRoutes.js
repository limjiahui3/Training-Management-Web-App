import express from "express";
import {
  getTrainings,
  getTrainingNames,
  getTrainingByID,
  createTraining,
  deleteTraining,
  updateTraining,
} from "../models/trainingModel.js";
import { protect } from "../middleware/middleware.js"; //add this

const router = express.Router();

router.use(protect); //add this

// Route for Get All Trainings from database
router.get("/", async (req, res) => {
  try {
    const trainings = await getTrainings();
    return res.status(200).json(trainings);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send({ message: error.message });
  }
});

router.get("/names", async (req, res) => {
  try {
    const trainingNames = await getTrainingNames();
    return res.status(200).json(trainingNames);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send({ message: error.message });
  }
})

// Route for Get One Training from database by id
router.get("/:id", async (req, res) => {
  try {
    const training = await getTrainingByID(req.params.id);
    console.log(training);
    if (training) {
      return res.status(200).json(training);
    } else {
      return res.status(404).send({ message: "Training not found" });
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).send({ message: error.message });
  }
});

// Route for adding a new Training
router.post("/", async (req, res) => {
  try {
    const { title, description, validity_period, training_provider } = req.body;
    if (!title || !description || !validity_period || !training_provider) {
      return res.status(400).send({
        message:
          "Send required fields: title, description, validity_period, training_provider",
      });
    }
    const newTraining = await createTraining(
      title,
      description,
      validity_period,
      training_provider
    );
    return res.status(201).json(newTraining);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send({ message: error.message });
  }
});

// Route for Deleting a Training
router.delete("/:id", async (req, res) => {
  try {
    const message = await deleteTraining(req.params.id);
    return res.status(200).send({ message });
  } catch (error) {
    console.error(error.message);
    return res.status(500).send({ message: error.message });
  }
});

// Route for Updating a Training
router.put("/:id", async (req, res) => {
  try {
    const { title, description, validity_period, training_provider } = req.body;
    if (!title || !description || !validity_period || !training_provider) {
      return res.status(400).send({
        message:
          "Send required fields: title, description, validity_period, training_provider",
      });
    }
    const updatedTraining = await updateTraining(
      req.params.id,
      title,
      description,
      validity_period,
      training_provider
    );
    return res.status(200).json(updatedTraining);
  } catch (error) {
    console.error(error.message);
    if (error.message.includes("does not exist")) {
      return res.status(404).send({ message: error.message });
    }
    return res.status(500).send({ message: error.message });
  }
});

export default router;
