import express from "express";
import {
  getEmployeeTrainings,
  getEmployeeTrainingByID,
  getEmployeeTrainingByTrainingID,
  getEmployeeTrainingsByEmployeeID,
  createEmployeeTraining,
  deleteEmployeeTraining,
  updateEmployeeTraining,
} from "../models/employeeModels/employeesTrainingsDatabase.js";

const router = express.Router();

// Route for Get All Employees Trainings from database
router.get("/", async (req, res) => {
  try {
    console.log("Fetching all employee trainings...");
    const employeesTrainings = await getEmployeeTrainings();
    return res.status(200).json(employeesTrainings);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send({ message: error.message });
  }
});

// Route for Get a specific employee training by ID
router.get("/:id", async (req, res) => {
  try {
    console.log(`Fetching ID: ${req.params.id}`);
    const employeeTraining = await getEmployeeTrainingByID(req.params.id);
    if (employeeTraining) {
      return res.status(200).json(employeeTraining);
    } else {
      return res.status(404).send({ message: "Employee Training not found" });
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).send({ message: error.message });
  }
});

// Route for Get a specific employee training by training ID
router.get("/training/:id", async (req, res) => {
  try {
    // console.log(`Fetching training ID: ${req.params.id}`);
    const employeeTraining = await getEmployeeTrainingByTrainingID(req.params.id);
    // console.log(employeeTraining);
    if (employeeTraining) {
      return res.status(200).json(employeeTraining);
    } else {
      return res.status(404).send({ message: "Employee Training not found" });
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).send({ message: error.message });
  }
});

// Route for Get all trainings from database by employee id
router.get("/employee/:id", async (req, res) => {
  try {
    console.log(`Fetching trainings for employee ID: ${req.params.id}`);
    const employeeTrainings = await getEmployeeTrainingsByEmployeeID(req.params.id);
    if (employeeTrainings.length > 0) {
      return res.status(200).json(employeeTrainings);
    } else {
      return res.status(404).send({ message: "Employee Trainings not found" });
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).send({ message: error.message });
  }
});

// Route for adding a new Employee Training
router.post("/", async (req, res) => {
  try {
    console.log("Creating new employee training with data:", req.body);
    const { employee_id, training_id, status, start_date, end_date } = req.body;
    if (!employee_id || !training_id || !status || !start_date || !end_date) {
      return res.status(400).send({
        message: "Send all required fields: employee_id, training_id, status, start_date, end_date",
      });
    }
    const newEmployeeTraining = await createEmployeeTraining(
      employee_id,
      training_id,
      status,
      start_date,
      end_date,
    );
    return res.status(201).json(newEmployeeTraining);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send({ message: error.message });
  }
});

// Route for Deleting an Employee Training
router.delete("/:id", async (req, res) => {
  try {
    console.log(`Deleting employee training ID: ${req.params.id}`);
    const message = await deleteEmployeeTraining(req.params.id);
    return res.status(200).send({ message });
  } catch (error) {
    console.error(error.message);
    return res.status(500).send({ message: error.message });
  }
});

// Route for Updating an Employee Training
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { training_id, status, start_date, end_date } = req.body;
    console.log("Updating employee training with ID:", id , "with data:", req.body);

    if (!training_id || !status || !start_date || !end_date) {
      return res.status(400).send({
        message: "Send all required fields: employee_id, training_id, status, start_date, end_date",
      });
    }

    const updatedEmployeeTraining = await updateEmployeeTraining(
      id,
      training_id,
      status,
      start_date,
      end_date,
    );

    if (updatedEmployeeTraining) {
      return res.status(200).json(updatedEmployeeTraining);
    } else {
      return res.status(404).send({ message: "Employee training not found" });
    }

  } catch (error) {
    console.error(error.message);
    return res.status(500).send({ message: error.message });
  }
});

export default router;
