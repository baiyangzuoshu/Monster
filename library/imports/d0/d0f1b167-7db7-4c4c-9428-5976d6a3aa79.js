"use strict";
cc._RF.push(module, 'd0f1bFnfbdMTJQoWXbWo6p5', 'MonsterEntity');
// Scripts/ECS/Entities/MonsterEntity.ts

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BaseComponent_1 = require("../Components/BaseComponent");
var NavComponent_1 = require("../Components/NavComponent");
var TransformComponent_1 = require("../Components/TransformComponent");
var UnitComponent_1 = require("../Components/UnitComponent");
var MonsterEntity = /** @class */ (function () {
    function MonsterEntity() {
        this.baseComponent = new BaseComponent_1.default();
        this.transformComponent = new TransformComponent_1.default();
        this.navComponent = new NavComponent_1.default();
        this.unitComponent = new UnitComponent_1.default();
    }
    return MonsterEntity;
}());
exports.default = MonsterEntity;

cc._RF.pop();