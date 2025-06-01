import "reflect-metadata"
import { DataSource } from "typeorm"
import { Apartment } from "./entity/Apartment"
import { Resident } from "./entity/Resident"
import { Transaction } from "./entity/Transaction"


export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3000,
    username: "root",
    password: undefined,
    database: "infrend_beadando_2025",
    synchronize: true,
    logging: true,
    entities: [Apartment, Resident, Transaction],
    migrations: [],
    subscribers: [],
})
