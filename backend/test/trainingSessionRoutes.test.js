import request from "supertest";
import express from "express";
import trainingSessionRoutes from "../routes/trainingSessionRoutes";
import pool from "../models/database.js";

jest.mock("../middleware/middleware.js", () => ({
  protect: (req, res, next) => next(),
}));

const app = express();
app.use(express.json());
app.use("/training-sessions", trainingSessionRoutes);

async function backupData() {
  const [backupEmployees] = await pool.query("SELECT * FROM employees");
  const [backupTrainings] = await pool.query("SELECT * FROM trainings");
  const [backupTrainingSessions] = await pool.query(
    "SELECT * FROM employees_trainings"
  );
  return { backupEmployees, backupTrainings, backupTrainingSessions };
}

async function restoreData(originalData) {
  await pool.query("SET FOREIGN_KEY_CHECKS = 0");
  await pool.query("TRUNCATE TABLE employees_trainings");
  await pool.query("TRUNCATE TABLE trainings");
  await pool.query("TRUNCATE TABLE employees");
  await pool.query("SET FOREIGN_KEY_CHECKS = 1");

  for (const row of originalData.backupEmployees) {
    await pool.query(
      "INSERT INTO employees (id, name, email, hire_date, designation) VALUES (?, ?, ?, ?, ?)",
      [row.id, row.name, row.email, row.hire_date, row.designation]
    );
  }

  for (const row of originalData.backupTrainings) {
    await pool.query(
      "INSERT INTO trainings (id, title, description, validity_period, training_provider) VALUES (?, ?, ?, ?, ?)",
      [
        row.id,
        row.title,
        row.description,
        row.validity_period,
        row.training_provider,
      ]
    );
  }

  for (const row of originalData.backupTrainingSessions) {
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
}

async function setup() {
  await pool.query("SET FOREIGN_KEY_CHECKS = 0");
  await pool.query("TRUNCATE TABLE employees_trainings");
  await pool.query("TRUNCATE TABLE trainings");
  await pool.query("TRUNCATE TABLE employees");
  await pool.query("SET FOREIGN_KEY_CHECKS = 1");

  await pool.query(
    "INSERT INTO employees (id, name, email, hire_date, designation) VALUES (?, ?, ?, ?, ?), (?, ?, ?, ?, ?)",
    [
      1,
      "John Doe",
      "john@example.com",
      "2023-07-28",
      "Engineer",
      2,
      "Jane Smith",
      "jane@example.com",
      "2023-07-28",
      "Manager",
    ]
  );

  await pool.query(
    "INSERT INTO trainings (id, title, description, validity_period, training_provider) VALUES (?, ?, ?, ?, ?)",
    [1, "Safety Training", "Safety procedures", 12, "Provider A"]
  );
}

describe("Integration Test: Training Sessions Routes", () => {
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

  test("GET /training-sessions - should fetch all training sessions", async () => {
    await pool.query(
      "INSERT INTO employees_trainings (session_id, employee_id, training_id, status, start_date, end_date, expiry_date) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [1, 1, 1, "Completed", "2024-07-01", "2024-07-07", "2025-07-07"]
    );

    const res = await request(app).get("/training-sessions");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      1: {
        session_id: 1,
        start_date: expect.any(String),
        end_date: expect.any(String),
        expiry_date: expect.any(String),
        training_title: "Safety Training",
        training_id: 1,
        employees: [
          {
            employee_id: 1,
            employee_name: "John Doe",
            designation: "Engineer",
            status: "Completed",
          },
        ],
      },
    });
  });

  test("POST /training-sessions - should create new training sessions", async () => {
    const res = await request(app)
      .post("/training-sessions")
      .send({
        employee_ids: [1, 2],
        training_id: 1,
        status: "Scheduled",
        start_date: "2024-07-01",
        end_date: "2024-07-07",
      });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      1: {
        session_id: 1,
        start_date: expect.any(String),
        end_date: expect.any(String),
        expiry_date: expect.any(String),
        training_title: "Safety Training",
        training_id: 1,
        employees: [
          {
            employee_id: 1,
            employee_name: "John Doe",
            designation: "Engineer",
            status: "Scheduled",
          },
          {
            employee_id: 2,
            employee_name: "Jane Smith",
            designation: "Manager",
            status: "Scheduled",
          },
        ],
      },
    });

    const [rows] = await pool.query(
      "SELECT * FROM employees_trainings WHERE session_id = 1"
    );
    expect(rows.length).toBe(2);
  });
});
