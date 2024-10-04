import pool from "../models/database.js";
import { 
    getEmployeeDetails,
    getRelevantCourses, 
    getTrainingDates, 
    getCombinedEmployeeTrainingDetails,
    getPercentageValidEmployees,
    getTrainingStats
} from "../models/dashboardModel.js";

jest.mock('../models/database.js', () => ({
    query: jest.fn()
}));

const mockEmployeeDetails = [
    { employee_id: 1, employee_name: 'John Doe', designation: 'Material Planner' },
    { employee_id: 2, employee_name: 'Jane Smith', designation: 'Production Machining HOD' }
];
const mockRelevantCourses = [
    { employee_id: 1, training_id: 2, validity: 'Valid', title: 'COUNTERFEIT' },
    { employee_id: 2, training_id: 3, validity: 'NA', title: 'FOD' }
];
const mockTrainingDates = [
    { employee_id: 1, training_id: 2, title: 'COUNTERFEIT', latest_end_date: '2024-07-01', expiry_date: '2025-07-01', scheduled_date: null },
    { employee_id: 2, training_id: 3, title: 'FOD', latest_end_date: null, expiry_date: null, scheduled_date: '2024-10-15' }
];

describe('Unit Tests: dashboardDatabase.js Functions', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('getEmployeeDetails - should return employee details', async () => {    
      pool.query.mockResolvedValueOnce([mockEmployeeDetails]);
      const result = await getEmployeeDetails();
      expect(result).toEqual(mockEmployeeDetails);
    });

    test('getEmployeeDetails - should throw error for null values ', async () => {
        pool.query.mockResolvedValueOnce(null);
        await expect(getEmployeeDetails()).rejects.toThrow('No employee details found');
    });

    test('getEmployeeDetails - should throw error for empty array', async () => {
        pool.query.mockResolvedValueOnce([]);
        await expect(getEmployeeDetails()).rejects.toThrow('No employee details found');
    });

    test('getRelevantCourses - should return relevant courses', async () => {
        pool.query.mockResolvedValueOnce([mockRelevantCourses]);
        const result = await getRelevantCourses();
        expect(result).toEqual(mockRelevantCourses);
    });

    test('getRelevantCourses - should throw error for null values', async () => {
        pool.query.mockResolvedValueOnce(null);
        await expect(getRelevantCourses()).rejects.toThrow('No relevant courses found');
    });

    test('getRelevantCourses - should throw error for empty array', async () => {
        pool.query.mockResolvedValueOnce([]);
        await expect(getRelevantCourses()).rejects.toThrow('No relevant courses found');
    });

    test('getTrainingDates - should return training dates', async () => {
        pool.query.mockResolvedValueOnce([mockTrainingDates]);
        const result = await getTrainingDates();
        expect(result).toEqual(mockTrainingDates);
    });

    test('getTrainingDates - should throw error for null values', async () => {
        pool.query.mockResolvedValueOnce(null);
        await expect(getTrainingDates()).rejects.toThrow('No training dates found');
    });

    test('getTrainingDates - should throw error for empty array', async () => {
        pool.query.mockResolvedValueOnce([]);
        await expect(getTrainingDates()).rejects.toThrow('No training dates found');
    });

    test('getCombinedEmployeeTrainingDetails - should return combined employee training details', async () => {
        pool.query.mockResolvedValueOnce([mockEmployeeDetails]);
        pool.query.mockResolvedValueOnce([mockRelevantCourses]);
        pool.query.mockResolvedValueOnce([mockTrainingDates]);
        const result = await getCombinedEmployeeTrainingDetails();
        const expected = [
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
        expect(result).toEqual(expected);
    });

    test('getCombinedEmployeeTrainingDetails - should throw error when getEmployeeDetails returns null', async () => {
        pool.query.mockResolvedValueOnce(null);
        await expect(getCombinedEmployeeTrainingDetails()).rejects.toThrow('No employee details found');
    });

    test('getCombinedEmployeeTrainingDetails - should throw error when getRelevantCourses returns null', async () => {
        pool.query.mockResolvedValueOnce([mockEmployeeDetails]);
        pool.query.mockResolvedValueOnce(null);
        await expect(getCombinedEmployeeTrainingDetails()).rejects.toThrow('No relevant courses found');
    });

    test('getCombinedEmployeeTrainingDetails - should throw error when getTrainingDates returns null', async () => {
        pool.query.mockResolvedValueOnce([mockEmployeeDetails]);
        pool.query.mockResolvedValueOnce([mockRelevantCourses]);
        pool.query.mockResolvedValueOnce(null);
        await expect(getCombinedEmployeeTrainingDetails()).rejects.toThrow('No training dates found');
    });

    test('getCombinedEmployeeTrainingDetails - should throw error when getEmployeeDetails returns empty array', async () => {
        pool.query.mockResolvedValueOnce([]);
        await expect(getCombinedEmployeeTrainingDetails()).rejects.toThrow('No employee details found');
    });

    test('getCombinedEmployeeTrainingDetails - should throw error when getRelevantCourses returns empty array', async () => {
        pool.query.mockResolvedValueOnce([mockEmployeeDetails]);
        pool.query.mockResolvedValueOnce([]);
        await expect(getCombinedEmployeeTrainingDetails()).rejects.toThrow('No relevant courses found');
    });

    test('getCombinedEmployeeTrainingDetails - should throw error when getTrainingDates returns empty array', async () => {
        pool.query.mockResolvedValueOnce([mockEmployeeDetails]);
        pool.query.mockResolvedValueOnce([mockRelevantCourses]);
        pool.query.mockResolvedValueOnce([]);
        await expect(getCombinedEmployeeTrainingDetails()).rejects.toThrow('No training dates found');
    });

    test('getPercentageValidEmployees - should return percentage of valid employees', async () => {
        pool.query.mockResolvedValueOnce([mockEmployeeDetails]);
        pool.query.mockResolvedValueOnce([mockRelevantCourses]);
        const result = await getPercentageValidEmployees();
        const expectedPercentage = ((1 / 2) * 100).toFixed(2);
        expect(result).toBe(expectedPercentage);
    });

    test('getPercentageValidEmployees - should throw error when getEmployeeDetails returns null', async () => {
        pool.query.mockResolvedValueOnce(null);
        await expect(getPercentageValidEmployees()).rejects.toThrow('No employee details found');
    });

    test('getPercentageValidEmployees - should throw error when getRelevantCourses returns null', async () => {
        pool.query.mockResolvedValueOnce([mockEmployeeDetails]);
        pool.query.mockResolvedValueOnce(null);
        await expect(getPercentageValidEmployees()).rejects.toThrow('No relevant courses found');
    });

    test('getPercentageValidEmployees - should throw error when getEmployeeDetails returns empty array', async () => {
        pool.query.mockResolvedValueOnce([]);
        await expect(getPercentageValidEmployees()).rejects.toThrow('No employee details found');
    });

    test('getPercentageValidEmployees - should throw error when getRelevantCourses returns empty array', async () => {
        pool.query.mockResolvedValueOnce([mockEmployeeDetails]);
        pool.query.mockResolvedValueOnce([]);
        await expect(getPercentageValidEmployees()).rejects.toThrow('No relevant courses found');
    });

    test('getTrainingStats - should return training stats', async () => {
        const mockRelevantCourses = [
            { employee_id: 1, training_id: 2, validity: 'Valid', title: 'COUNTERFEIT' },
            { employee_id: 2, training_id: 3, validity: 'NA', title: 'FOD' },
            { employee_id: 1, training_id: 3, validity: 'Valid', title: 'FOD' }
        ];
        pool.query.mockResolvedValueOnce([mockRelevantCourses]);
        const result = await getTrainingStats();
        const expectedStats = {
            'COUNTERFEIT': {
                numberOfEmployeesWithValid: '1',
                numberOfEmployeesWithTraining: '1'
            },
            'FOD': {
                numberOfEmployeesWithValid: '1',
                numberOfEmployeesWithTraining: '2'
            }
        };
        expect(result).toEqual(expectedStats);
    });

    test('getTrainingStats - should throw error when getRelevantCourses returns null', async () => {
        pool.query.mockResolvedValueOnce(null);
        await expect(getTrainingStats()).rejects.toThrow('No relevant courses found');
    });

    test('getTrainingStats - should throw error when getRelevantCourses returns empty array', async () => {
        pool.query.mockResolvedValueOnce([]);
        await expect(getTrainingStats()).rejects.toThrow('No relevant courses found');
    });
});