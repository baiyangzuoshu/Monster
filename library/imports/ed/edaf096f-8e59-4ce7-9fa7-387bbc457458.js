"use strict";
cc._RF.push(module, 'edaf0lvjllM55+nOHu8RXRY', 'EntityUtils');
// Scripts/ECS/EntityUtils.ts

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
var util_1 = require("../../FrameWork/Utils/util");
var DataManager_1 = require("../data/DataManager");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var EntityUtils = /** @class */ (function (_super) {
    __extends(EntityUtils, _super);
    function EntityUtils() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EntityUtils_1 = EntityUtils;
    EntityUtils.getInstance = function () {
        return EntityUtils_1._instance;
    };
    EntityUtils.prototype.onLoad = function () {
        if (null === EntityUtils_1._instance) {
            EntityUtils_1._instance = this;
        }
        else {
            this.destroy();
            return;
        }
    };
    EntityUtils.prototype.updateMonsterDirection = function (start, end, baseComponent) {
        if (end.x > start.x) {
            baseComponent.gameObject.getChildByName("item").getChildByName("scale").getChildByName("right").active = true;
            baseComponent.gameObject.getChildByName("item").getChildByName("scale").getChildByName("left").active = false;
        }
        else if (end.x < start.x) {
            baseComponent.gameObject.getChildByName("item").getChildByName("scale").getChildByName("right").active = false;
            baseComponent.gameObject.getChildByName("item").getChildByName("scale").getChildByName("left").active = true;
        }
    };
    EntityUtils.prototype.cannonCompare = function (roleComponent1, roleComponent2) {
        return roleComponent1.level == roleComponent2.level;
    };
    EntityUtils.prototype.cannonLevelUp = function (roleComponent, baseComponent, attackComponent) {
        return __awaiter(this, void 0, void 0, function () {
            var level, lvData, index, name, padSpriteAtlas, frame, gunPrefab, gunNode, angle;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        roleComponent.level++;
                        level = roleComponent.level;
                        lvData = DataManager_1.default.getInstance().cannonUpLevel[level];
                        index = Math.floor(lvData.level / 3);
                        name = '' + lvData.type + '_' + index;
                        return [4 /*yield*/, ResManagerPro_1.ResManagerPro.Instance.IE_GetAsset("texture", "cannon/pad", cc.SpriteAtlas)];
                    case 1:
                        padSpriteAtlas = _a.sent();
                        frame = padSpriteAtlas.getSpriteFrame(name);
                        baseComponent.gameObject.getChildByName("pad").getComponent(cc.Sprite).spriteFrame = frame;
                        baseComponent.gameObject.getChildByName("ui_towerLevel").getChildByName("lv").getComponent(cc.Label).string = '' + (lvData.level + 1);
                        baseComponent.gameObject.getChildByName("gun").removeAllChildren();
                        return [4 /*yield*/, ResManagerPro_1.ResManagerPro.Instance.IE_GetAsset("prefabs", "gun/gun_" + lvData.type, cc.Prefab)];
                    case 2:
                        gunPrefab = _a.sent();
                        gunNode = cc.instantiate(gunPrefab);
                        baseComponent.gameObject.getChildByName("gun").addChild(gunNode);
                        angle = util_1.util.randomNum(0, 360);
                        baseComponent.gameObject.getChildByName("gun").angle = angle;
                        roleComponent.type = lvData.type;
                        attackComponent.atk = lvData.atk;
                        return [2 /*return*/];
                }
            });
        });
    };
    var EntityUtils_1;
    EntityUtils._instance = null;
    EntityUtils = EntityUtils_1 = __decorate([
        ccclass
    ], EntityUtils);
    return EntityUtils;
}(cc.Component));
exports.default = EntityUtils;

cc._RF.pop();