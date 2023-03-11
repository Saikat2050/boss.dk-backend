import { Router } from "express";
import TaskController from "../controller/TaskController";

const router = Router();

router.post("/list", TaskController.list);
router.post("/create", TaskController.create);
router.post("/update", TaskController.update);
router.post("/delete", TaskController.delete);

export default router;
