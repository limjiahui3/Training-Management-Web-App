import pool from "./database.js";

// Get all skills report
export async function getSkillsReport() {
  const [rows] = await pool.query(`
    SELECT 
      e.id AS employee_id,
      e.name AS employee_name,
      t.title AS training_course,
      rt.validity AS validity
    FROM 
      employees e
    JOIN 
      employees_trainings et ON e.id = et.employee_id
    JOIN 
      trainings t ON et.training_id = t.id
    JOIN 
      relevant_trainings rt ON e.id = rt.employee_id AND t.id = rt.training_id
  `);
  return rows;
}

// Get filtered skills report
export async function getFilteredSkillsReport({ training, validity }) {
  let query = `
    SELECT 
      e.id AS employee_id,
      e.name AS employee_name,
      t.title AS training_course,
      rt.validity AS validity
    FROM 
      employees e
    JOIN 
      employees_trainings et ON e.id = et.employee_id
    JOIN 
      trainings t ON et.training_id = t.id
    JOIN 
      relevant_trainings rt ON e.id = rt.employee_id AND t.id = rt.training_id
    WHERE 1=1
  `;
  const queryParams = [];

  if (training) {
    query += ' AND t.title = ?';
    queryParams.push(training);
  }
  if (validity) {
    query += ' AND rt.validity = ?';
    queryParams.push(validity);
  }

  const [rows] = await pool.query(query, queryParams);
  return rows;
}
