import { Router } from "express";
import AuthController from "../controller/AuthController";

const router = Router();

router.post("/sign-in", AuthController.signIn);
router.post("/sign-up", AuthController.signUp);

export default router;
