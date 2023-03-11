import { NextFunction, Request, Response } from "express";
import CommonModel from "../model/CommonModel";
class TaskController {
  private commonModel;
  private idColumn: string = "taskId";

  constructor() {
    this.commonModel = new CommonModel("tasks", this.idColumn, [
      "taskId",
      "title",
    ]);
  }
  // ──────────────────────────────────────────────────────────────────────────────
  //   :::::: Task List : :  :   :    :     :      :       :
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
          [
            "taskId",
            "title",
            "createdAt",
            "status",
            "currentStatus",
            "priority",
            "scheduleDate",
          ]
        )),
        // total
        ([{ total }] = await this.commonModel.list(
          "boss_dk_api",
          filter,
          undefined,
          null,
          [`COUNT("taskId")::integer AS total`],
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
        message: `Task list`,
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
  //   :::::: Task Create : :  :   :    :     :      :       :
  // ──────────────────────────────────────────────────────────────────────────────

  create = async (req: Request, res: any, next: NextFunction) => {
    try {
      let { locale, ...inputData } = req.body;

      inputData = {
        ...inputData,
        createdBy: "user1",
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
        message: `Task Created`,
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

  update = async (req: Request, res: any, next: NextFunction) => {
    try {
      let { taskId, locale, ...inputData } = req.body;

      inputData = {
        ...inputData,
        updatedBy: "user1",
      };
      // create
      const data = await this.commonModel.update(
        "boss_dk_api",
        inputData,
        taskId
      );

      if (!data) {
        return next({
          statusbar: 404,
          errorCode: `something_not_working`,
          message: `Cannot update tasks. Please try again later!`,
        });
      }

      const result = {
        success: true,
        message: `Task updated`,
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

  delete = async (req: Request, res: any, next: NextFunction) => {
    try {
      // delete
      const { taskId } = req.body;

      const data = await this.commonModel.itemDelete("boss_dk_api", taskId);

      if (!data) {
        return next({
          statusbar: 404,
          errorCode: `something_not_working`,
          message: `Cannot deleted task. Please try again later!`,
        });
      }

      const result = {
        success: true,
        message: `Task deleted`,
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

export default new TaskController();
