"use strict";
cc._RF.push(module, '19de6aKmgRJOLGvw4PstHGo', 'CannonEntitiy');
// Scripts/ECS/Entities/CannonEntitiy.ts

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AttackComponent_1 = require("../Components/AttackComponent");
var BaseComponent_1 = require("../Components/BaseComponent");
var RoleComponent_1 = require("../Components/RoleComponent");
var TransformComponent_1 = require("../Components/TransformComponent");
var UnitComponent_1 = require("../Components/UnitComponent");
var CannonEntity = /** @class */ (function () {
    function CannonEntity() {
        this.baseComponent = new BaseComponent_1.default();
        this.transformComponent = new TransformComponent_1.default();
        this.roleComponent = new RoleComponent_1.default();
        this.unitComponent = new UnitComponent_1.default();
        this.attackComponent = new AttackComponent_1.default();
    }
    return CannonEntity;
}());
exports.default = CannonEntity;

cc._RF.pop();