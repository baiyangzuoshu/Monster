"use strict";
cc._RF.push(module, '56d029qWTNGIaThlR1LuWIQ', 'AttackSystem');
// Scripts/ECS/Systems/AttackSystem.ts

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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var EventManager_1 = require("../../../FrameWork/manager/EventManager");
var UIManagerPro_1 = require("../../../FrameWork/manager/UIManagerPro");
var util_1 = require("../../../FrameWork/Utils/util");
var DataManager_1 = require("../../data/DataManager");
var IntensifyDataManager_1 = require("../../data/IntensifyDataManager");
var Enum_1 = require("../../Enum");
var EventName_1 = require("../../EventName");
var PlayerDataManager_1 = require("../../Manager/PlayerDataManager");
var ECSManager_1 = require("../ECSManager");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var AttackSystem = /** @class */ (function (_super) {
    __extends(AttackSystem, _super);
    function AttackSystem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AttackSystem_1 = AttackSystem;
    AttackSystem.getInstance = function () {
        return AttackSystem_1._instance;
    };
    AttackSystem.prototype.onLoad = function () {
        if (null === AttackSystem_1._instance) {
            AttackSystem_1._instance = this;
        }
        else {
            this.destroy();
            return;
        }
    };
    AttackSystem.prototype.attackStartAction = function (hp, bulletUnitComponent, monsterUnitComponent, monsterBaseComponent, monsterAttackComponent) {
        return __awaiter(this, void 0, void 0, function () {
            var rand, isDouble, lv, double, m_HpBar, pos, cale_gold, flyEnd, m_HpBar, str, worldPos;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (monsterUnitComponent.isDead) {
                            return [2 /*return*/];
                        }
                        rand = util_1.util.randomNum(0, 1000);
                        isDouble = false;
                        if (rand <= 500) {
                            lv = PlayerDataManager_1.default.getInstance().getInternsifLevel(Enum_1.Intensify.INTENSIFY_BAOJI);
                            double = IntensifyDataManager_1.default.getInstance().getValue(Enum_1.Intensify.INTENSIFY_BAOJI, lv);
                            hp = hp * 2 + hp * (double / 100);
                            hp = hp + hp * (double / 100);
                            hp = Math.floor(hp);
                            isDouble = true;
                        }
                        monsterAttackComponent.hp -= hp;
                        if (!(monsterAttackComponent.hp <= 0)) return [3 /*break*/, 2];
                        monsterBaseComponent.gameObject.stopAllActions();
                        m_HpBar = monsterBaseComponent.gameObject.getChildByName("item").getChildByName("hp").getChildByName("bar").getComponent(cc.ProgressBar);
                        m_HpBar.progress = 0;
                        monsterUnitComponent.isDead = true;
                        monsterBaseComponent.gameObject.opacity = 0;
                        bulletUnitComponent.monsterID = 0;
                        pos = monsterBaseComponent.gameObject.convertToWorldSpaceAR(cc.v3(0, 0, 0));
                        return [4 /*yield*/, ECSManager_1.default.getInstance().createEffectEntity(pos)];
                    case 1:
                        _a.sent();
                        cale_gold = monsterAttackComponent.gold;
                        if (cale_gold > 0) {
                            flyEnd = function (gold) {
                                PlayerDataManager_1.default.getInstance().addGold(gold);
                                EventManager_1.EventManager.getInstance().emit(EventName_1.GameUI.updateGameUI);
                            };
                            //g_coinFly.createCoinToTip(this.node,flyEnd.bind(this),cale_gold);
                        }
                        DataManager_1.default.getInstance().subCurMonsterCount();
                        //杀死最后一个怪物
                        if (DataManager_1.default.getInstance().getCurMonsterCount() <= 0) {
                            //显示结算框
                            EventManager_1.EventManager.getInstance().emit(EventName_1.GameUI.showSucceed);
                            // //2面以后关闭结算框,进行下一局
                            this.scheduleOnce(function () {
                                UIManagerPro_1.UIManagerPro.getInstance().closePrefab("SmallSettlementUI");
                            }, 2);
                        }
                        PlayerDataManager_1.default.getInstance().addTaskCount(Enum_1.Task.TASK_JIDAO_DIREN);
                        return [3 /*break*/, 3];
                    case 2:
                        m_HpBar = monsterBaseComponent.gameObject.getChildByName("item").getChildByName("hp").getChildByName("bar").getComponent(cc.ProgressBar);
                        m_HpBar.progress = monsterAttackComponent.hp / monsterAttackComponent.maxHp;
                        _a.label = 3;
                    case 3:
                        str = "";
                        if (isDouble) {
                            str = '暴击' + hp;
                        }
                        worldPos = monsterBaseComponent.gameObject.convertToWorldSpaceAR(cc.v3(0, 0, 0));
                        EventManager_1.EventManager.getInstance().emit(EventName_1.GameUI.createHpEffect, { worldPos: worldPos, str: str });
                        return [2 /*return*/];
                }
            });
        });
    };
    AttackSystem.prototype.onUpdate = function (dt, cannonUnitComponent, cannonBaseComponent, cannonRoleComponent, cannonAttackComponent) {
        return __awaiter(this, void 0, void 0, function () {
            var attackEntity, end, src, dst, dir, dis, curDis, start, angle, moveAngle, worldPos;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (cannonUnitComponent.state != Enum_1.UnitState.Active || cannonUnitComponent.isDead) {
                            return [2 /*return*/];
                        }
                        attackEntity = null;
                        if (cannonUnitComponent.monsterID == 0) {
                            attackEntity = ECSManager_1.default.getInstance().calcNearDistance(cannonBaseComponent.gameObject);
                        }
                        if (!(attackEntity != null)) return [3 /*break*/, 3];
                        if (cannonUnitComponent.isDead) {
                            cannonUnitComponent.monsterID = 0;
                            return [2 /*return*/];
                        }
                        end = attackEntity.baseComponent.gameObject.getPosition();
                        src = cc.v3(end.x, end.y, 0);
                        dst = cc.v3(cannonBaseComponent.gameObject.x, cannonBaseComponent.gameObject.y, 0);
                        dir = cc.v3();
                        cc.Vec3.subtract(dir, src, dst);
                        dis = dir.len();
                        curDis = 230;
                        Math.abs(dis);
                        if (dis > curDis) {
                            cannonUnitComponent.monsterID = 0;
                            return [2 /*return*/];
                        }
                        start = cannonBaseComponent.gameObject.getPosition();
                        angle = util_1.util.getAngle(start, end);
                        angle += 360;
                        angle -= 90;
                        cannonUnitComponent.fireTime -= dt;
                        if (!(cannonUnitComponent.fireTime > 0)) return [3 /*break*/, 1];
                        cannonUnitComponent.angle = angle;
                        cannonBaseComponent.gameObject.getChildByName("gun").angle = cannonUnitComponent.angle;
                        return [3 /*break*/, 3];
                    case 1:
                        moveAngle = 300 * dt;
                        if (cannonUnitComponent.angle > angle ||
                            angle - cannonUnitComponent.angle > 180) {
                            moveAngle = -moveAngle;
                        }
                        cannonUnitComponent.angle += moveAngle;
                        cannonBaseComponent.gameObject.getChildByName("gun").angle = cannonUnitComponent.angle;
                        if (cannonUnitComponent.angle < 0) {
                            cannonUnitComponent.angle += 360;
                            cannonBaseComponent.gameObject.getChildByName("gun").angle = cannonUnitComponent.angle;
                        }
                        if (!(Math.abs(cannonUnitComponent.angle - angle) < Math.abs(moveAngle))) return [3 /*break*/, 3];
                        cannonUnitComponent.fireTime = 1.0;
                        worldPos = cannonBaseComponent.gameObject.getChildByName("gun").convertToWorldSpaceAR(cc.v3(0, 0, 0));
                        return [4 /*yield*/, ECSManager_1.default.getInstance().createBulletEntity(cannonRoleComponent.level, worldPos, attackEntity, cannonUnitComponent.angle)];
                    case 2:
                        _a.sent();
                        cannonBaseComponent.gameObject.getChildByName("gun").angle = angle;
                        cannonUnitComponent.angle = angle;
                        cannonUnitComponent.monsterID = 0;
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    var AttackSystem_1;
    AttackSystem._instance = null;
    AttackSystem = AttackSystem_1 = __decorate([
        ccclass
    ], AttackSystem);
    return AttackSystem;
}(cc.Component));
exports.default = AttackSystem;

cc._RF.pop();