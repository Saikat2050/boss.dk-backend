import { Router } from "express";
import UserController from "../controller/UserController";

const router = Router();

router.post("/list", UserController.list);
router.post("/create", UserController.create);

export default router;
