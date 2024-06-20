"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderModule = exports.AuthModule = exports.DeliveryModule = exports.SuperAdminModule = exports.AdminModule = exports.UserModule = void 0;
var user_module_1 = require("./user/user.module");
Object.defineProperty(exports, "UserModule", { enumerable: true, get: function () { return user_module_1.UserModule; } });
var admin_module_1 = require("./admin/admin.module");
Object.defineProperty(exports, "AdminModule", { enumerable: true, get: function () { return admin_module_1.AdminModule; } });
var super_admin_module_1 = require("./super-admin/super-admin.module");
Object.defineProperty(exports, "SuperAdminModule", { enumerable: true, get: function () { return super_admin_module_1.SuperAdminModule; } });
var delivery_module_1 = require("./delivery/delivery.module");
Object.defineProperty(exports, "DeliveryModule", { enumerable: true, get: function () { return delivery_module_1.DeliveryModule; } });
var auth_module_1 = require("./auth/auth.module");
Object.defineProperty(exports, "AuthModule", { enumerable: true, get: function () { return auth_module_1.AuthModule; } });
var order_module_1 = require("./order/order.module");
Object.defineProperty(exports, "OrderModule", { enumerable: true, get: function () { return order_module_1.OrderModule; } });
//# sourceMappingURL=index.js.map