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
var ECSManager_1 = require("../ECSManager");
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
    AISystem.prototype.onCannonUpdate = function (dt, unitComponent, baseComponent) {
        if (unitComponent.m_attackTarget == null) {
            unitComponent.m_attackTarget = ECSManager_1.default.getInstance().calcNearDistance(baseComponent.gameObject);
        }
        if (unitComponent.m_attackTarget != null) {
            if (unitComponent.isDead) {
                unitComponent.m_attackTarget = null;
                return;
            }
            var src = cc.v3(unitComponent.m_attackTarget.getPosition().x, unitComponent.m_attackTarget.getPosition().y, 0);
            var dst = cc.v3(baseComponent.gameObject.x, baseComponent.gameObject.y, 0);
            var dir = cc.v3();
            cc.Vec3.subtract(dir, src, dst);
            var dis = dir.len();
            //cc.log(dis);
            var curDis = 230;
            Math.abs(dis);
            if (dis > curDis) {
                unitComponent.m_attackTarget = null;
                return;
            }
            var start = baseComponent.gameObject.getPosition();
            var end = unitComponent.m_attackTarget.getPosition();
            var angle = util_1.util.getAngle(start, end);
            angle += 360;
            angle -= 90;
            if (unitComponent.m_bFire) {
                unitComponent.angle = angle;
                baseComponent.gameObject.getChildByName("gun").angle = unitComponent.angle;
            }
            else {
                var moveAngle = 300 * dt;
                if (unitComponent.angle > angle ||
                    angle - unitComponent.angle > 180) {
                    moveAngle = -moveAngle;
                }
                unitComponent.angle += moveAngle;
                baseComponent.gameObject.getChildByName("gun").angle = unitComponent.angle;
                if (unitComponent.angle < 0) {
                    unitComponent.angle += 360;
                    baseComponent.gameObject.getChildByName("gun").angle = unitComponent.angle;
                }
                if (Math.abs(unitComponent.angle - angle) < Math.abs(moveAngle)) {
                    unitComponent.m_bFire = true;
                    //this.beginFire();
                    baseComponent.gameObject.getChildByName("gun").angle = angle;
                    unitComponent.angle = angle;
                }
            }
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