"use strict";
cc._RF.push(module, 'af348Kgab1AjoHXBSwQtT2f', 'CannonEntitiy');
// Scripts/ECS/Entities/CannonEntitiy.ts

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseComponent_1 = require("../Components/BaseComponent");
var GunComponent_1 = require("../Components/GunComponent");
var RoleComponent_1 = require("../Components/RoleComponent");
var TransformComponent_1 = require("../Components/TransformComponent");
var UnitComponent_1 = require("../Components/UnitComponent");
var CannonEntitiy = /** @class */ (function () {
    function CannonEntitiy() {
        this.baseComponent = new BaseComponent_1.default();
        this.transformComponent = new TransformComponent_1.default();
        this.roleComponent = new RoleComponent_1.default();
        this.unitComponent = new UnitComponent_1.default();
        this.gunComponent = new GunComponent_1.default();
    }
    return CannonEntitiy;
}());
exports.default = CannonEntitiy;

cc._RF.pop();