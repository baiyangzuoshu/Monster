"use strict";
cc._RF.push(module, 'f77bdQkyfVMPY5VSB6JiuT/', 'AnimateSystem');
// Scripts/ECS/Systems/AnimateSystem.ts

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
var Enum_1 = require("../../Enum");
var ECSManager_1 = require("../ECSManager");
var AttackSystem_1 = require("./AttackSystem");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var AnimateSystem = /** @class */ (function (_super) {
    __extends(AnimateSystem, _super);
    function AnimateSystem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AnimateSystem_1 = AnimateSystem;
    AnimateSystem.getInstance = function () {
        return AnimateSystem_1._instance;
    };
    AnimateSystem.prototype.onLoad = function () {
        if (null === AnimateSystem_1._instance) {
            AnimateSystem_1._instance = this;
        }
        else {
            this.destroy();
            return;
        }
    };
    AnimateSystem.prototype.onMonsterUpdate = function (dt, baseComponent, roleComponent, animateComponent) {
        if (animateComponent.playActionTime > 0) {
            animateComponent.playActionTime -= dt;
            return;
        }
        if (roleComponent.type > 0) {
            animateComponent.playActionTime = 1;
            var moveScale1 = cc.scaleTo(0.5, 1.1, 0.9);
            var moveScale2 = cc.scaleTo(0.5, 0.9, 1.1);
            var seqMoveScale = cc.sequence(moveScale1, moveScale2);
            baseComponent.gameObject.runAction(seqMoveScale);
        }
        else {
            animateComponent.playActionTime = 0.4;
            var jump1 = cc.moveBy(0.2, cc.v2(0, 30));
            var jump2 = cc.moveBy(0.2, cc.v2(0, -30));
            var seqJump = cc.sequence(jump1, jump2);
            baseComponent.gameObject.runAction(seqJump);
        }
    };
    AnimateSystem.prototype.onBulletUpdate = function (dt, bulletAttackComponent, bulletBaseComponent, bulletAnimateComponent, bulletUnitComponent, bulletRoleComponent) {
        if (Enum_1.BulletState.Effect != bulletAnimateComponent.state) {
            return;
        }
        bulletAnimateComponent.playActionTime -= dt;
        if (bulletAnimateComponent.playActionTime < 0) {
            bulletAnimateComponent.state = Enum_1.BulletState.Attack;
            bulletUnitComponent.state = Enum_1.UnitState.Active;
            var bullet_1 = bulletBaseComponent.gameObject.getChildByName('bullet');
            var effect_1 = bulletBaseComponent.gameObject.getChildByName('effect');
            effect_1.active = false;
            bullet_1.active = true;
            if (1 == bulletRoleComponent.type) { //闪电炮
                cc.tween(bullet_1)
                    .delay(0.1)
                    .call(function () {
                    bulletUnitComponent.isDead = true;
                    var monsterEntity = ECSManager_1.default.getInstance().getMonsterById(bulletUnitComponent.monsterID);
                    if (null == monsterEntity) {
                        return;
                    }
                    var monsterUnitComponent = monsterEntity.unitComponent;
                    var monsterBaseComponent = monsterEntity.baseComponent;
                    var monsterAttackComponent = monsterEntity.attackComponent;
                    var atk = bulletAttackComponent.atk;
                    AttackSystem_1.default.getInstance().attackStartAction(atk, bulletUnitComponent, monsterUnitComponent, monsterBaseComponent, monsterAttackComponent);
                })
                    .start();
            }
            return;
        }
        var effect = bulletBaseComponent.gameObject.getChildByName('effect');
        var bullet = bulletBaseComponent.gameObject.getChildByName('bullet');
        var effectAnimate = effect.getComponent(cc.Animation);
        effect.active = true;
        bullet.active = false;
        effectAnimate.play('fire');
    };
    AnimateSystem.prototype.onEffectUpdate = function (dt, baseComponent, animateComponent, unitComponent) {
        if (unitComponent.isDead) {
            return;
        }
        animateComponent.playActionTime -= dt;
        if (animateComponent.playActionTime < 0) {
            unitComponent.isDead = true;
            return;
        }
        if (unitComponent.state == Enum_1.UnitState.None) {
            var anim = baseComponent.gameObject.getComponent(cc.Animation);
            anim.play('deadEffect');
            unitComponent.state = Enum_1.UnitState.Active;
        }
    };
    var AnimateSystem_1;
    AnimateSystem._instance = null;
    AnimateSystem = AnimateSystem_1 = __decorate([
        ccclass
    ], AnimateSystem);
    return AnimateSystem;
}(cc.Component));
exports.default = AnimateSystem;

cc._RF.pop();