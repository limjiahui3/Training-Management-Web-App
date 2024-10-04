import pool from "../models/database.js";
import {
  getSkillsReport,
  getFilteredSkillsReport,
} from "../models/skillsReportModel.js";

jest.mock('../models/database.js', () => ({
    query: jest.fn()
}))

describe('Unit Test: skillsReportDatabase.js Functions', () => {
    afterEach(() => {
        jest.clearAllMocks();
    })

    const mockSkillsReportData = [
        { employee_id: 1, employee_name: 'John Doe', training_course: 'Safety Training', validity: 'Valid' },
        { employee_id: 2, employee_name: 'Jane Smith', training_course: 'Quality Training', validity: 'Expired' },
        { employee_id: 3, employee_name: 'Alice Johnson', training_course: 'Safety Training', validity: 'NA' },
        { employee_id: 4, employee_name: 'Bob Brown', training_course: 'Leadership Training', validity: 'Valid' },
    ];

    test('getSkillsReport - should fetch all skills report data', async () => {
        pool.query.mockResolvedValueOnce([mockSkillsReportData]);

        const result = await getSkillsReport();
        console.log('getSkillsReport result:', result);
        expect(result).toEqual(mockSkillsReportData);
        expect(pool.query).toHaveBeenCalledWith(expect.any(String));
    });

    test('getFilteredSkillsReport - should fetch filtered skills report data by training and validity', async () => {
        const expectedData = [
            { employee_id: 1, employee_name: 'John Doe', training_course: 'Safety Training', validity: 'Valid' },
        ];

        pool.query.mockResolvedValueOnce([expectedData]);

        const filterParams = {
            training: 'Safety Training',
            validity: 'Valid'
        };

        const result = await getFilteredSkillsReport(filterParams);
        expect(result).toEqual(expectedData);
        expect(pool.query).toHaveBeenCalledWith(expect.any(String), ['Safety Training', 'Valid']);
    });

    test('getFilteredSkillsReport - should fetch filtered skills report data by training only', async () => {
        const expectedData = [
            { employee_id: 1, employee_name: 'John Doe', training_course: 'Safety Training', validity: 'Valid' },
            { employee_id: 3, employee_name: 'Alice Johnson', training_course: 'Safety Training', validity: 'NA' },
        ];

        pool.query.mockResolvedValueOnce([expectedData]);

        const filterParams = {
            training: 'Safety Training',
            validity: ''
        };

        const result = await getFilteredSkillsReport(filterParams);
        expect(result).toEqual(expectedData);
        expect(pool.query).toHaveBeenCalledWith(expect.any(String), ['Safety Training']);
    });

    test('getFilteredSkillsReport - should fetch filtered skills report data by validity only', async () => {
        const expectedData = [
            { employee_id: 1, employee_name: 'John Doe', training_course: 'Safety Training', validity: 'Valid' },
            { employee_id: 4, employee_name: 'Bob Brown', training_course: 'Leadership Training', validity: 'Valid' },
        ];

        pool.query.mockResolvedValueOnce([expectedData]);

        const filterParams = {
            training: '',
            validity: 'Valid'
        };

        const result = await getFilteredSkillsReport(filterParams);
        expect(result).toEqual(expectedData);
        expect(pool.query).toHaveBeenCalledWith(expect.any(String), ['Valid']);
    });

    test('getFilteredSkillsReport - should fetch all skills report data when no filters are applied', async () => {
        pool.query.mockResolvedValueOnce([mockSkillsReportData]);

        const filterParams = {
            training: '',
            validity: ''
        };

        const result = await getFilteredSkillsReport(filterParams);
        expect(result).toEqual(mockSkillsReportData);
        expect(pool.query).toHaveBeenCalledWith(expect.any(String), []);
    });
});
