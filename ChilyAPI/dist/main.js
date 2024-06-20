"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const PORT = 3000;
    await app.listen(PORT);
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log("Press CTRL+C to stop the server.");
}
bootstrap();
//# sourceMappingURL=main.js.map