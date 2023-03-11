import { ProvidersFactory } from "../util/ProvidersFactory";

type range = {
  page: number;
  pageSize: number;
};

export default class CommonModel {
  private TABLE_NAME: string;
  private ID_COLUMN_NAME: string;
  private SEARCH_COLUMN_NAME: string[];

  constructor(
    tableName: string,
    idColumnName: string,
    searchColumnName: string[]
  ) {
    this.TABLE_NAME = tableName;
    this.ID_COLUMN_NAME = idColumnName;
    this.SEARCH_COLUMN_NAME = searchColumnName;
  }

  list = async (
    dbName: string,
    filter: any,
    range?: range,
    sort?: any,
    fields?: string[],
    isCount?: boolean
  ): Promise<any> => {
    const providersFactory = new ProvidersFactory();
    const { query, release } = await providersFactory.transaction(dbName);

    try {
      query("BEGIN");
      // filters
      let whereArr: string[] = [`"deletedAt" IS NULL`];

      if (filter && Object.keys(filter).length) {
        console.log(filter);

        Object.keys(filter).map((column) => {
          console.log(column);

          if (
            filter[column] === undefined ||
            filter[column] === null ||
            String(filter[column]).trim() === ""
          ) {
            return;
          }

          if (column === "search") {
            let whereSearch: string[] = this.SEARCH_COLUMN_NAME.map((el) => {
              return `"${el}" ILIKE '%${filter[column]}%'`;
            });
            whereArr.push(`(${whereSearch.join(" OR ")})`);
          } else if (column === "createdAt") {
            whereArr.push(`"${column}"::date = '${filter[column]}'`);
          } else {
            switch (typeof filter[column] as string) {
              case "number":
                whereArr.push(`"${column}" = ${filter[column]}`);
                break;
              case "object":
                if (Array.isArray(filter[column])) {
                  whereArr.push(
                    `"${column}" IN(${
                      typeof filter[column][0] === "string"
                        ? `'${filter[column].join("', '")}'`
                        : `${filter[column].join(", ")}`
                    })`
                  );
                }
                break;
              default:
                whereArr.push(`"${column}" = '${filter[column]}'`);
            }
          }
        });
      }

      // pagination
      let limit: number = 100;
      let offset: number = 0;
      if (range) {
        range.page = range.page ? range.page : 1;
        limit = range.pageSize;
        offset = (range.page - 1) * range.pageSize;
      }

      // sorting
      let sortArr: string[] = [`"createdAt" DESC`];
      if (sort && Object.keys(sort).length > 0) {
        sortArr = Object.keys(sort).map((key) => `"${key}" ${sort[key]}`);
      }

      let sqlFields;
      if (fields) {
        if (fields.length > 0) {
          if (!isCount) {
            sqlFields = `"${fields.join('", "')}"`;
          } else {
            sqlFields = `${fields[0]}`;
          }
        }
      } else {
        sqlFields = `*`;
      }

      let sql: string = `
                      SELECT ${sqlFields}
                      FROM "${this.TABLE_NAME}"
                      WHERE ${whereArr.join(" AND ")}
                  `;
      if (!isCount) {
        sql += `
          ORDER BY ${sortArr.join("', '")}
          LIMIT ${limit} OFFSET ${offset}
          `;
      }

      query("COMMIT");
      console.log(sql);
      const { rows } = await query(sql);
      return rows;
    } catch (error) {
      query("ROLLBACK");
      throw error;
    } finally {
      release();
    }
  };

  bulkCreate = async (dbName: string, inputData: any) => {
    const providersFactory = new ProvidersFactory();
    const { query, release } = await providersFactory.transaction(dbName);
    try {
      let sql = `INSERT INTO "${this.TABLE_NAME}" ("${Object.keys(
        inputData[0]
      ).join('", "')}") VALUES `;
      let commonDataArr: any[] = [];

      // looping through values
      for (let i = 0; i < inputData.length; i++) {
        commonDataArr.push(
          `('${Object.values(inputData[i])
            .map((el) => el)
            .join("', '")}')`
        );
      }
      sql += commonDataArr.join(", ");
      sql += `RETURNING *`;

      // executing query
      const { rows } = await query(sql);
      query("COMMIT");
      // return rows
      return rows;
    } catch (error) {
      query("ROLLBACK");
      throw error;
    } finally {
      release();
    }
  };

  update = async (dbName: string, data: any, id: string): Promise<any> => {
    const providersFactory = new ProvidersFactory();
    const { query, release } = await providersFactory.transaction(dbName);

    try {
      let updateArr: string[] = [];
      Object.keys(data).forEach((column) => {
        let value =
          ["number", "boolean"].indexOf(typeof data[column]) >= 0
            ? data[column]
            : `'${data[column]}'`;
        updateArr.push(`"${column}" = ${value}`);
      });

      query("BEGIN");
      let sql: string = `
      UPDATE "${this.TABLE_NAME}"
      SET ${updateArr.join(", ")},
      "updatedAt"='NOW()'
      WHERE "deletedAt" IS NULL
      AND "${this.ID_COLUMN_NAME}" = '${id}'
      `;
      sql += `RETURNING *`;
      const { rows } = await query(sql);
      query("COMMIT");
      let row = rows;

      return row;
    } catch (error) {
      query("ROLLBACK");
      throw error;
    } finally {
      release();
    }
  };

  itemDelete = async (dbName: string, id: number[]): Promise<any> => {
    const providersFactory = new ProvidersFactory();
    const { query, release } = await providersFactory.transaction(dbName);

    try {
      query("BEGIN");
      const sql: string = `
      UPDATE "${this.TABLE_NAME}"
      SET "deletedAt" = 'NOW()',
      "deletedBy" = 'userID'
      WHERE "${this.ID_COLUMN_NAME}" IN (${id.join(", ")})
      `;

      const { rows } = await query(sql);
      let row = rows;
      query("COMMIT");

      return row;
    } catch (error) {
      query("ROLLBACK");
      throw error;
    } finally {
      release();
    }
  };
}
