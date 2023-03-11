import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import CommonModel from "../model/CommonModel";
class AuthController {
  private commonModel;
  private idColumn: string = "userId";

  constructor() {
    this.commonModel = new CommonModel("users", this.idColumn, ["userId"]);
  }
  // ──────────────────────────────────────────────────────────────────────────────
  //   :::::: Sign up : :  :   :    :     :      :       :
  // ──────────────────────────────────────────────────────────────────────────────
  signUp = async (req: Request, res: any, next: NextFunction) => {
    try {
      let { ...inputData } = req.body;

      (inputData.password = await bcrypt.hash(inputData.password, 10)),
        (inputData = {
          ...inputData,
          createdBy: null,
        });

      // create
      const data = await this.commonModel.bulkCreate("boss_dk_api", [
        inputData,
      ]);
      if (!data) {
        return next({
          statusbar: 404,
          errorCode: `something_not_working`,
          message: `Cannot Create. Please try again later!`,
        });
      }

      const result = {
        success: true,
        message: `User Created`,
        data,
      };

      return res.json(result);
    } catch (error) {
      res.json({
        status: 500,
        message: error?.toString(),
        code: "unexpected_error",
      });
      return;
    }
  };
  // ──────────────────────────────────────────────────────────────────────────────
  //   :::::: Sign in : :  :   :    :     :      :       :
  // ──────────────────────────────────────────────────────────────────────────────

  signIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      console.log(req.body);

      const verifyEmailData = await this.commonModel.list(
        { email: email },
        null,
        null,
        ["name", "email"]
      );
      if (!email) {
        return console.error(`Email missing or doesn't exit with us!`);
      }
      const comparePassword = await bcrypt.compare(
        password,
        verifyEmailData.password
      );
      if (!verifyEmailData) {
        return console.error(`Password missing or doesn't exit with us!`);
      }

      const result = {
        success: true,
        data: verifyEmailData[0],
      };
    } catch (error) {
      next();
    }
  };
}

export default new AuthController();
