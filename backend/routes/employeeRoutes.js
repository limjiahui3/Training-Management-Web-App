import express from "express";
import {
  getEmployees,
  getEmployeeByID,
  createEmployee,
  deleteEmployee,
  updateEmployee,
} from "../models/employeeModels/employeeModel.js";

import { protect } from '../middleware/middleware.js'; //add this
const router = express.Router();    

router.use(protect);    //add this

// Route for Get All Employees from database
router.get("/", async (req, res) => {
  try {
    console.log(`Fetching All Employees ID`);
    const employees = await getEmployees();
    return res.status(200).json(employees);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send({ message: error.message });
  }
});

// Route for Get One Employee from database by id
router.get("/:id", async (req, res) => {
  try {
    console.log(`Fetching Employee by ID: ${req.params.id}`);
    const employee = await getEmployeeByID(req.params.id);
    if (employee) {
      return res.status(200).json(employee);
    } else {
      return res.status(404).send({ message: "Employee not found" });
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).send({ message: error.message });
  }
});

// Route for adding a new Employee
router.post("/", async (req, res) => {
  try {
    // console.log(req.body);
    const {
      id,
      name,
      email,
      hire_date,
      designation,
    } = req.body;

    if (!id || !name || !email || !hire_date || !designation) {
      return res
        .status(400)
        .send({
          message:
            "Send all required fields: id, name, email, hire_date, designation",
        });
    }
    const newEmployee = await createEmployee(
      id,
      name,
      email,
      hire_date,
      designation
    );
    return res.status(201).json(newEmployee);
  } catch (error) {
    console.error(error.message);
    if (error.message.includes("already exists")) {
      return res.status(409).send({ message: error.message });
    }
    return res.status(500).send({ message: error.message });
  }
});

// Route for Deleting an Employee
router.delete("/:id", async (req, res) => {
  try {
    const message = await deleteEmployee(req.params.id);
    return res.status(200).send({ message });
  } catch (error) {
    console.error(error.message);
    return res.status(500).send({ message: error.message });
  }
});

// Route for Updating an Employee
router.put("/:id", async (req, res) => {
  // console.log(req.body);
  try {
    const {
      name,
      email,
      hire_date,
      designation,
    } = req.body;
    if (!name || !email || !hire_date || !designation) {
      return res
        .status(400)
        .send({
          message:
            "Send all required fields: id, name, email, hire_date, designation",
        });
    }
    const updatedEmployee = await updateEmployee(
      req.params.id,
      name,
      email,
      hire_date,
      designation
    );
    if (updatedEmployee) {
      return res.status(200).json(updatedEmployee);
    } else {
      return res.status(404).send({ message: "Employee not found" });
    }
  } catch (error) {
    console.error(error.message);
    if (error.message.includes("does not exist")) {
      return res.status(404).send({ message: error.message });
    }
    return res.status(500).send({ message: error.message });
  }
});

export default router;
