"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectSource = void 0;
const dotenv_1 = require("dotenv");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("typeorm");
(0, dotenv_1.config)({ path: '.env.development' });
const config = {
    type: 'postgres',
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    entities: ['dist/**/*.entity{.ts,.js}'],
    migrations: ['dist/migrations/*{.ts,.js}'],
    logging: true,
    synchronize: true,
};
exports.default = (0, config_1.registerAs)('typeorm', () => config);
exports.connectSource = new typeorm_1.DataSource(config);
//# sourceMappingURL=database.js.map