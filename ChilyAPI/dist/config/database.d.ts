import { DataSource } from 'typeorm';
declare const _default: (() => {
    type: string;
    database: string;
    host: string;
    port: string;
    username: string;
    password: string;
    entities: string[];
    migrations: string[];
    logging: boolean;
    synchronize: boolean;
}) & import("@nestjs/config").ConfigFactoryKeyHost<{
    type: string;
    database: string;
    host: string;
    port: string;
    username: string;
    password: string;
    entities: string[];
    migrations: string[];
    logging: boolean;
    synchronize: boolean;
}>;
export default _default;
export declare const connectSource: DataSource;
