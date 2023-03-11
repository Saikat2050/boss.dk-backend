import { PG } from "./PG";
import { PoolClient, PoolConfig } from "pg";

export class ProvidersFactory {
  private static connectionPG: any = {};
  constructor() {}

  public async getPoolClient(dbName: any): Promise<PoolClient> {
    // check if dbName does not exist then create new database
    if (!ProvidersFactory.connectionPG[dbName]) {
      ProvidersFactory.connectionPG[dbName] = this.createPG(dbName);
    }

    // connecting to existing database or newly created database
    const pg: PG = ProvidersFactory.connectionPG[dbName];
    const client: any = await pg.getPool().connect();

    const oldClientQuery = client.query;

    if (!client.queryMethodPatched) {
      client.query = (...args: any) => {
        if (process.env.DEBUG) {
        }

        return oldClientQuery.apply(client, args);
      };
    }

    return client;
  }

  public async transaction(
    dbName: String
  ): Promise<{ query: Function; release: Function }> {
    // calling getPoolClient function to make connection with db
    const client = await this.getPoolClient(dbName);
    const query = client.query.bind(client);
    const release = client.release.bind(client);

    return { query, release };
  }

  private createPG(dbName: any): PG {
    let config: PoolConfig;
    config = {
      host: process.env.DB_HOST as string,
      port: parseInt(process.env.DB_PORT as string),
      user: process.env.DB_USER as string,
      password: process.env.DB_PASSWORD as string,
      database: process.env.DB_NAME as string,
    };
    return new PG(config);
  }
}
