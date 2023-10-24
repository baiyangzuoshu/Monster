"use strict";
cc._RF.push(module, '7057fAd419DxpBykSXh1hXe', 'AISystem');
// Scripts/ECS/Systems/AISystem.ts

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
var util_1 = require("../../../FrameWork/Utils/util");
var Enum_1 = require("../../Enum");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var AISystem = /** @class */ (function (_super) {
    __extends(AISystem, _super);
    function AISystem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AISystem_1 = AISystem;
    AISystem.getInstance = function () {
        return AISystem_1._instance;
    };
    AISystem.prototype.onLoad = function () {
        if (null === AISystem_1._instance) {
            AISystem_1._instance = this;
        }
        else {
            this.destroy();
            return;
        }
    };
    AISystem.prototype.onBulletUpdate = function (dt, unitComponent, baseComponent, transformComponent, roleComponent, animateComponent) {
        if (unitComponent.isDead || unitComponent.attackEntity == null || animateComponent.state != Enum_1.BulletState.Attack) {
            return;
        }
        if (6 == roleComponent.type || 4 == roleComponent.type || 2 == roleComponent.type || 0 == roleComponent.type) {
            var move = 500 * dt;
            var target = unitComponent.attackEntity.baseComponent.gameObject;
            var targetH = target.height;
            var moveToPos = target.getPosition();
            moveToPos.y += targetH / 2;
            var angle = util_1.util.getAngle(baseComponent.gameObject.getPosition(), moveToPos);
            var x = Math.cos(angle * (Math.PI / 180)) * move;
            var y = Math.sin(angle * (Math.PI / 180)) * move;
            baseComponent.gameObject.x += x;
            baseComponent.gameObject.y += y;
            transformComponent.x = baseComponent.gameObject.x;
            transformComponent.y = baseComponent.gameObject.y;
        }
        else if (1 == roleComponent.type) {
            var target = unitComponent.attackEntity.baseComponent.gameObject;
            var targetPos = target.getPosition();
            var bulletPos = baseComponent.gameObject.convertToWorldSpaceAR(cc.v2(0, 0));
            var targetPos = target.convertToWorldSpaceAR(cc.v2(0, 0));
            var targetH = target.height;
            targetPos.y += targetH / 2;
            var angle = util_1.util.getAngle(bulletPos, targetPos);
            this.node.angle = angle;
            var dir = cc.v3();
            cc.Vec3.subtract(dir, cc.v3(targetPos.x, targetPos.y), cc.v3(bulletPos.x, bulletPos.y));
            var dis = dir.len();
            dis = Math.abs(dis);
        }
        else if (3 == roleComponent.type) {
            var move = 500 * dt;
            var target = unitComponent.attackEntity.baseComponent.gameObject;
            var targetH = target.height;
            var moveToPos = target.getPosition();
            moveToPos.y += targetH / 2;
            var angle = util_1.util.getAngle(baseComponent.gameObject.getPosition(), moveToPos);
            var x = Math.cos(angle * (Math.PI / 180)) * move; //+ this._playerNode.x;
            var y = Math.sin(angle * (Math.PI / 180)) * move; //+ this._playerNode.y;
            baseComponent.gameObject.angle = angle - 90;
            baseComponent.gameObject.x += x;
            baseComponent.gameObject.y += y;
            transformComponent.x = baseComponent.gameObject.x;
            transformComponent.y = baseComponent.gameObject.y;
        }
    };
    var AISystem_1;
    AISystem._instance = null;
    AISystem = AISystem_1 = __decorate([
        ccclass
    ], AISystem);
    return AISystem;
}(cc.Component));
exports.default = AISystem;

cc._RF.pop();