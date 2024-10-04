import {
  sendExpiringTrainingEmail,
  sendUpcomingTrainingsEmail,
} from "../scheduler/autoNotificationScheduler.js";
import pool from "../models/database.js";
import schedule from "node-schedule";
import {getExpiringTrainings} from "../models/relevantTrainingsModel.js";
import {getUpcomingTrainings} from "../models/trainingSessionModel.js";

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

  // Insert some employees with expiring training this month and some employees with upcoming training in 3 days based on relevant trainings
  await pool.query(`
    INSERT INTO employees (id, name, email, hire_date, designation) VALUES 
    (1, 'John Doe', 'john@example.com', '2023-07-28', 'Engineer'), 
    (2, 'Jane Smith', 'jane@example.com', '2023-07-28', 'Manager')
  `);

  await pool.query(`
    INSERT INTO trainings (id, title, description, validity_period, training_provider) VALUES 
    (1, 'Safety Training', 'Safety procedures', 12, 'Provider A'),
    (2, 'Machining', 'Machining procedures', 6, 'Provider B')
  `);

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const expiryDate1 = new Date(
    year,
    month,
    Math.min(now.getDate() + 5, new Date(year, month + 1, 0).getDate())
  )
    .toISOString()
    .split("T")[0];

  const expiryDate2 = 
    new Date(year, month, new Date(year, month + 1, 0).getDate())
    .toISOString()
    .split("T")[0];

  const startDate = new Date(now);
  startDate.setDate(now.getDate() + 3);
  const startDateUtc = new Date(startDate.toUTCString().split(' GMT')[0] + ' GMT');
  const startDateFormatted = startDateUtc.toISOString().split("T")[0];

  console.log(startDate);

  await pool.query(`
    INSERT INTO employees_trainings (session_id, employee_id, training_id, status, start_date, end_date, expiry_date) VALUES
    (1, 1, 1, 'Completed', '2023-08-01', '2023-08-01', '${expiryDate1}'),
    (1, 2, 2, 'Completed', '2023-08-01', '2023-08-01', '${expiryDate1}'),
    (2, 2, 2, 'Completed', '2024-02-01', '2024-02-01', '${expiryDate2}'),
    (3, 1, 2, 'Scheduled', '${startDateFormatted}', '${startDateFormatted}', NULL)
  `);
}

describe("Integration Test: Email Scheduler", () => {
  let originalData;

  beforeAll(async () => {
    originalData = await backupData();
  });

  afterAll(async () => {
    await restoreData(originalData);
    await pool.end();
    await schedule.gracefulShutdown();
  });

  beforeEach(async () => {
    await setup();
  });

  test("sendExpiringTrainingEmail - should send expiring trainings email", async () => {
    const expiringTrainings = await getExpiringTrainings();
    const result = await sendExpiringTrainingEmail(expiringTrainings);
    expect(result).toBe("Expiring trainings email sent");
  });

  test("sendExpiringTrainingEmail - should send no expiring trainings email if no expiring trainings this month", async () => {
    await pool.query("TRUNCATE TABLE employees_trainings");
    const expiringTrainings = await getExpiringTrainings();
    const result = await sendExpiringTrainingEmail(expiringTrainings);
    expect(result).toBe("No expiring trainings email sent");
  });

  test("sendUpcomingTrainingEmail - should send upcoming trainings email", async () => {
    const upcomingTrainings = await getUpcomingTrainings();
    const result = await sendUpcomingTrainingsEmail(upcomingTrainings);
    expect(result).toBe("Upcoming trainings email sent");
  });

  test("sendUpcomingTrainingsEmail - should not send email if no upcoming trainings in 3 days", async () => {
    await pool.query("TRUNCATE TABLE employees_trainings");
    const upcomingTrainings = await getUpcomingTrainings();
    const result = await sendUpcomingTrainingsEmail(upcomingTrainings);
    expect(result).toBe("No Upcoming Trainings");
  });
});
