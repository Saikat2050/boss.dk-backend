import { NextFunction, Request, Response } from "express";
import CommonModel from "../model/CommonModel";
class UserController {
  private commonModel;
  private idColumn: string = "userId";

  constructor() {
    this.commonModel = new CommonModel("users", this.idColumn, [
      "userId",
      "name",
    ]);
  }
  // ──────────────────────────────────────────────────────────────────────────────
  //   :::::: User List : :  :   :    :     :      :       :
  // ──────────────────────────────────────────────────────────────────────────────

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let { filter, range, sort } = req.body;

      filter =
        [undefined, null].indexOf(req.body.filter) < 0
          ? JSON.parse(req.body.filter)
          : null;
      range =
        [undefined, null].indexOf(req.body.range) < 0
          ? JSON.parse(req.body.range)
          : null;
      sort =
        [undefined, null].indexOf(req.body.sort) < 0
          ? JSON.parse(req.body.sort)
          : null;

      let data;
      let total: number;
      Promise.all([
        (data = await this.commonModel.list(
          "boss_dk_api",
          filter,
          range,
          sort,
          ["userId", "name", "status", "createdAt"]
        )),
        // total
        ([{ total }] = await this.commonModel.list(
          "boss_dk_api",
          filter,
          undefined,
          null,
          [`COUNT("userId")::integer AS total`],
          true
        )),
      ]);

      // total pages
      let pageSize: number = range?.pageSize ?? 100;
      pageSize = pageSize === 0 ? 100 : pageSize;
      const pageCount: number = Math.ceil(total / pageSize);

      // result
      const result = {
        success: true,
        message: `User list`,
        total,
        meta: {
          page: range?.page ?? 1,
          pageSize,
          pageCount,
        },
        data,
      };
      // result return
      return res.json(result);
    } catch (error) {
      next(error);
    }
  };

  // ──────────────────────────────────────────────────────────────────────────────
  //   :::::: Report tab Create : :  :   :    :     :      :       :
  // ──────────────────────────────────────────────────────────────────────────────

  create = async (req: Request, res: any, next: NextFunction) => {
    try {
      let { ...inputData } = req.body;

      inputData = {
        ...inputData,
        createdBy: "user1", // Enter here if any new
      };

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
}

export default new UserController();
