"use strict";
cc._RF.push(module, 'd0f1bFnfbdMTJQoWXbWo6p5', 'MonsterEntity');
// Scripts/ECS/Entities/MonsterEntity.ts

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AnimateComponent_1 = require("../Components/AnimateComponent");
var BaseComponent_1 = require("../Components/BaseComponent");
var NavComponent_1 = require("../Components/NavComponent");
var RoleComponent_1 = require("../Components/RoleComponent");
var TransformComponent_1 = require("../Components/TransformComponent");
var UnitComponent_1 = require("../Components/UnitComponent");
var MonsterEntity = /** @class */ (function () {
    function MonsterEntity() {
        this.baseComponent = new BaseComponent_1.default();
        this.transformComponent = new TransformComponent_1.default();
        this.navComponent = new NavComponent_1.default();
        this.unitComponent = new UnitComponent_1.default();
        this.roleComponent = new RoleComponent_1.default();
        this.animateComponent = new AnimateComponent_1.default();
    }
    return MonsterEntity;
}());
exports.default = MonsterEntity;

cc._RF.pop();