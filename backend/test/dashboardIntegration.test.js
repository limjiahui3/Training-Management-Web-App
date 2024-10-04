import request from 'supertest';
import express from 'express';
import dashboardRoutes from '../routes/dashboardRoutes.js';
import pool from "../models/database.js";

jest.mock('../middleware/middleware.js', () => ({
  protect: (req, res, next) => next()
}));

const app = express();
app.use(express.json());
app.use('/dashboard', dashboardRoutes);

async function backupData() {
  const [backupRelevantTrainings] = await pool.query("SELECT * FROM relevant_trainings");
  const [backupEmployeesTrainings] = await pool.query("SELECT * FROM employees_trainings");
  const [backupTrainings] = await pool.query("SELECT * FROM trainings");
  const [backupEmployees] = await pool.query("SELECT * FROM employees");
  return { backupEmployees, backupEmployeesTrainings, backupTrainings, backupRelevantTrainings };
}

async function restoreData(originalData) {
  await pool.query("SET FOREIGN_KEY_CHECKS = 0");
  await pool.query("TRUNCATE TABLE relevant_trainings");
  await pool.query("TRUNCATE TABLE employees_trainings");
  await pool.query("TRUNCATE TABLE trainings");
  await pool.query("TRUNCATE TABLE employees");

  for (const row of originalData.backupEmployees) {
    await pool.query(
      "INSERT INTO employees (id, name, email, hire_date, designation) VALUES (?, ?, ?, ?, ?)",
      [row.id, row.name, row.email, row.hire_date, row.designation]
    );
  }

  for (const row of originalData.backupTrainings) {
    await pool.query(
      "INSERT INTO trainings (title, description, validity_period) VALUES (?, ?, ?)",
      [row.title, row.description, row.validity_period]
    );
  }

  for (const row of originalData.backupEmployeesTrainings) {
    await pool.query(
      "INSERT INTO employees_trainings (session_id, employee_id, training_id, status, start_date, end_date, expiry_date) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [row.session_id, row.employee_id, row.training_id, row.status, row.start_date, row.end_date, row.expiry_date]
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
  await pool.query("TRUNCATE TABLE relevant_trainings");
  await pool.query("TRUNCATE TABLE employees_trainings");
  await pool.query("TRUNCATE TABLE trainings");
  await pool.query("TRUNCATE TABLE employees");
  await pool.query("SET FOREIGN_KEY_CHECKS = 1");

  await pool.query(
    "INSERT INTO employees (id, name, email, hire_date, designation) VALUES (?, ?, ?, ?, ?)",
    [1, 'John Doe', 'john@example.com', '2022-01-15', 'Material Planner']
  );

  await pool.query(
    "INSERT INTO employees (id, name, email, hire_date, designation) VALUES (?, ?, ?, ?, ?)",
    [2, 'Jane Smith', 'jane@example.com', '2021-05-20', 'Production Machining HOD']
  );

  await pool.query(
    "INSERT INTO trainings (title, description, validity_period) VALUES (?, ?, ?)",
    ['COUNTERFEIT', 'INTERNAL', 365]
  );

  await pool.query(
    "INSERT INTO trainings (title, description, validity_period) VALUES (?, ?, ?)",
    ['FOD', 'INTERNAL', 365]
  );

  await pool.query(
    "INSERT INTO employees_trainings (session_id, employee_id, training_id, status, start_date, end_date, expiry_date) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [1, 1, 1, 'Completed', '2022-10-01', '2022-10-02', '2024-10-02']
  );

  await pool.query(
    "INSERT INTO employees_trainings (session_id, employee_id, training_id, status, start_date, end_date, expiry_date) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [2, 2, 2, 'Scheduled', '2024-08-15', '2024-08-29', '2025-08-29']
  );

  await pool.query(
    "INSERT INTO relevant_trainings (employee_id, training_id, validity) VALUES (?, ?, ?)",
    [1, 1, 'Valid']
  );

  await pool.query(
    "INSERT INTO relevant_trainings (employee_id, training_id, validity) VALUES (?, ?, ?)",
    [2, 2, 'NA']
  );
}

describe('Integration Tests: Dashboard Routes', () => {
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

  test('GET /dashboard should return combined employee training details', async () => {
    const response = await request(app).get('/dashboard');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      {
        employee_id: 1,
        employee_name: 'John Doe',
        designation: 'Material Planner',
        relevantTrainings: [
          {
            validity: 'Valid',
            title: 'COUNTERFEIT',
            latest_end_date: "2022-10-01T16:00:00.000Z",
            expiry_date: "2024-10-01T16:00:00.000Z",
            scheduled_date: null
          }
        ]
      },
      {
        employee_id: 2,
        employee_name: 'Jane Smith',
        designation: 'Production Machining HOD',
        relevantTrainings: [
          {
            validity: 'NA',
            title: 'FOD',
            latest_end_date: null,
            expiry_date: null,
            scheduled_date: "2024-08-14T16:00:00.000Z"
          }
        ]
      }
    ]);
  });

  test('GET /dashboard/percentage should return percentage of valid employees', async () => {
    const response = await request(app).get('/dashboard/percentage');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ percentageValidEmployees: '50.00' });
  });

  test('GET /dashboard/numbers should return training stats', async () => {
    const response = await request(app).get('/dashboard/numbers');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      'COUNTERFEIT': {
          numberOfEmployeesWithValid: '1',
          numberOfEmployeesWithTraining: '1'
      },
      'FOD': {
          numberOfEmployeesWithValid: '0',
          numberOfEmployeesWithTraining: '1'
      }
  });
  });

  test('GET /dashboard/employeeDetails should return employee details', async () => {
    const response = await request(app).get('/dashboard/employeeDetails');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      { employee_id: 1, employee_name: 'John Doe', designation: 'Material Planner' },
      { employee_id: 2, employee_name: 'Jane Smith', designation: 'Production Machining HOD' }
    ]);
  });

  test('GET /dashboard/relevantTrainings should return relevant trainings', async () => {
    const response = await request(app).get('/dashboard/relevantTrainings');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      { employee_id: 1, training_id: 1, validity: 'Valid', title: 'COUNTERFEIT' },
      { employee_id: 2, training_id: 2, validity: 'NA', title: 'FOD' }
  ]);
  });

  test('GET /dashboard/trainingDates should return training dates', async () => {
    const response = await request(app).get('/dashboard/trainingDates');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      { employee_id: 1, training_id: 1, title: 'COUNTERFEIT', latest_end_date: "2022-10-01T16:00:00.000Z", expiry_date: "2024-10-01T16:00:00.000Z", scheduled_date: null },
      { employee_id: 2, training_id: 2, title: 'FOD', latest_end_date: null, expiry_date: null, scheduled_date: "2024-08-14T16:00:00.000Z" }
  ]);
  });
});