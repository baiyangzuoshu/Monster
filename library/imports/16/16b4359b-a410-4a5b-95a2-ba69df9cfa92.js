"use strict";
cc._RF.push(module, '16b43WbpBBKW5WiumnfnPqS', 'EffectEntity');
// Scripts/ECS/Entities/EffectEntity.ts

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AnimateComponent_1 = require("../Components/AnimateComponent");
var BaseComponent_1 = require("../Components/BaseComponent");
var TransformComponent_1 = require("../Components/TransformComponent");
var UnitComponent_1 = require("../Components/UnitComponent");
var EffectEntity = /** @class */ (function () {
    function EffectEntity() {
        this.baseComponent = new BaseComponent_1.default();
        this.animateComponent = new AnimateComponent_1.default();
        this.transformComponent = new TransformComponent_1.default();
        this.unitComponent = new UnitComponent_1.default();
    }
    return EffectEntity;
}());
exports.default = EffectEntity;

cc._RF.pop();