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
var ECSManager_1 = require("../ECS/ECSManager");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var GameUIControl = /** @class */ (function (_super) {
    __extends(GameUIControl, _super);
    function GameUIControl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GameUIControl.prototype.onLoad = function () {
        _super.prototype.onLoad.call(this);
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
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("clickBtnEvent", btn.name);
                        if (!("make<Button>" == btn.name)) return [3 /*break*/, 2];
                        return [4 /*yield*/, ECSManager_1.default.getInstance().createCannonEntity(1, 1)];
                    case 1:
                        _a.sent();
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
    GameUIControl.prototype.start = function () {
    };
    GameUIControl = __decorate([
        ccclass
    ], GameUIControl);
    return GameUIControl;
}(UIControl_1.UIControl));
exports.default = GameUIControl;

cc._RF.pop();