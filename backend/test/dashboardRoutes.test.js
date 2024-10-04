import request from 'supertest';
import express from 'express';
import { getDashboardData, getPercentage, getNumbers } from '../routes/dashboardRoutes.js';
import { getEmployeeDetails, getRelevantCourses, getTrainingDates, getCombinedEmployeeTrainingDetails, getPercentageValidEmployees, getTrainingStats} from "../models/dashboardModel.js";

jest.mock('../models/dashboardModel.js');
jest.mock('../middleware/middleware.js', () => ({
  protect: (req, res, next) => next()
}));

describe('Unit Tests: Dashboard Routes Functions ', () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn()
    };
  });

  test('getDashboardData should return combined employee training details with status 200', async () => {
    const mockCombinedEmployeeTrainingDetails = [
        {
          employee_id: 1,
          employee_name: 'John Doe',
          designation: 'Material Planner',
          relevantTrainings: [
            {
              validity: 'Valid',
              title: 'COUNTERFEIT',
              latest_end_date: '2024-07-01',
              expiry_date: '2025-07-01',
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
              scheduled_date: '2024-10-15'
            }
          ]
        }
      ];
    getCombinedEmployeeTrainingDetails.mockResolvedValue(mockCombinedEmployeeTrainingDetails);
    await getDashboardData(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(mockCombinedEmployeeTrainingDetails);
  });

  test('getDashboardData should handle null values and return status 500', async () => {
    getCombinedEmployeeTrainingDetails.mockResolvedValue(null);
    await getDashboardData(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith({ message: 'No combined employee training details found' });
  });

  test('getDashboardData should handle empty array and return status 500', async () => {
    getCombinedEmployeeTrainingDetails.mockResolvedValue([]);
    await getDashboardData(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith({ message: 'No combined employee training details found' });
  });

  test('getPercentage should return percentage of valid employees with status 200', async () => {
    getPercentageValidEmployees.mockResolvedValue('50.00');
    await getPercentage(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({"percentageValidEmployees": "50.00"});
  });

  test('getPercentage should handle null values and return status 500', async () => {
    getPercentageValidEmployees.mockResolvedValue(null);
    await getPercentage(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith({ message: 'Error calculating percentage of valid employees' });
  });

  test('getNumbers should return training stats with status 200', async () => {
    const mockTrainingStats = {
        'COUNTERFEIT': {
            numberOfEmployeesWithValid: '1',
            numberOfEmployeesWithTraining: '1'
        },
        'FOD': {
            numberOfEmployeesWithValid: '1',
            numberOfEmployeesWithTraining: '2'
        }
    };
    getTrainingStats.mockResolvedValue(mockTrainingStats);
    await getNumbers(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockTrainingStats);
  });

  test('getNumbers should handle null values and return status 500', async () => {
    getTrainingStats.mockResolvedValue(null);
    await getNumbers(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith({ message: 'No training stats found' });
  });
});