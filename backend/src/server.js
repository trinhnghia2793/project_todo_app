import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from "./config/db.js";
import taskRoute from './routes/tasksRouters.js';
import cors from 'cors';
import path from 'path';

dotenv.config();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

const app = express();

// middlewares
app.use(express.json()); // middleware: check if data is json --> change to object 

// development middleware
if(process.env.NODE_ENV !== "production") {
  app.use(cors({ origin: "http://localhost:5173" }));
}

app.use("/api/tasks", taskRoute);

// production middleware
if(process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, "../frontend/dist"))); // get code from frontend/dist

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server starts on port ${PORT}`);
  });
});
