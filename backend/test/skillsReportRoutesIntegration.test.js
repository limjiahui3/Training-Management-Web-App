import request from 'supertest';
import express from 'express';
import skillsReportRoutes from '../routes/skillsReportRoutes.js';
import pool from '../models/database.js';

jest.mock('../middleware/middleware.js', () => ({
    protect: (req, res, next) => next(),
}));

const app = express();
app.use(express.json());
app.use('/skillsReport', skillsReportRoutes);

describe('Integration Test: Skills Report Routes', () => {
    const mockEmployees = [
        { id: 1000, name: 'John Doe' },
        { id: 1001, name: 'Jane Smith' },
    ];

    const mockTrainings = [
        { id: 1000, title: 'Safety Training' },
        { id: 1001, title: 'Quality Training' },
    ];

    const mockEmployeeTrainings = [
        { employee_id: 1000, training_id: 1000, status: 'Completed' },
        { employee_id: 1001, training_id: 1001, status: 'Completed' },
    ];

    const mockRelevantTrainings = [
        { employee_id: 1000, training_id: 1000, validity: 'Valid' },
        { employee_id: 1001, training_id: 1001, validity: 'Expired' },
    ];

    beforeEach(async () => {
        console.log('Inserting mock data...')
        await pool.query("INSERT INTO employees (id, name) VALUES ?", [mockEmployees.map(e => [e.id, e.name])]);
        await pool.query("INSERT INTO trainings (id, title) VALUES ?", [mockTrainings.map(t => [t.id, t.title])]);
        await pool.query("INSERT INTO employees_trainings (employee_id, training_id, status) VALUES ?", [mockEmployeeTrainings.map(et => [et.employee_id, et.training_id, et.status])]);
        await pool.query("INSERT INTO relevant_trainings (employee_id, training_id, validity) VALUES ?", [mockRelevantTrainings.map(rt => [rt.employee_id, rt.training_id, rt.validity])]);
    });

    afterEach(async () => {
        console.log('Deleting mock data...')
        await pool.query("DELETE FROM relevant_trainings WHERE employee_id IN (?, ?)", [1000, 1001]);
        await pool.query("DELETE FROM employees_trainings WHERE employee_id IN (?, ?)", [1000, 1001]);
        await pool.query("DELETE FROM trainings WHERE id IN (?, ?)", [1000, 1001]);
        await pool.query("DELETE FROM employees WHERE id IN (?, ?)", [1000, 1001]);
    });

    afterAll(async () => {
        await pool.end();
    });

    test('GET /skillsReport - should fetch all skills report data', async () => {
        const expectedData = [
            { employee_id: 1000, employee_name: 'John Doe', training_course: 'Safety Training', validity: 'Valid' },
            { employee_id: 1001, employee_name: 'Jane Smith', training_course: 'Quality Training', validity: 'Expired' },
        ];

        const response = await request(app).get('/skillsReport');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(expect.arrayContaining(expectedData));
    });

    test('GET /skillsReport/filter - should fetch filtered skills report data by training and validity', async () => {
        const filterParams = {
            training: 'Safety Training',
            validity: 'Valid'
        };
        const expectedData = [
            { employee_id: 1000, employee_name: 'John Doe', training_course: 'Safety Training', validity: 'Valid' },
        ];

        const response = await request(app).get('/skillsReport/filter').query(filterParams);
        expect(response.status).toBe(200);
        expect(response.body).toEqual(expectedData);
    });

    test('GET /skillsReport/filter - should fetch filtered skills report data by training only', async () => {
        const filterParams = {
            training: 'Safety Training',
            validity: ''
        };
        const expectedData = [
            { employee_id: 1000, employee_name: 'John Doe', training_course: 'Safety Training', validity: 'Valid' },
        ];

        const response = await request(app).get('/skillsReport/filter').query(filterParams);
        expect(response.status).toBe(200);
        expect(response.body).toEqual(expectedData);
    });

    test('GET /skillsReport/filter - should fetch filtered skills report data by validity only', async () => {
        const filterParams = {
            training: '',
            validity: 'Valid'
        };
        const expectedData = [
            { employee_id: 1000, employee_name: 'John Doe', training_course: 'Safety Training', validity: 'Valid' },
        ];

        const response = await request(app).get('/skillsReport/filter').query(filterParams);
        expect(response.status).toBe(200);
        expect(response.body).toEqual(expect.arrayContaining(expectedData));
    });

    test('GET /skillsReport/filter - should fetch all skills report data when no filters are applied', async () => {
        const filterParams = {
            training: '',
            validity: ''
        };
        const expectedData = [
            { employee_id: 1000, employee_name: 'John Doe', training_course: 'Safety Training', validity: 'Valid' },
            { employee_id: 1001, employee_name: 'Jane Smith', training_course: 'Quality Training', validity: 'Expired' },
        ];

        const response = await request(app).get('/skillsReport/filter').query(filterParams);
        expect(response.status).toBe(200);
        expect(response.body).toEqual(expect.arrayContaining(expectedData));
    });
});
