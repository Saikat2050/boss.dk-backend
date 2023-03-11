require("dotenv").config();

import Postgrator from "postgrator";
import * as path from "path";
import { App } from "./App";

import { PostgreSQLOptions } from "postgrator";
const PORT: number = parseInt(process.env.PORT as string) || 5001;

async function main() {
  try {
    // execute migrations

    const postgratorOptions: PostgreSQLOptions = {
      migrationDirectory: path.resolve(__dirname, "../migrations"),
      driver: "pg",
      host: process.env.DB_HOST as string,
      port: process.env.DB_PORT as string,
      username: process.env.DB_USER as string,
      password: process.env.DB_PASSWORD as string,
      database: process.env.DB_NAME as string,
    };
    const postgrator = new Postgrator(postgratorOptions);
    const migrate = await postgrator.migrate();

    // call express api object
    let app = new App();
    app.app.listen(PORT, () => {
      return console.log(`Boss-DK bhag rha hai... : ${PORT}`);
    });
  } catch (error: any) {
    console.log(`Error : `, error.message);
  }
}

main();
