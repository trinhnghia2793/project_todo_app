import express from 'express';
import {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask
} from "../controllers/tasksControllers.js";

const router = express.Router();

// CRUD Endpoint
router.get("/", getAllTasks);

router.post("/", createTask);

router.put("/:id", updateTask);

router.delete("/:id", deleteTask);

export default router;