"use strict";
cc._RF.push(module, '598f6WTK3pH7L7rKfAbcehg', 'UnitComponent');
// Scripts/ECS/Components/UnitComponent.ts

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Enum_1 = require("../../Enum");
var UnitComponent = /** @class */ (function () {
    function UnitComponent() {
        this.angle = 0;
        this.attackEntity = null;
        this.isDead = false;
        this.fireTime = 0;
        this.state = Enum_1.UnitState.None;
    }
    return UnitComponent;
}());
exports.default = UnitComponent;

cc._RF.pop();