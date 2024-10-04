import pool from "../models/database.js";
import {
  employeeIdExists,
  getEmployees,
  getEmployeeByID,
  createEmployee,
  deleteEmployee,
  updateEmployee,
} from "../models/employeeModels/employeeModel.js";

jest.mock('../models/database.js', () => ({
    query: jest.fn()
}))

describe('Unit Test: Employee Database Functions', () => {
    afterEach(() => {
        jest.clearAllMocks();
    })

    test("employeeIdExists - return true if employee ID exists", async() => {
        pool.query.mockResolvedValueOnce([[{count: 1}]]);
        const result = await employeeIdExists(1);
        expect(result).toBe(true);
    })
    test("employeeIdExists - return false if employee ID does not exist", async() => {
        pool.query.mockResolvedValueOnce([[{count: 0}]]);
        const result = await employeeIdExists(1);
        expect(result).toBe(false);
    })
    test('getEmployees - should return all employees', async () => {
        const mockEmployees = [
          { id: 1, name: 'John Doe' },
          { id: 2, name: 'Jane Smith' }
        ];
        pool.query.mockResolvedValueOnce([mockEmployees]);
        const result = await getEmployees();
        expect(result).toEqual(mockEmployees);
      });
      test('getEmployeeByID - should return an employee by ID', async () => {
        const mockEmployee = { id: 1, name: 'John Doe' };
        pool.query.mockResolvedValueOnce([[mockEmployee]]);
        const result = await getEmployeeByID(1);
        expect(result).toEqual(mockEmployee);
      });
      test('createEmployee - should throw an error if employee ID exists', async () => {
        pool.query.mockResolvedValueOnce([[{ count: 1 }]]);
        await expect(createEmployee(1, 'John Doe', 'john@example.com', '2023-07-28', 'Engineer'))
          .rejects
          .toThrow('Employee with id 1 already exists');
      });
      test('createEmployee - should create a new employee if ID does not exist', async () => {
        pool.query.mockResolvedValueOnce([[{ count: 0 }]]);
        pool.query.mockResolvedValueOnce([{ insertId: 1 }]);
        pool.query.mockResolvedValueOnce([[{ id: 1, name: 'John Doe' }]]);
        const result = await createEmployee(1, 'John Doe', 'john@example.com', '2023-07-28', 'Engineer');
        expect(result).toEqual({ id: 1, name: 'John Doe' });
      });
      test('deleteEmployee - should delete an employee and return success message', async () => {
        pool.query.mockResolvedValueOnce([{ affectedRows: 1 }]);
        const result = await deleteEmployee(1);
        expect(result).toBe('Delete Successful');
      });
    
      test('deleteEmployee - should return not found message if employee does not exist', async () => {
        pool.query.mockResolvedValueOnce([{ affectedRows: 0 }]);
        const result = await deleteEmployee(1);
        expect(result).toBe('Employee not found');
      });
      test('updateEmployee - should throw an error if employee ID does not exist', async () => {
        pool.query.mockResolvedValueOnce([[{ count: 0 }]]);
        await expect(updateEmployee(1, 'John Doe', 'john@example.com', '2023-07-28', 'Engineer'))
          .rejects
          .toThrow('Employee with id 1 does not exist');
      });
    
      test('updateEmployee - should update an existing employee', async () => {
        pool.query.mockResolvedValueOnce([[{ count: 1 }]]);
        pool.query.mockResolvedValueOnce([{ affectedRows: 1 }]);
        pool.query.mockResolvedValueOnce([[{ id: 1, name: 'John Doe' }]]);
        const result = await updateEmployee(1, 'John Doe', 'john@example.com', '2023-07-28', 'Engineer');
        expect(result).toEqual({ id: 1, name: 'John Doe' });
      });
})