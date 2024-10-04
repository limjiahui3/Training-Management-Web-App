import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mainRoutes from "./routes/routes.js";
import loginRoutes from "./routes/loginRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import pool from "./models/database.js";
import morgan from "morgan";
import "./scheduler/autoNotificationScheduler.js";
import "./scheduler/certificationValidityCheck.js";

dotenv.config({ path: "../.env" }); //.env contains JWT key
console.log("JWT_SECRET in index.js:", process.env.JWT_SECRET);
const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); // Enable CORS for all requests
app.use(morgan("dev")); // Log all requests to the console for debug

const PORT = process.env.PORT || 3000; //both are 3000, but added OR syntax to avoid error

// Option 2: Allow Custom Origins
// app.use(
//   cors({
//     origin: 'http://localhost:3000',
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     allowedHeaders: ['Content-Type'],
//   })
// );

app.get("/", (req, res) => {
  // console.log(req);
  return res.status(234).send("Welcome To Training Management App");
});

app.use(
  "/api",
  (req, res, next) => {
    // console.log("MainRoutes middleware"); // Log every request to the mainRoutes middleware
    next();
  },
  mainRoutes
);

// Unknown route handler
app.use((req, res) => {
  console.log(`Route not found: ${req.originalUrl}`);
  res.status(404).json({
    message: "Route not found",
  });
});

// app.use("/dashboard", dashboardRoutes);

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  const connection = await pool.getConnection();
  console.log("Database connection successful");
  connection.release();
});
