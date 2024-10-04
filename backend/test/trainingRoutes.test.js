import request from "supertest";
import express from "express";
import trainingRoutes from "../routes/trainingRoutes";
import pool from "../models/database.js";

jest.mock("../middleware/middleware.js", () => ({
  protect: (req, res, next) => next(),
}));

const app = express();
app.use(express.json());
app.use("/trainings", trainingRoutes);

async function backupData() {
  const [backupTrainings] = await pool.query("SELECT * FROM trainings");
  const [backupEmployeesTrainings] = await pool.query(
    "SELECT * FROM employees_trainings"
  );
  const [backupRelevantTrainings] = await pool.query(
    "SELECT * FROM relevant_trainings"
  );
  return { backupTrainings, backupEmployeesTrainings, backupRelevantTrainings };
}

async function restoreData(originalData) {
  await pool.query("SET FOREIGN_KEY_CHECKS = 0");
  await pool.query("TRUNCATE TABLE employees_trainings");
  await pool.query("TRUNCATE TABLE relevant_trainings");
  await pool.query("TRUNCATE TABLE trainings");

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
  await pool.query("TRUNCATE TABLE trainings");
  await pool.query("SET FOREIGN_KEY_CHECKS = 1");

  await pool.query(
    "INSERT INTO trainings (id, title, description, validity_period, training_provider) VALUES (?, ?, ?, ?, ?)",
    [1, "AS 9100D AWARENESS", "EXTERNAL", 365, "Provider A"]
  );
}

describe("Integration Test: Training Routes", () => {
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

  test("GET /trainings - should fetch all trainings", async () => {
    const res = await request(app).get("/trainings");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([
      {
        id: 1,
        title: "AS 9100D AWARENESS",
        description: "EXTERNAL",
        validity_period: 365,
        training_provider: "Provider A",
      },
    ]);
  });

  test("GET /trainings/:id - should fetch a training by ID", async () => {
    const res = await request(app).get("/trainings/1");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: 1,
      title: "AS 9100D AWARENESS",
      description: "EXTERNAL",
      validity_period: 365,
      training_provider: "Provider A",
    });
  });

  test("GET /trainings/:id - should return 404 if training does not exist", async () => {
    const res = await request(app).get("/trainings/9999");
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: "Training not found" });
  });

  test("POST /trainings - should create a new training", async () => {
    const res = await request(app).post("/trainings").send({
      title: "FOD",
      description: "INTERNAL",
      validity_period: 365,
      training_provider: "Provider B",
    });
    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      id: expect.any(Number),
      title: "FOD",
      description: "INTERNAL",
      validity_period: 365,
      training_provider: "Provider B",
    });
  });

  test("DELETE /trainings/:id - should delete a training", async () => {
    const res = await request(app).delete("/trainings/1");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Delete Successful" });
  });

  test("DELETE /trainings/:id - should return 200 with 'Training not found' message if training does not exist", async () => {
    const res = await request(app).delete("/trainings/9999");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Training not found" });
  });

  test("PUT /trainings/:id - should update a training", async () => {
    const res = await request(app).put("/trainings/1").send({
      title: "Updated Training",
      description: "Updated Description",
      validity_period: 400,
      training_provider: "Updated Provider",
    });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: 1,
      title: "Updated Training",
      description: "Updated Description",
      validity_period: 400,
      training_provider: "Updated Provider",
    });
  });

  test("PUT /trainings/:id - should return 404 if training does not exist", async () => {
    const res = await request(app).put("/trainings/9999").send({
      title: "Nonexistent Training",
      description: "Nonexistent Description",
      validity_period: 365,
      training_provider: "Nonexistent Provider",
    });
    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      message: "Training with id 9999 does not exist",
    });
  });
});
