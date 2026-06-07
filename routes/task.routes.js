// GET /api/tasks
// GET /api/tasks/:id
// POST /api/tasks
// PUT /api/tasks/:id
// DELETE /api/tasks/:id
// PATCH /api/tasks/:id/status
import express from "express";
import { CheckUserId } from "../middlewares/verifyUser.middleware.js";
import {
  taskCreated,
  taskDelete,
  taskfilterBypriority,
  taskListGet,
  taskParticular,
  taskUpdated,
} from "../controllers/task.controller.js";
const taskRouter = express.Router();

taskRouter.get("/", CheckUserId, taskListGet);
taskRouter.get("/sorted", CheckUserId, taskfilterBypriority);

taskRouter.get("/:id", CheckUserId, taskParticular);
taskRouter.post("/", CheckUserId, taskCreated);
taskRouter.delete("/:id", CheckUserId, taskDelete);
taskRouter.patch("/:id/status", CheckUserId, taskUpdated);

export default taskRouter;
