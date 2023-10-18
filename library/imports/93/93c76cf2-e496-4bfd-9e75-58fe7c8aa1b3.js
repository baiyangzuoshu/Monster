"use strict";
cc._RF.push(module, '93c76zy5JZL/Z51WP58iqGz', 'NavComponent');
// Scripts/ECS/Components/NavComponent.ts

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var NavComponent = /** @class */ (function () {
    function NavComponent() {
        this.pathList = [];
        this.curIndex = 0;
        this.curTime = 0;
        this.speed = 0;
        this.vx = 0; //移动速度的分量x
        this.vy = 0; //移动速度的分量y
    }
    return NavComponent;
}());
exports.default = NavComponent;

cc._RF.pop();