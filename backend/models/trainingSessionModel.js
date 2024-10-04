import {getTrainingValidityPeriod} from "./trainingModel.js";
import {
  checkRelevantTrainingExists,
  createRelevantTraining,
  updateRelevantTrainingValidity
} from "./relevantTrainingsModel.js";
import {getEmployeeByID} from "./employeeModels/employeeModel.js";
import {sendEmail} from "../middleware/emailService.js";
import pool from "./database.js";

// function to format the data obtained from the database
function formatSession (rows) {
  const trainingSessionsDict = {};
  rows.forEach(row => {
    // if trianingSessionsDict does not have the session id, create populate the trainingsessiondict with the details of the session
    if (!trainingSessionsDict[row.session_id]) {
      trainingSessionsDict[row.session_id] = {
        session_id: row.session_id,
        start_date: row.start_date,
        end_date: row.end_date,
        expiry_date: row.expiry_date,
        training_title: row.training_title,
        training_id: row.training_id,
        employees: [
          {
            employee_id: row.employee_id,
            employee_name: row.employee_name,
            designation: row.designation,
            status: row.status,
          }
        ]
      };
    }
    // just add the employee details to the employees attribute of the session
    else {
      trainingSessionsDict[row.session_id].employees.push({
        employee_id: row.employee_id,
        employee_name: row.employee_name,
        designation: row.designation,
        status: row.status,
      });
    }
  });
  return trainingSessionsDict;
}

export async function getAllTrainingSessions() {
    const [rows] = await pool.query(`
        SELECT
            ts.session_id AS session_id,
            ts.status AS status,
            ts.start_date AS start_date,
            ts.end_date AS end_date,
            ts.expiry_date AS expiry_date,
            e.id AS employee_id,
            e.name AS employee_name,
            e.designation as designation,
            t.title as training_title,
            t.id as training_id
        FROM employees_trainings ts
        JOIN employees e ON ts.employee_id = e.id
        JOIN trainings t ON ts.training_id = t.id;
    `);
    return formatSession(rows);
}

export async function getTrainingSession(session_id) {
  const sessionExists = await checkSessionIdExists(session_id);
  
  if (!sessionExists) {
    return null;
  }
  
  const [rows] = await pool.query(
    `
    SELECT
      ts.session_id AS session_id,
      ts.status AS status,
      ts.start_date AS start_date,
      ts.end_date AS end_date,
      ts.expiry_date AS expiry_date,
      e.id AS employee_id,
      e.name AS employee_name,
      e.designation as designation,
      t.title as training_title,
      t.id as training_id
    FROM employees_trainings ts
    JOIN employees e ON ts.employee_id = e.id
    JOIN trainings t ON ts.training_id = t.id
    WHERE ts.session_id = ?;
    `,
    [session_id]
  );
  return formatSession(rows);
}
export async function getEmployeesbySessionId(session_id) {
  const [rows] = await pool.query(
    `
    SELECT
      e.id AS employee_id,
      e.name AS employee_name,
      e.designation as designation,
      ts.status AS status,
      ts.start_date AS start_date,
      ts.end_date AS end_date,
      ts.expiry_date AS expiry_date
    FROM employees_trainings ts
    JOIN employees e ON ts.employee_id = e.id
    WHERE ts.session_id = ?;
    `,
    [session_id]
  );
  return rows;
}

export async function checkSessionIdExists(session_id) {
  const [rows] = await pool.query(
    "SELECT COUNT(*) as count FROM employees_trainings WHERE session_id = ?",
    [session_id]
  );
  return rows[0].count > 0;
}

export async function createTrainingSession(
  employee_ids,
  training_id,
  status,
  start_date,
  end_date,
  session_id = null
) {
  let newMaxSessionId;

  if (session_id) {
    newMaxSessionId = session_id;
  } else {
    const [maxSessionIdResult] = await pool.query(
      "SELECT MAX(session_id) AS maxSessionId FROM employees_trainings"
    );
    newMaxSessionId = maxSessionIdResult[0].maxSessionId + 1;
  }

  let validityPeriod = await getTrainingValidityPeriod(training_id);
  // expiry date = end date + validity period in months
  const expiry_date = new Date(end_date);
  expiry_date.setMonth(expiry_date.getMonth() + validityPeriod);

  let emailRecipients = [];

  for (const employee_id of employee_ids) {
    let relevantTrainingExists = await checkRelevantTrainingExists(employee_id, training_id);

    if (!relevantTrainingExists) {
      await createRelevantTraining(employee_id, training_id);
    }

    await pool.query(
      "INSERT INTO employees_trainings (session_id, employee_id, training_id, status, start_date, end_date, expiry_date) VALUES (?, ?, ?, ?, ?, ?, DATE_ADD(?, INTERVAL ? MONTH))",
      [newMaxSessionId, employee_id, training_id, status, start_date, end_date, end_date, validityPeriod]
    );

    const employee = await getEmployeeByID(employee_id);
    emailRecipients.push(employee.email);

    if (status.toLowerCase() === "completed") {
      // if expiry date past today, set validity to expired
      // else set validity to valid
      if (expiry_date < new Date()) {
        updateRelevantTrainingValidity(employee_id, training_id, "Expired")
      }
      else {
        updateRelevantTrainingValidity(employee_id, training_id, "Valid")
      }
    }
  }

  const emailRecipientsString = emailRecipients.join(",");

  const { messageId, url } = await sendEmail(
    emailRecipientsString,
    "Training Session Created",
    "A new training session has been created for you",
    "<p>A new training session has been created</p>"
  );
  console.log(`Message ${messageId} sent: ${url}`);

  const trainingSession = await getTrainingSession(newMaxSessionId);
  return trainingSession;
}

export async function updateTrainingSession(
  session_id,
  employee_ids,
  training_id,
  status,
  start_date,
  end_date
) {
  await deleteTrainingSession(session_id);
  const trainingSession = await createTrainingSession(employee_ids, training_id, status, start_date, end_date, session_id);
  return trainingSession;
}

export async function deleteTrainingSession(session_id) {
    const [result] = await pool.query(
        "DELETE FROM employees_trainings WHERE session_id = ?",
        [session_id]
    );
    return { affectedRows: result.affectedRows }; // Return basic result info
}

export async function markAttendance(session_id, employee_ids) {

  var [trainingIdRow] = await pool.query(
    "SELECT training_id FROM employees_trainings WHERE session_id = ?",
    [session_id]
  );

  // validityPeriod = await getTrainingValidityPeriod(trainingIdRow[0].training_id);

  for (const employee_id of employee_ids) {
    const [result] = await pool.query(
      `UPDATE employees_trainings et 
        SET status = 'completed'
        WHERE session_id = ? AND employee_id = ?`,
      [session_id, employee_id]
    );

  await updateRelevantTrainingValidity(employee_id, trainingIdRow[0].training_id, "Valid");
  
  }
  return getTrainingSession(session_id); // Return basic result info
}

// Get all upcoming training sessions in exactly 3 days
export async function getUpcomingTrainings() {
  const [rows] = await pool.query(
      `SELECT et.*, e.name AS employee_name, e.email AS employee_email, t.title AS training_title
     FROM employees_trainings et
     JOIN employees e ON et.employee_id = e.id
     JOIN trainings t ON et.training_id = t.id
     WHERE et.start_date = DATE_ADD(CURDATE(), INTERVAL 3 DAY)`
  );
  return rows;
}