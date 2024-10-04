import pool from "../database.js";

// Check if an employee ID exists
export async function employeeIdExists(id) {
  const [rows] = await pool.query(
    "SELECT COUNT(*) as count FROM employees WHERE id = ?",
    [id]
  );
  return rows[0].count > 0;
}

// Get all employees
export async function getEmployees() {
  const [rows] = await pool.query("SELECT * FROM employees");
  return rows;
}

// Get an employee by ID
export async function getEmployeeByID(id) {
  const [rows] = await pool.query("SELECT * FROM employees WHERE id = ?", [id]);
  return rows[0];
}

export async function createEmployee(id, name, email, hire_date, designation) {
  // Check if the employee ID already exists
  if (await employeeIdExists(id)) {
    throw new Error(`Employee with id ${id} already exists`);
  }

  await pool.query(
    "INSERT INTO employees (id, name, email, hire_date, designation) VALUES (?, ?, ?, ?, ?)",
    [id, name, email, hire_date, designation]
  );

  return getEmployeeByID(id);
}

// Delete an employee
export async function deleteEmployee(id) {
  const [result] = await pool.query("DELETE FROM employees WHERE id = ?", [id]);
  return result.affectedRows > 0 ? "Delete Successful" : "Employee not found";
}

// Update an existing employee
export async function updateEmployee(
  id,
  name,
  email,
  hire_date,
  designation
) {
  // Check if the employee ID exists before updating
  if (!(await employeeIdExists(id))) {
    throw new Error(`Employee with id ${id} does not exist`);
  }

  const [result] = await pool.query(
    "UPDATE employees SET name = ?, email = ?, hire_date = ?, designation = ? WHERE id = ?",
    [name, email, hire_date, designation, id]
  );
  return result.affectedRows > 0 ? getEmployeeByID(id) : null;
}
