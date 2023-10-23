"use strict";
cc._RF.push(module, '2d768/Tr+pMa4cE+PjkT8pj', 'BulletEntity');
// Scripts/ECS/Entities/BulletEntity.ts

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AnimateComponent_1 = require("../Components/AnimateComponent");
var AttackComponent_1 = require("../Components/AttackComponent");
var BaseComponent_1 = require("../Components/BaseComponent");
var RoleComponent_1 = require("../Components/RoleComponent");
var ShapeComponent_1 = require("../Components/ShapeComponent");
var TransformComponent_1 = require("../Components/TransformComponent");
var UnitComponent_1 = require("../Components/UnitComponent");
var BulletEntity = /** @class */ (function () {
    function BulletEntity() {
        this.roleComponent = new RoleComponent_1.default();
        this.unitComponent = new UnitComponent_1.default();
        this.transformComponent = new TransformComponent_1.default();
        this.baseComponent = new BaseComponent_1.default();
        this.shapeComponent = new ShapeComponent_1.default();
        this.animateComponent = new AnimateComponent_1.default();
        this.attackComponent = new AttackComponent_1.default();
    }
    return BulletEntity;
}());
exports.default = BulletEntity;

cc._RF.pop();