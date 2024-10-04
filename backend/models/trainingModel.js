import { title } from "process";
import pool from "./database.js";

// Check if a training ID exists
export async function trainingIdExists(id) {
  const [rows] = await pool.query(
    "SELECT COUNT(*) as count FROM trainings WHERE id = ?",
    [id]
  );
  return rows[0].count > 0;
}

// Get all trainings
export async function getTrainings() {
  const [rows] = await pool.query("SELECT * FROM trainings");
  return rows;
}

export async function getTrainingValidityPeriod (id) {
  const [trainingValidityPeriod] = await pool.query(
    "SELECT validity_period FROM trainings WHERE id = ?",
    [id]
  );
  return trainingValidityPeriod[0].validity_period;
}

// Get a training by ID
export async function getTrainingByID(id) {
  const [rows] = await pool.query("SELECT * FROM trainings WHERE id = ?", [id]);
  return rows[0];
}

export async function getTrainingNames() {
  const [rows] = await pool.query("SELECT title FROM trainings");
  const trainingNames = rows.map((row) => row.title);
  return trainingNames;
}

// Create a new training
export async function createTraining(
  title,
  description,
  validity_period,
  training_provider
) {
  const [result] = await pool.query(
    "INSERT INTO trainings (title, description, validity_period, training_provider) VALUES (?, ?, ?, ?)",
    [title, description, validity_period, training_provider]
  );
  return getTrainingByID(result.insertId);
}

// Delete a training
export async function deleteTraining(id) {
  console.log("Deleting training ID: ", { id });
  const [result] = await pool.query("DELETE FROM trainings WHERE id = ?", [id]);
  return result.affectedRows > 0 ? "Delete Successful" : "Training not found";
}

// Update an existing training
export async function updateTraining(
  id,
  title,
  description,
  validity_period,
  training_provider
) {
  // Check if the training ID exists before updating
  if (!(await trainingIdExists(id))) {
    throw new Error(`Training with id ${id} does not exist`);
  }

  // Log the parameters to the console
  console.log("Updating training to:", {
    title,
    description,
    validity_period,
    training_provider,
  });

  const [result] = await pool.query(
    "UPDATE trainings SET title = ?, description = ?, validity_period = ?, training_provider = ? WHERE id = ?",
    [title, description, validity_period, training_provider, id]
  );
  return result.affectedRows > 0 ? getTrainingByID(id) : null;
}
