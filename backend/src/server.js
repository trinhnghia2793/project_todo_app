import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from "./config/db.js";
import taskRoute from './routes/tasksRouters.js';
import cors from 'cors';

dotenv.config();
const PORT = process.env.PORT || 5001;
const app = express();

// middlewares
app.use(express.json()); // middleware: check if data is json --> change to object 
app.use(cors({ origin: "http://localhost:5173" }));

app.use("/api/tasks", taskRoute);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server starts on port ${PORT}`);
  });
});
