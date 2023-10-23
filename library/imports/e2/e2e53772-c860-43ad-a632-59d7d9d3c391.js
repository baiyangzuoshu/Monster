"use strict";
cc._RF.push(module, 'e2e53dyyGBDraYyWdfZ08OR', 'BossUIControl');
// Scripts/UI/BossUIControl.ts

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
var UIControl_1 = require("../../FrameWork/ui/UIControl");
var DataManager_1 = require("../data/DataManager");
var PlayerDataManager_1 = require("../Manager/PlayerDataManager");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var BossUIControl = /** @class */ (function (_super) {
    __extends(BossUIControl, _super);
    function BossUIControl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.m_labLevel = null;
        _this.m_bossName = null;
        _this.m_bossSprite = null;
        _this.m_anim = null;
        _this.m_callBack = null;
        return _this;
    }
    // LIFE-CYCLE CALLBACKS:
    BossUIControl.prototype.onLoad = function () {
        _super.prototype.onLoad.call(this);
        this.m_anim = this.node.getComponent(cc.Animation);
        this.m_labLevel = this.getChildByUrl("ui_boss_p2/checkPoint").getComponent(cc.Label);
        this.m_bossName = this.getChildByUrl("ui_boss_p2/name").getComponent(cc.Label);
        this.m_bossSprite = this.getChildByUrl("0").getComponent(cc.Sprite);
    };
    BossUIControl.prototype.play = function (callFunc) {
        return __awaiter(this, void 0, void 0, function () {
            var checkPoint, id, monster, i, name, m_bossAtlas, frame;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        checkPoint = PlayerDataManager_1.default.getInstance().getCheckPoint();
                        this.m_labLevel.string = '' + (checkPoint.big + 1);
                        this.m_labLevel.string += '-';
                        this.m_labLevel.string += (checkPoint.small + 1);
                        id = 0;
                        monster = DataManager_1.default.getInstance().getCurMonsterData();
                        for (i = 0; i < monster.length; i++) {
                            if (monster[i].type == 2) {
                                id = monster[i].id;
                                break;
                            }
                        }
                        name = DataManager_1.default.getInstance().getBossNameByID(id);
                        this.m_bossName.string = name;
                        return [4 /*yield*/, ResManagerPro_1.ResManagerPro.Instance.IE_GetAsset("texture", "monster/monster_2", cc.SpriteAtlas)];
                    case 1:
                        m_bossAtlas = _a.sent();
                        frame = m_bossAtlas.getSpriteFrame(id.toString());
                        this.m_bossSprite.spriteFrame = frame;
                        this.node.active = true;
                        this.m_anim.play('bossView');
                        this.m_callBack = callFunc;
                        return [2 /*return*/];
                }
            });
        });
    };
    BossUIControl.prototype.end = function () {
        this.node.active = false;
        if (this.m_callBack != null) {
            this.m_callBack();
        }
    };
    BossUIControl = __decorate([
        ccclass
    ], BossUIControl);
    return BossUIControl;
}(UIControl_1.UIControl));
exports.default = BossUIControl;

cc._RF.pop();