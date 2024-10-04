import request from "supertest";
import express from "express";
import skillsReportRoutes from "../routes/skillsReportRoutes";

jest.mock("../models/skillsReportModel.js", () => ({
  getSkillsReport: jest.fn(),
  getFilteredSkillsReport: jest.fn(),
}));

jest.mock('../middleware/middleware.js', () => ({
  protect: jest.fn((req, res, next) => next())
}));

import {
  getSkillsReport,
  getFilteredSkillsReport,
} from "../models/skillsReportModel.js";

const app = express();
app.use(express.json());
app.use("/skills-report", skillsReportRoutes);

describe("Integration Test: Skills Report Routes", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("GET /skills-report - should fetch all skills report data", async () => {
    const mockData = [
      { employee_id: 1, employee_name: 'John Doe', training_course: 'Safety Training', validity: 'Valid' },
      { employee_id: 2, employee_name: 'Jane Smith', training_course: 'Quality Training', validity: 'Expired' },
      { employee_id: 3, employee_name: 'Alice Johnson', training_course: 'Advanced Safety', validity: 'NA' }
    ];
    getSkillsReport.mockResolvedValue(mockData);

    const res = await request(app).get('/skills-report');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockData);
  });

  test("GET /skills-report/filter - should fetch filtered skills report data by training and validity", async () => {
    const mockData = [
      { employee_id: 1, employee_name: 'John Doe', training_course: 'Safety Training', validity: 'Valid' },
    ];
    getFilteredSkillsReport.mockResolvedValue(mockData);

    const res = await request(app).get('/skills-report/filter?training=Safety Training&validity=Valid');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockData);
  });

  test("GET /skills-report/filter - should fetch filtered skills report data by training only", async () => {
    const mockData = [
      { employee_id: 1, employee_name: 'John Doe', training_course: 'Safety Training', validity: 'Valid' },
    ];
    getFilteredSkillsReport.mockResolvedValue(mockData);

    const res = await request(app).get('/skills-report/filter?training=Safety Training');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockData);
  });

  test("GET /skills-report/filter - should fetch filtered skills report data by validity only", async () => {
    const mockData = [
      { employee_id: 1, employee_name: 'John Doe', training_course: 'Safety Training', validity: 'Valid' },
    ];
    getFilteredSkillsReport.mockResolvedValue(mockData);

    const res = await request(app).get('/skills-report/filter?validity=Valid');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockData);
  });

  test("GET /skills-report/filter - should fetch all skills report data when no filters are applied", async () => {
    const mockData = [
      { employee_id: 1, employee_name: 'John Doe', training_course: 'Safety Training', validity: 'Valid' },
      { employee_id: 2, employee_name: 'Jane Smith', training_course: 'Quality Training', validity: 'Expired' },
      { employee_id: 3, employee_name: 'Alice Johnson', training_course: 'Advanced Safety', validity: 'NA' }
    ];
    getFilteredSkillsReport.mockResolvedValue(mockData);

    const res = await request(app).get('/skills-report/filter');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockData);
  });
});
