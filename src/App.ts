require("dotenv").config();
import express, { Application, NextFunction, Request, Response } from "express";
import router from "./Routes/MainRouter";
// import { Error } from "./types/Common";
// import { finalMiddleWare } from "./util/Helper";

export class App {
  public app: Application = express();

  constructor() {
    this.app.use(express.static("public"));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    this.app.use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header(
        "Access-Control-Allow-Methods",
        "POST, PUT, GET, DELETE, OPTIONS"
      );
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
      );

      if (req.method !== "OPTIONS") {
        return next();
      }

      res.statusCode = 200;
      res.end("OK");
    });
    this.app.get("/", (req: Request, res: Response, next: NextFunction) => {
      let err = new Error("Something went wrong");
      res.send("Boss-DK bhag rha hai......");
    });

    //An error handling middleware
    this.app.use(function (
      err: Error,
      req: Request,
      res: Response,
      next: NextFunction
    ) {
      res.status(500);
      res.send({ msg: "Oops, something went wrong." });
    });
    this.app.use("/v1", router);
  }
}
