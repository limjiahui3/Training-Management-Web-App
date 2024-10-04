import bcrypt from 'bcryptjs';
import { generateToken } from '../auth_utils/jwt.js';
import fc from 'fast-check';
import {login} from "../models/loginController.js"
import request from "supertest";
import express from "express";
import loginRoutes from "../routes/loginRoutes.js"

jest.mock("../models/loginController.js", () => ({
    login: jest.fn()
  }));

jest.mock("../middleware/middleware.js", () => ({
    protect: (req, res, next) => next(),
}));

jest.mock('bcryptjs', () => ({
    compare: jest.fn(),
  }));
  
jest.mock('../auth_utils/jwt.js', () => ({
    generateToken: jest.fn(),
  }));
  

  beforeEach(() => {
    jest.clearAllMocks();
    app = express();
    app.use(express.json());
    app.use("/login", loginRoutes);
  });

describe("Unit Test: login Routes", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    test("POST /login - should call login controller", async () => {
        login.mockImplementation((req, res) => {
          res.json({ token: "mock-token" });
        });
    
        const res = await request(app)
          .post("/login")
          .send({ username: "testuser", password: "testpass" });
    
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ token: "mock-token" });
        expect(login).toHaveBeenCalled();
    });

    test("POST /login - should handle login failure", async () => {
        login.mockImplementation((req, res) => {
          res.status(401).json({ message: "Invalid username or password" });
        });

        //sending does not impact the test, simply done for realism
        const res = await request(app)
          .post("/login")
          .send({ username: "wronguser", password: "wrongpass" });
    
        expect(res.status).toBe(401);
        expect(res.body).toEqual({ message: "Invalid username or password" });
        expect(login).toHaveBeenCalled();
      });

      test("POST /login - should handle server error", async () => {
        login.mockImplementation((req, res) => {
          res.status(500).json({ message: "Server error" });
        });

        //sending does not impact the test, simply done for realism
        const res = await request(app)
          .post("/login")
          .send({ username: "testuser", password: "testpass" });    
    
        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: "Server error" });
        expect(login).toHaveBeenCalled();
      });
    
      test("should log access to loginRoute", async () => {
        const consoleSpy = jest.spyOn(console, 'log');
        
        login.mockImplementation((req, res) => {
          res.json({ token: "mock-token" });
        });
    
        await request(app)
          .post("/login")
          .send({ username: "testuser", password: "testpass" });
    
        expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("LoginRoute accessed: /login"));
        expect(consoleSpy).toHaveBeenCalledWith("Login POST route");
    
        consoleSpy.mockRestore();
      });

})


