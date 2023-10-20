"use strict";
cc._RF.push(module, '8c250+SGFpGf5eTPUYoNwF1', 'ECSManager');
// Scripts/ECS/ECSManager.ts

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
var ECSFactory_1 = require("./ECSFactory");
var AISystem_1 = require("./Systems/AISystem");
var AnimateSystem_1 = require("./Systems/AnimateSystem");
var NavSystem_1 = require("./Systems/NavSystem");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var ECSManager = /** @class */ (function (_super) {
    __extends(ECSManager, _super);
    function ECSManager() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.monsters = [];
        _this.cannones = [];
        return _this;
    }
    ECSManager_1 = ECSManager;
    ECSManager.getInstance = function () {
        return ECSManager_1._instance;
    };
    ECSManager.prototype.onLoad = function () {
        if (null === ECSManager_1._instance) {
            ECSManager_1._instance = this;
        }
        else {
            this.destroy();
            return;
        }
    };
    ECSManager.prototype.createMonsterEntity = function (type, index, list, hp, gold, speed) {
        return __awaiter(this, void 0, void 0, function () {
            var entity;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, ECSFactory_1.default.getInstance().createMonsterEntity(type, index, list, hp, gold, speed)];
                    case 1:
                        entity = _a.sent();
                        this.monsters.push(entity);
                        return [2 /*return*/, entity];
                }
            });
        });
    };
    ECSManager.prototype.createCannonEntity = function (index, level) {
        return __awaiter(this, void 0, void 0, function () {
            var entity;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, ECSFactory_1.default.getInstance().createCannonEntity(index, level)];
                    case 1:
                        entity = _a.sent();
                        this.cannones.push(entity);
                        return [2 /*return*/, entity];
                }
            });
        });
    };
    ECSManager.prototype.navSystemMonster = function (dt) {
        for (var i = 0; i < this.monsters.length; i++) {
            NavSystem_1.default.getInstance().onUpdate(dt, this.monsters[i].navComponent, this.monsters[i].baseComponent, this.monsters[i].transformComponent);
        }
    };
    ECSManager.prototype.animateSystemMonster = function (dt) {
        for (var i = 0; i < this.monsters.length; i++) {
            AnimateSystem_1.default.getInstance().onMonsterUpdate(dt, this.monsters[i].baseComponent, this.monsters[i].roleComponent, this.monsters[i].animateComponent);
        }
    };
    ECSManager.prototype.AISystemCannon = function (dt) {
        for (var i = 0; i < this.cannones.length; i++) {
            console.log(i);
            AISystem_1.default.getInstance().onUpdate(dt, this.cannones[i].unitComponent, this.cannones[i].baseComponent);
        }
    };
    ECSManager.prototype.calcNearDistance = function (cannon) {
        var minDis = 9999;
        var minMonster = null;
        var curDis = 230;
        for (var i = 0; i < this.monsters.length; i++) {
            var monster = this.monsters[i];
            if (monster.unitComponent.isDead)
                continue;
            var src = cc.v2(monster.baseComponent.gameObject.x, monster.baseComponent.gameObject.y);
            var dst = cc.v2(cannon.x, cannon.y);
            var dis = src.sub(dst).mag();
            //var dis = getDistance(this.node.children[i].getPosition(),cannon.getPosition());
            if (dis < curDis && dis < Math.abs(minDis)) {
                minDis = dis;
                minMonster = monster.baseComponent.gameObject;
            }
        }
        //cc.log(minDis);
        return minMonster;
    };
    ECSManager.prototype.update = function (dt) {
        //怪物行走
        this.navSystemMonster(dt);
        //怪物动画
        this.animateSystemMonster(dt);
        //AI
        this.AISystemCannon(dt);
    };
    var ECSManager_1;
    ECSManager._instance = null;
    ECSManager = ECSManager_1 = __decorate([
        ccclass
    ], ECSManager);
    return ECSManager;
}(cc.Component));
exports.default = ECSManager;

cc._RF.pop();