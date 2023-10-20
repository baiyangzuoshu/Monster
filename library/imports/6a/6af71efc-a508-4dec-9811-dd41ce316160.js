"use strict";
cc._RF.push(module, '6af7178pQhN7JgR3UHOMWFg', 'GameUIControl');
// Scripts/UI/GameUIControl.ts

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
var UIControl_1 = require("../../FrameWork/ui/UIControl");
var IntensifyDataManager_1 = require("../data/IntensifyDataManager");
var ECSManager_1 = require("../ECS/ECSManager");
var Enum_1 = require("../Enum");
var MapDataManager_1 = require("../Manager/MapDataManager");
var PlayerDataManager_1 = require("../Manager/PlayerDataManager");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var GameUIControl = /** @class */ (function (_super) {
    __extends(GameUIControl, _super);
    function GameUIControl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.m_canMakeCount = 10;
        _this.m_maxMakeCount = 10;
        _this.m_hammerAction = false;
        _this.m_waterAction = false;
        _this.m_water = null;
        _this.m_hammer = null;
        _this.m_makeNumberLabel = null;
        _this.m_cannonList = [];
        return _this;
    }
    GameUIControl.prototype.onLoad = function () {
        _super.prototype.onLoad.call(this);
        this.m_water = this.getChildByUrl("bottom/make/ui_build_water");
        this.m_hammer = this.getChildByUrl("bottom/make/ui_build_hammer");
        this.m_makeNumberLabel = this.getChildByUrl("bottom/make/num").getComponent(cc.Label);
        this.updateGameUI();
        this.registerBottomBtn();
    };
    GameUIControl.prototype.start = function () {
        var _cannonList = MapDataManager_1.default.getInstance().getCurCannonPoint();
        for (var i = 0; i < _cannonList.length; i++) {
            this.m_cannonList[i] = this.createCannonData();
            this.m_cannonList[i].pos = _cannonList[i];
        }
    };
    GameUIControl.prototype.createCannonData = function () {
        var obj = {};
        obj.pos = cc.v2(0, 0);
        obj.cannon = null;
        return obj;
    };
    GameUIControl.prototype.getCanMakeIndex = function () {
        for (var i = 0; i < this.m_cannonList.length; i++) {
            if (this.m_cannonList[i].cannon == null) {
                return i;
            }
        }
        return null;
    };
    GameUIControl.prototype.addMakeNumber = function () {
        this.m_canMakeCount++;
        if (this.m_canMakeCount > this.m_maxMakeCount) {
            this.m_canMakeCount = this.m_maxMakeCount;
        }
        this.updateMakeCount();
    };
    GameUIControl.prototype.subMakeNumber = function () {
        this.m_canMakeCount--;
        if (this.m_canMakeCount < 0) {
            this.m_canMakeCount = 0;
        }
        if (!this.m_waterAction) {
            this.m_water.height = 0;
        }
        this.updateMakeCount();
    };
    GameUIControl.prototype.updateMakeCount = function () {
        this.m_makeNumberLabel.string = '' + this.m_canMakeCount + '/' + this.m_maxMakeCount;
    };
    GameUIControl.prototype.update = function (dt) {
        if (this.m_canMakeCount < this.m_maxMakeCount) {
            this.m_water.height += dt * 50;
            this.m_waterAction = true;
            if (this.m_water.height >= 133) {
                this.addMakeNumber();
                if (this.m_canMakeCount == this.m_maxMakeCount) {
                    this.m_water.height = 133;
                    this.m_waterAction = false;
                }
                else {
                    this.m_water.height = 0;
                }
            }
        }
    };
    GameUIControl.prototype.updateGameUI = function () {
        if (!this.m_waterAction) {
            this.m_water.height = 0;
        }
        var lv = PlayerDataManager_1.default.getInstance().getInternsifLevel(Enum_1.Intensify.INTENSIFY_KUORONG);
        this.m_maxMakeCount = IntensifyDataManager_1.default.getInstance().getValue(Enum_1.Intensify.INTENSIFY_KUORONG, lv);
        this.updateMakeCount();
    };
    GameUIControl.prototype.registerBottomBtn = function () {
        this.buttonAddClickEvent("bottom/make/make", this.clickBtnEvent, this);
        this.buttonAddClickEvent("bottom/make/autoMake", this.clickBtnEvent, this);
        this.buttonAddClickEvent("bottom/intensify", this.clickBtnEvent, this);
        this.buttonAddClickEvent("bottom/shop", this.clickBtnEvent, this);
        this.buttonAddClickEvent("bottom/destroy", this.clickBtnEvent, this);
        this.buttonAddClickEvent("bottom/cannon", this.clickBtnEvent, this);
        this.buttonAddClickEvent("bottom/task/bt", this.clickBtnEvent, this);
        this.buttonAddClickEvent("bottom/buffer/skill_coin0", this.clickBtnEvent, this);
        this.buttonAddClickEvent("bottom/buffer/skill_coin1", this.clickBtnEvent, this);
        this.buttonAddClickEvent("bottom/buffer/skill_coin2", this.clickBtnEvent, this);
        this.buttonAddClickEvent("bottom/buffer/skill_coin3", this.clickBtnEvent, this);
    };
    GameUIControl.prototype.clickBtnEvent = function (btn) {
        return __awaiter(this, void 0, void 0, function () {
            var index, rot1, rot2, callFunc, seq, cannonEntity;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("clickBtnEvent", btn.name);
                        if (!("make<Button>" == btn.name)) return [3 /*break*/, 2];
                        index = this.getCanMakeIndex();
                        if (index == null) {
                            return [2 /*return*/];
                        }
                        if (this.m_canMakeCount == 0) {
                            return [2 /*return*/];
                        }
                        if (!this.m_hammerAction) {
                            rot1 = cc.rotateTo(0.2, -90);
                            rot2 = cc.rotateTo(0.2, 0);
                            callFunc = cc.callFunc(function () {
                                this.m_hammerAction = false;
                            }.bind(this));
                            seq = cc.sequence(rot1, rot2, callFunc);
                            this.m_hammer.runAction(seq);
                            this.m_hammerAction = true;
                        }
                        this.subMakeNumber();
                        return [4 /*yield*/, ECSManager_1.default.getInstance().createCannonEntity(index, 16)];
                    case 1:
                        cannonEntity = _a.sent();
                        this.m_cannonList[index].cannon = cannonEntity;
                        return [3 /*break*/, 3];
                    case 2:
                        if ("autoMake<Button>" == btn.name) {
                        }
                        else if ("intensify<Button>" == btn.name) {
                        }
                        else if ("shop<Button>" == btn.name) {
                        }
                        else if ("destroy<Button>" == btn.name) {
                        }
                        else if ("cannon<Button>" == btn.name) {
                        }
                        else if ("bt<Button>" == btn.name) {
                        }
                        else if ("skill_coin0<Button>" == btn.name) {
                        }
                        else if ("skill_coin1<Button>" == btn.name) {
                        }
                        else if ("skill_coin2<Button>" == btn.name) {
                        }
                        else if ("skill_coin3<Button>" == btn.name) {
                        }
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    GameUIControl = __decorate([
        ccclass
    ], GameUIControl);
    return GameUIControl;
}(UIControl_1.UIControl));
exports.default = GameUIControl;

cc._RF.pop();