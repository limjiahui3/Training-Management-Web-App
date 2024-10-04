import request from "supertest";
import express from "express";
import employeeRoutes from "../routes/employeeRoutes";
import pool from "../models/database.js";

jest.mock("../middleware/middleware.js", () => ({
  protect: (req, res, next) => next(),
}));

const app = express();
app.use(express.json());
app.use("/employees", employeeRoutes);

async function backupData() {
  const [backupEmployees] = await pool.query("SELECT * FROM employees");
  const [backupEmployeesTrainings] = await pool.query(
    "SELECT * FROM employees_trainings"
  );
  const [backupRelevantTrainings] = await pool.query(
    "SELECT * FROM relevant_trainings"
  );
  return { backupEmployees, backupEmployeesTrainings, backupRelevantTrainings };
}

async function restoreData(originalData) {
  await pool.query("SET FOREIGN_KEY_CHECKS = 0");
  await pool.query("TRUNCATE TABLE employees_trainings");
  await pool.query("TRUNCATE TABLE relevant_trainings");
  await pool.query("TRUNCATE TABLE employees");

  for (const row of originalData.backupEmployees) {
    await pool.query(
      "INSERT INTO employees (id, name, email, hire_date, designation) VALUES (?, ?, ?, ?, ?)",
      [row.id, row.name, row.email, row.hire_date, row.designation]
    );
  }

  for (const row of originalData.backupEmployeesTrainings) {
    await pool.query(
      "INSERT INTO employees_trainings (id, session_id, employee_id, training_id, status, start_date, end_date, expiry_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        row.id,
        row.session_id,
        row.employee_id,
        row.training_id,
        row.status,
        row.start_date,
        row.end_date,
        row.expiry_date,
      ]
    );
  }

  for (const row of originalData.backupRelevantTrainings) {
    await pool.query(
      "INSERT INTO relevant_trainings (id, employee_id, training_id, validity) VALUES (?, ?, ?, ?)",
      [row.id, row.employee_id, row.training_id, row.validity]
    );
  }

  await pool.query("SET FOREIGN_KEY_CHECKS = 1");
}

async function setup() {
  await pool.query("SET FOREIGN_KEY_CHECKS = 0");
  await pool.query("TRUNCATE TABLE employees_trainings");
  await pool.query("TRUNCATE TABLE relevant_trainings");
  await pool.query("TRUNCATE TABLE employees");
  await pool.query("SET FOREIGN_KEY_CHECKS = 1");

  await pool.query(
    "INSERT INTO employees (id, name, email, hire_date, designation) VALUES (?, ?, ?, ?, ?)",
    [1, "John Doe", "john@example.com", "2023-07-28", "Engineer"]
  );
}

describe("Integration Test: Employee Routes", () => {
  let originalData;

  beforeAll(async () => {
    originalData = await backupData();
  });

  afterAll(async () => {
    await restoreData(originalData);
    await pool.end();
  });

  beforeEach(async () => {
    await setup();
  });

  test("GET /employees - should fetch all employees", async () => {
    const res = await request(app).get("/employees");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([
      {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        hire_date: "2023-07-27T16:00:00.000Z",
        designation: "Engineer",
      },
    ]);
  });

  test("GET /employees/:id - should fetch an employee by ID", async () => {
    const res = await request(app).get("/employees/1");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      hire_date: "2023-07-27T16:00:00.000Z",
      designation: "Engineer",
    });
  });

  test("GET /employees/:id - should return 404 if employee does not exist", async () => {
    const res = await request(app).get("/employees/9999");
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: "Employee not found" });
  });

  test("POST /employees - should create a new employee", async () => {
    const res = await request(app).post("/employees").send({
      id: 2,
      name: "Jane Doe",
      email: "jane@example.com",
      hire_date: "2023-08-01",
      designation: "Manager",
    });
    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      id: 2,
      name: "Jane Doe",
      email: "jane@example.com",
      hire_date: "2023-07-31T16:00:00.000Z",
      designation: "Manager",
    });
  });

  test("POST /employees - should return 409 if employee ID already exists", async () => {
    const res = await request(app).post("/employees").send({
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      hire_date: "2023-07-28",
      designation: "Engineer",
    });
    expect(res.status).toBe(409);
    expect(res.body).toEqual({ message: "Employee with id 1 already exists" });
  });

  test("DELETE /employees/:id - should delete an employee", async () => {
    const res = await request(app).delete("/employees/1");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Delete Successful" });
  });

  test("DELETE /employees/:id - should return 200 with 'Employee not found' message if employee does not exist", async () => {
    const res = await request(app).delete("/employees/9999");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Employee not found" });
  });

  test("PUT /employees/:id - should update an employee", async () => {
    const res = await request(app).put("/employees/1").send({
      name: "John Smith",
      email: "johnsmith@example.com",
      hire_date: "2023-07-28",
      designation: "Senior Engineer",
    });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: 1,
      name: "John Smith",
      email: "johnsmith@example.com",
      hire_date: "2023-07-27T16:00:00.000Z",
      designation: "Senior Engineer",
    });
  });

  test("PUT /employees/:id - should return 404 if employee does not exist", async () => {
    const res = await request(app).put("/employees/9999").send({
      name: "Jane Smith",
      email: "janesmith@example.com",
      hire_date: "2023-08-01",
      designation: "Manager",
    });
    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      message: "Employee with id 9999 does not exist",
    });
  });
});
