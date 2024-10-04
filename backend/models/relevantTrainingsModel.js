import pool from "./database.js";

// Check if a relevant training entry exists
export async function checkRelevantTrainingExists(employee_id, training_id) {
  const [rows] = await pool.query(
    "SELECT COUNT(*) as count FROM relevant_trainings WHERE employee_id = ? AND training_id = ?",
    [employee_id, training_id]
  );
  return rows[0].count > 0;
}

// Get all relevant trainings
export async function getRelevantTrainings() {
  const [rows] = await pool.query("SELECT * FROM relevant_trainings");
  return rows;
}

// Get relevant trainings by id
export async function getRelevantTrainingsById(id){
    const [row] = await pool.query("SELECT * FROM relevant_trainings WHERE id = ?", [id]);
    return row[0];
  }


// Get relevant trainings by training_id
export async function getRelevantTrainingsByTrainingId(training_id) {
  const [rows] = await pool.query("SELECT * FROM relevant_trainings WHERE training_id = ?", [training_id]);
  return rows;
}

// Get relevant trainings by employee_id
export async function getRelevantTrainingsByEmployeeId(employee_id) {
  const [rows] = await pool.query(`
    SELECT
      rt.training_id as training_id,
      t.title,
      rt.validity as validity,
      t.validity_period as validity_period
    FROM
      relevant_trainings rt
    JOIN
      trainings t ON rt.training_id = t.id
    WHERE
      rt.employee_id = ?;
  `, [employee_id]);
    return rows;
  }

// Get relevant trainings by employee_id and training_id
export async function getRelevantTrainingsByEmployeeTrainingId(employee_id, training_id,) {
  const [rows] = await pool.query("SELECT * FROM relevant_trainings WHERE employee_id = ? AND training_id = ?", [employee_id, training_id]);
  return rows;
}

// Create a new relevant training entry
export async function createRelevantTraining(
    employee_id, 
    training_id, 
    validity = "NA"
) {

  // Check if the relevant training entry already exists
  if (await checkRelevantTrainingExists(employee_id, training_id)) {
    throw new Error(`Relevant training for employee_id ${employee_id} and training_id ${training_id} already exists`);
  }

  const [result] = await pool.query(
    "INSERT INTO relevant_trainings (employee_id, training_id, validity) VALUES (?, ?, ?)",
    [employee_id, training_id, validity]
  );
  return getRelevantTrainingsByEmployeeId(employee_id);
}

// Delete a relevant training entry
export async function deleteRelevantTraining(employee_id, training_id) {
  const [result] = await pool.query(
    "DELETE FROM relevant_trainings WHERE employee_id = ? AND training_id = ?", 
    [employee_id, training_id]);
  return result.affectedRows > 0 ? "Delete Successful" : "Relevant training not found";
}

// Update an existing relevant training entry
export async function updateRelevantTraining(employeeId, oldTrainingId, newTrainingId) {
  // Check if the relevant training entry exists before updating
  if (!(await checkRelevantTrainingExists(employeeId, oldTrainingId))) {
    throw new Error(`Relevant training for employeeId ${employeeId} and trainingId ${oldTrainingId} does not exist`);
  }

  // Check for potential conflicts with the new training ID
  if (await checkRelevantTrainingExists(employeeId, newTrainingId)) {
    throw new Error(`Training ID ${newTrainingId} already exists for employeeId ${employeeId}`);
  }

  try {
    const [result] = await pool.query(
      "UPDATE relevant_trainings SET training_id = ? WHERE employee_id = ? AND training_id = ?",
      [newTrainingId, employeeId, oldTrainingId]
    );

    if (result.affectedRows > 0) {
      return await getRelevantTrainingsByEmployeeId(employeeId);
    } else {
      throw new Error(`Failed to update relevant training for employeeId ${employeeId} and trainingId ${oldTrainingId}`);
    }
  } catch (error) {
    console.error("Database error:", error.message);
    throw error; // Re-throw error to be caught by the route handler
  }
}

export async function updateRelevantTrainingValidity(employeeId, trainingId, validity) {
  // Check if the relevant training entry exists before updating
  if (!(await checkRelevantTrainingExists(employeeId, trainingId))) {
    throw new Error(`Relevant training for employeeId ${employeeId} and trainingId ${trainingId} does not exist`);
  }

  try {
    const [result] = await pool.query(
      "UPDATE relevant_trainings SET validity = ? WHERE employee_id = ? AND training_id = ?",
      [validity, employeeId, trainingId]
    );

    if (result.affectedRows > 0) {
      return await getRelevantTrainingsByEmployeeId(employeeId);
    } else {
      throw new Error(`Failed to update relevant training for employeeId ${employeeId} and trainingId ${trainingId}`);
    }
  } catch (error) {
    console.error("Database error:", error.message);
    throw error; // Re-throw error to be caught by the route handler
  }
}


export async function updateCertificationsThatExpired() {
  // For each employee's relevant training, find their most recent training session expiry date.
  // If the expiry date has passed, update the relevant training's validity.
  const [rows] = await pool.query(`
    UPDATE relevant_trainings rt
    JOIN (
      SELECT
        et.employee_id,
        et.training_id,
        MAX(et.expiry_date) as expiry_date
      FROM
        employees_trainings et
      WHERE
        et.expiry_date < CURDATE()
      GROUP BY
        et.employee_id,
        et.training_id
    ) AS et ON rt.employee_id = et.employee_id AND rt.training_id = et.training_id
    SET rt.validity = "Expired"
  `);
}

// Get all trainings expiring this month
export async function getExpiringTrainings() {
  const [rows] = await pool.query(
      `SELECT et.*, e.name AS employee_name, t.title AS training_title 
     FROM employees_trainings et
     JOIN employees e ON et.employee_id = e.id
     JOIN trainings t ON et.training_id = t.id
     WHERE et.expiry_date >= DATE_FORMAT(CURDATE(), '%Y-%m-01') 
     AND et.expiry_date < DATE_FORMAT(DATE_ADD(CURDATE(), INTERVAL 1 MONTH), '%Y-%m-01')`
  );
  return rows;
}