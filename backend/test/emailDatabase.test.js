import pool from '../models/database.js';
import {getExpiringTrainings} from "../models/relevantTrainingsModel.js";
import {getUpcomingTrainings} from "../models/trainingSessionModel.js";

// Mock the pool.query method
jest.mock('../models/database.js', () => ({
  query: jest.fn(),
}));

describe('Unit Testing: Trainings Database Functions. Mock data modular dates', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('getExpiringTrainings - should return all trainings expiring this month', async () => {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const mockTrainings = [
      {
        session_id: 1,
        employee_id: 1,
        training_id: 1,
        status: 'Completed',
        start_date: '2022-10-01',
        end_date: '2022-10-02',
        expiry_date: firstDayOfMonth.toISOString().split('T')[0],
        employee_name: 'John Doe',
        training_title: 'Safety Training'
      },
      {
        session_id: 2,
        employee_id: 2,
        training_id: 2,
        status: 'Completed',
        start_date: '2022-10-01',
        end_date: '2022-10-02',
        expiry_date: lastDayOfMonth.toISOString().split('T')[0],
        employee_name: 'Jane Smith',
        training_title: 'First Aid Training'
      },
    ];
    pool.query.mockResolvedValueOnce([mockTrainings]);

    const result = await getExpiringTrainings();
    expect(result).toEqual(mockTrainings);
  });

  test('getUpcomingTrainings - should return all upcoming training sessions in exactly 3 days', async () => {
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

    const mockTrainings = [
      {
        session_id: 1,
        employee_id: 1,
        training_id: 1,
        status: 'Scheduled',
        start_date: threeDaysFromNow.toISOString().split('T')[0],
        end_date: '2024-08-15',
        expiry_date: '2025-08-29',
        employee_name: 'John Doe',
        employee_email: 'john@example.com',
        training_title: 'Safety Training'
      },
      {
        session_id: 2,
        employee_id: 2,
        training_id: 2,
        status: 'Scheduled',
        start_date: threeDaysFromNow.toISOString().split('T')[0],
        end_date: '2024-08-15',
        expiry_date: '2025-08-29',
        employee_name: 'Jane Smith',
        employee_email: 'jane@example.com',
        training_title: 'First Aid Training'
      },
    ];
    pool.query.mockResolvedValueOnce([mockTrainings]);

    const result = await getUpcomingTrainings();
    expect(result).toEqual(mockTrainings);
  });
});
