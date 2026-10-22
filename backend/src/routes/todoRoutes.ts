import { Router } from "express";
import {
  createTodo,
  deleteTodo,
  getTodoById,
  getTodos,
  updateTodo,
} from "../controllers/todoController";
import { verifyToken } from "../middlewares/authMiddleware";
import {
  validateIdParam,
  validatePagination,
  validateTodo,
  validateUpdateTodo,
} from "../middlewares/validator";

const router = Router();

// Semua rute todo wajib login
router.use(verifyToken);

router.get("/", validatePagination, getTodos);
router.get("/:id", validateIdParam, getTodoById);
router.post("/", validateTodo, createTodo);
router.put("/:id", validateIdParam, validateUpdateTodo, updateTodo);
router.delete("/:id", validateIdParam, deleteTodo);

export default router;
