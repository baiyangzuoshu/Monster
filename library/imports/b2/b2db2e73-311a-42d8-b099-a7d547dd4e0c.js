"use strict";
cc._RF.push(module, 'b2db25zMRpC2LCZp9VH3U4M', 'AnimateComponent');
// Scripts/ECS/Components/AnimateComponent.ts

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Enum_1 = require("../../Enum");
var AnimateComponent = /** @class */ (function () {
    function AnimateComponent() {
        this.playActionTime = 0;
        this.state = Enum_1.BulletState.None;
    }
    return AnimateComponent;
}());
exports.default = AnimateComponent;

cc._RF.pop();