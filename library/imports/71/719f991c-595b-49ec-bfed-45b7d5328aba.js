"use strict";
cc._RF.push(module, '719f9kcWVtJ7L/tRbfVMoq6', 'NavSystem');
// Scripts/ECS/Systems/NavSystem.ts

"use strict";
// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var EntityUtils_1 = require("../EntityUtils");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var NavSystem = /** @class */ (function (_super) {
    __extends(NavSystem, _super);
    function NavSystem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NavSystem_1 = NavSystem;
    NavSystem.getInstance = function () {
        return NavSystem_1._instance;
    };
    NavSystem.prototype.onLoad = function () {
        if (null === NavSystem_1._instance) {
            NavSystem_1._instance = this;
        }
        else {
            this.destroy();
            return;
        }
    };
    NavSystem.prototype.onUpdate = function (dt, navComponent, baseComponent, transformComponent) {
        if (navComponent.curTime > 0) {
            navComponent.curTime -= dt;
            transformComponent.x += dt * navComponent.vx;
            transformComponent.y += dt * navComponent.vy;
            baseComponent.gameObject.x = transformComponent.x;
            baseComponent.gameObject.y = transformComponent.y;
            return;
        }
        navComponent.curIndex++;
        if (navComponent.pathList.length - 1 < navComponent.curIndex) {
            return;
        }
        var src = cc.v3(transformComponent.x, transformComponent.y, 0);
        var dst = cc.v3(navComponent.pathList[navComponent.curIndex].x, navComponent.pathList[navComponent.curIndex].y, 0);
        var dir = cc.v3();
        cc.Vec3.subtract(dir, dst, src);
        var dis = dir.len();
        EntityUtils_1.default.getInstance().updateMonsterDirection(src, dst, baseComponent);
        navComponent.curTime = dis / navComponent.speed;
        navComponent.vx = navComponent.speed * dir.x / dis;
        navComponent.vy = navComponent.speed * dir.y / dis;
    };
    NavSystem.prototype.getDistance = function (start, end) {
        var pos = cc.v2(start.x - end.x, start.y - end.y);
        var dis = Math.sqrt(pos.x * pos.x + pos.y * pos.y);
        return dis;
    };
    var NavSystem_1;
    NavSystem._instance = null;
    NavSystem = NavSystem_1 = __decorate([
        ccclass
    ], NavSystem);
    return NavSystem;
}(cc.Component));
exports.default = NavSystem;

cc._RF.pop();