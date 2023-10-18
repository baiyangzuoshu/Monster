"use strict";
cc._RF.push(module, '31dcfE3wuBKXbXhuGMCouvl', 'ECSFactory');
// Scripts/ECS/ECSFactory.ts

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
var ResManagerPro_1 = require("../../FrameWork/manager/ResManagerPro");
var MonsterEntity_1 = require("./Entities/MonsterEntity");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var ECSFactory = /** @class */ (function (_super) {
    __extends(ECSFactory, _super);
    function ECSFactory() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.monsterNode = null;
        _this.entityID = 0;
        return _this;
    }
    ECSFactory_1 = ECSFactory;
    ECSFactory.getInstance = function () {
        return ECSFactory_1._instance;
    };
    ECSFactory.prototype.onLoad = function () {
        if (null === ECSFactory_1._instance) {
            ECSFactory_1._instance = this;
        }
        else {
            this.destroy();
            return;
        }
        var canvas = cc.find("Canvas");
        this.monsterNode = canvas.getChildByName("Game").getChildByName("monsterNode");
    };
    ECSFactory.prototype.createMonsterEntity = function (type, index, list, hp, gold, speed) {
        return __awaiter(this, void 0, void 0, function () {
            var entity, _pathPos, i, x, y, monsterPrefab, node;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        entity = new MonsterEntity_1.default();
                        _pathPos = [];
                        for (i = 0; i < list.length; i++) {
                            x = list[i].x * 106 + 106 / 2;
                            y = -list[i].y * 106 - 106 / 2 - 35;
                            _pathPos.push(cc.v2(x, y));
                        }
                        entity.baseComponent.entityID = this.entityID++;
                        return [4 /*yield*/, ResManagerPro_1.ResManagerPro.Instance.IE_GetAsset("prefabs", "monster/msItem", cc.Prefab)];
                    case 1:
                        monsterPrefab = _a.sent();
                        node = cc.instantiate(monsterPrefab);
                        entity.baseComponent.gameObject = node;
                        this.monsterNode.addChild(node);
                        node.x = _pathPos[0].x;
                        node.y = _pathPos[0].y;
                        entity.transformComponent.x = _pathPos[0].x;
                        entity.transformComponent.y = _pathPos[0].y;
                        entity.navComponent.pathList = _pathPos;
                        entity.navComponent.speed = speed;
                        entity.unitComponent.hp = hp;
                        entity.unitComponent.gold = gold;
                        return [2 /*return*/, entity];
                }
            });
        });
    };
    var ECSFactory_1;
    ECSFactory._instance = null;
    ECSFactory = ECSFactory_1 = __decorate([
        ccclass
    ], ECSFactory);
    return ECSFactory;
}(cc.Component));
exports.default = ECSFactory;

cc._RF.pop();