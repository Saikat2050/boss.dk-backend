import { Router } from "express";
import { TaskRouter, ReportTabRouter, UserRouter } from ".";
import AuthController from "../controller/AuthController";

const router = Router();

router.use("/task", TaskRouter);
router.use("/report-tab", ReportTabRouter);
router.use("/auth", AuthController.signUp);

export default router;
