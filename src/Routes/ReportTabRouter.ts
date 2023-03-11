import { Router } from "express";
import ReportTabController from "../controller/ReportTabController";

const router = Router();

router.post("/list", ReportTabController.list);
router.post("/create", ReportTabController.create);

export default router;
