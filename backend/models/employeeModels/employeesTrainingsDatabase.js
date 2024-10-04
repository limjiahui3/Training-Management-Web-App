import pool from "../database.js";

// Check if an employee training ID exists
export async function employeeTrainingIdExists(id) {
  const [rows] = await pool.query(
    "SELECT COUNT(*) as count FROM employees_trainings WHERE id = ?",
    [id]
  );
  return rows[0].count > 0;
}

// Get all employee trainings
export async function getEmployeeTrainings() {
  const [rows] = await pool.query("SELECT * FROM employees_trainings");
  return rows;
}

// Get employee training by session ID
export async function getEmployeeTrainingByID(id) {
  const [rows] = await pool.query("SELECT * FROM employees_trainings WHERE id = ?", [id]);
  return rows[0];
}

// Create SQL to get the id, status, start date, end date, and expiry date from the employee trainings table. Also get the employee id, employee name, and training title from the employees and trainings tables respectively. Only get it based on the training id


// Get employee training by training ID
// export async function getEmployeeTrainingByTrainingID(training_id) {
//   const [rows] = await pool.query(
//     "SELECT * FROM employees_trainings WHERE training_id = ?", 
//     [training_id]);
//   return rows;
// }

export async function getEmployeeTrainingByTrainingID(id) {
  const [rows] = await pool.query(`
    SELECT
      et.id as session_id,
      t.id as training_id,
      t.title AS training_title,
      e.id AS employee_id,
      e.name AS employee_name,
      e.email AS employee_email,
      e.designation as employee_designation,
      et.status,
      et.start_date,
      et.end_date,
      et.expiry_date
    FROM
      employees_trainings et
    JOIN
      employees e ON et.employee_id = e.id
    JOIN
      trainings t ON et.training_id = t.id
    WHERE
      et.training_id = ?;
    `, [id]);
  return rows;
}

// Get employee trainings by employee ID
export async function getEmployeeTrainingsByEmployeeID(employee_id) {
  const [rows] = await pool.query(`
    SELECT
      et.id as session_id,
      t.id as training_id,
      t.title AS training_title,
      e.id AS employee_id,
      e.name AS employee_name,
      e.email AS employee_email,
      e.designation as employee_designation,
      et.status,
      et.start_date,
      et.end_date,
      et.expiry_date
    FROM
      employees e
    JOIN
      employees_trainings et ON et.employee_id = e.id
    JOIN
      trainings t ON et.training_id = t.id
    WHERE
      e.id = ?;
    `, [employee_id]);
  return rows;
}



// Create a new employee training
export async function createEmployeeTraining(
  employee_id,
  training_id,
  status,
  start_date,
  end_date,
) {
  // Check if the training ID exists before inserting
  const [trainingExists] = await pool.query(
    "SELECT COUNT(*) as count FROM trainings WHERE id = ?",
    [training_id]
  );
  
  if (trainingExists.count === 0) {
    throw new Error(`Training with id ${training_id} does not exist`);
  }

  const [result] = await pool.query(
    "INSERT INTO employees_trainings (employee_id, training_id, status, start_date, end_date) VALUES (?, ?, ?, ?, ?)",
    [employee_id, training_id, status, start_date, end_date]
  );
  
  return { insertId: result.insertId, affectedRows: result.affectedRows }; // Return basic result info
}

// Delete an employee training
export async function deleteEmployeeTraining(id) {
  const [result] = await pool.query("DELETE FROM employees_trainings WHERE id = ?", [id]);
  return result.affectedRows > 0 ? "Delete Successful" : "Employee training not found";
}

// Update an existing employee training
export async function updateEmployeeTraining(
  id,
  training_id,
  status,
  start_date,
  end_date,
) {
  // Check if the employee training ID exists before updating
  if (!(await employeeTrainingIdExists(id))) {
    throw new Error(`Employee training with id ${id} does not exist`);
  }

  const [result] = await pool.query(
    "UPDATE employees_trainings SET training_id = ?, status = ?, start_date = ?, end_date = ? WHERE id = ?",
    [training_id, status, start_date, end_date, id]
  );
  return result.affectedRows > 0 ? "Update Successful" : "Update Failed";
}
