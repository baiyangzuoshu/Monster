"use strict";
cc._RF.push(module, '8aff4TvHJ5Dj4Vv4JRtNecw', 'IntensifyItemControl');
// Scripts/UI/IntensifyItemControl.ts

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
var IntensifyDataManager_1 = require("../data/IntensifyDataManager");
var PlayerDataManager_1 = require("../Manager/PlayerDataManager");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var IntensifyItemControl = /** @class */ (function (_super) {
    __extends(IntensifyItemControl, _super);
    function IntensifyItemControl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // LIFE-CYCLE CALLBACKS:
        _this.m_title = null;
        _this.m_icon = null;
        _this.m_lvLabel = null;
        _this.m_preLabel = null;
        _this.m_upLevelButton = null;
        _this.m_needDiamond = null;
        _this.m_ID = 0;
        return _this;
    }
    IntensifyItemControl.prototype.onLoad = function () {
        _super.prototype.onLoad.call(this);
        this.m_title = this.getChildByUrl("item/title").getComponent(cc.Label);
        this.m_icon = this.getChildByUrl("item/ui_g_buildUpProb").getComponent(cc.Sprite);
        this.m_lvLabel = this.getChildByUrl("item/lv").getComponent(cc.Label);
        this.m_preLabel = this.getChildByUrl("item/value").getComponent(cc.Label);
        this.m_upLevelButton = this.getChildByUrl("item/upLevel").getComponent(cc.Button);
        this.m_needDiamond = this.getChildByUrl("item/upLevel/Background/Label").getComponent(cc.Label);
        this.buttonAddClickEvent("item/upLevel", this.onClickUp, this);
    };
    IntensifyItemControl.prototype.setID = function (ID) {
        this.m_ID = ID;
    };
    IntensifyItemControl.prototype.setTitle = function (str) {
        this.m_title.string = str;
    };
    IntensifyItemControl.prototype.onClickUp = function () {
        var data = IntensifyDataManager_1.default.getInstance().getIntensifyDataByID(this.m_ID);
        if (data == null)
            return;
        var lv = PlayerDataManager_1.default.getInstance().getInternsifLevel(this.m_ID);
        if (lv >= data['value'].length) {
            lv = data['value'].length - 1;
            this.m_upLevelButton.interactable = false;
            return;
        }
        var needDiamond = IntensifyDataManager_1.default.getInstance().getDiamond(this.m_ID, lv);
        var haveDiamond = PlayerDataManager_1.default.getInstance().getDiamond();
        if (haveDiamond < needDiamond) {
            this.m_upLevelButton.interactable = false;
            return;
        }
        PlayerDataManager_1.default.getInstance().subDiamond(needDiamond);
        PlayerDataManager_1.default.getInstance().addInternsifLevel(this.m_ID);
        //g_gameUI.updateGameUI();
        this.updateItem();
    };
    IntensifyItemControl.prototype.updateItem = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data, title, iconName, gameUIAtlas, frame, lv, needDiamond, haveDiamond, curLv, nextLv, showPer, showPerString;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.m_upLevelButton.interactable = true;
                        data = IntensifyDataManager_1.default.getInstance().getIntensifyDataByID(this.m_ID);
                        if (data == null)
                            return [2 /*return*/];
                        title = IntensifyDataManager_1.default.getInstance().getTitle(this.m_ID, 0);
                        this.setTitle(title);
                        iconName = IntensifyDataManager_1.default.getInstance().getIcon(this.m_ID);
                        return [4 /*yield*/, ResManagerPro_1.ResManagerPro.Instance.IE_GetAsset("texture", "gameUI/gameUI", cc.SpriteAtlas)];
                    case 1:
                        gameUIAtlas = _a.sent();
                        frame = gameUIAtlas.getSpriteFrame(iconName);
                        this.m_icon.spriteFrame = frame;
                        lv = PlayerDataManager_1.default.getInstance().getInternsifLevel(this.m_ID);
                        if (lv >= data['value'].length) {
                            lv = data['value'].length - 1;
                            this.m_upLevelButton.interactable = false;
                        }
                        needDiamond = IntensifyDataManager_1.default.getInstance().getDiamond(this.m_ID, lv);
                        haveDiamond = PlayerDataManager_1.default.getInstance().getDiamond();
                        if (haveDiamond < needDiamond) {
                            this.m_upLevelButton.interactable = false;
                        }
                        this.m_needDiamond.string = '' + needDiamond;
                        this.m_lvLabel.string = 'Lv.' + (lv + 1);
                        curLv = IntensifyDataManager_1.default.getInstance().getValue(this.m_ID, lv);
                        nextLv = IntensifyDataManager_1.default.getInstance().getValue(this.m_ID, lv + 1);
                        showPer = data['showPer'];
                        showPerString = '';
                        if (showPer) {
                            showPerString = '%';
                        }
                        if (nextLv == null) {
                            this.m_preLabel.string = '' + curLv + showPerString + ' - MAX';
                        }
                        else {
                            this.m_preLabel.string = '' + curLv + showPerString + ' - ' + nextLv + showPerString;
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    IntensifyItemControl = __decorate([
        ccclass
    ], IntensifyItemControl);
    return IntensifyItemControl;
}(UIControl_1.UIControl));
exports.default = IntensifyItemControl;

cc._RF.pop();