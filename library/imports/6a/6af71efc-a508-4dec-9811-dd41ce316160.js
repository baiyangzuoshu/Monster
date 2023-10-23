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
var EventManager_1 = require("../../FrameWork/manager/EventManager");
var ResManagerPro_1 = require("../../FrameWork/manager/ResManagerPro");
var UIManagerPro_1 = require("../../FrameWork/manager/UIManagerPro");
var UIControl_1 = require("../../FrameWork/ui/UIControl");
var IntensifyDataManager_1 = require("../data/IntensifyDataManager");
var ECSManager_1 = require("../ECS/ECSManager");
var EntityUtils_1 = require("../ECS/EntityUtils");
var Enum_1 = require("../Enum");
var EventName_1 = require("../EventName");
var MapDataManager_1 = require("../Manager/MapDataManager");
var PlayerDataManager_1 = require("../Manager/PlayerDataManager");
var CrownControl_1 = require("./CrownControl");
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
        _this.m_curZIndex = 0;
        _this.m_selecetCannon = null;
        _this.m_moveCannon = null;
        _this.m_moveCannonNode = null;
        _this.m_labGold = null;
        _this.m_diamond = null;
        _this.m_curCrown = null;
        _this.m_nextCrown = null;
        _this.crownBuild = null;
        _this.m_destroyNode = null;
        return _this;
    }
    GameUIControl.prototype.onLoad = function () {
        _super.prototype.onLoad.call(this);
        PlayerDataManager_1.default.getInstance().gameStateType = Enum_1.GameStateType.None;
        this.m_water = this.getChildByUrl("bottom/make/ui_build_water");
        this.m_hammer = this.getChildByUrl("bottom/make/ui_build_hammer");
        this.m_labGold = this.getChildByUrl("top/glod/btGlod/ui_coin_rect/gold").getComponent(cc.Label);
        this.m_diamond = this.getChildByUrl("top/glod/btDiamond/ui_coin_rect/diamond").getComponent(cc.Label);
        this.m_makeNumberLabel = this.getChildByUrl("bottom/make/num").getComponent(cc.Label);
        this.m_destroyNode = this.getChildByUrl("bottom/destroy");
        this.updateGameUI();
        this.refreshGoldDiamond();
        this.registerBottomBtn();
        this.registerUIEvents();
        this.registerTopBtn();
    };
    GameUIControl.prototype.registerUIEvents = function () {
        EventManager_1.EventManager.getInstance().addEventListener(EventName_1.GameUI.refreshGoldDiamond, this.refreshGoldDiamond, this);
        EventManager_1.EventManager.getInstance().addEventListener(EventName_1.GameUI.gameOver, this.gameOver, this);
    };
    GameUIControl.prototype.onDestroy = function () {
        EventManager_1.EventManager.getInstance().removeEventListener(EventName_1.GameUI.refreshGoldDiamond, this.refreshGoldDiamond, this);
        EventManager_1.EventManager.getInstance().removeEventListener(EventName_1.GameUI.gameOver, this.gameOver, this);
    };
    GameUIControl.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            var canvas, _cannonList, i, ts;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        canvas = cc.find("Canvas");
                        this.m_moveCannonNode = this.getChildByUrl("moveCannon");
                        this.crownBuild = canvas.getChildByName("Game").getChildByName("crownBuild");
                        _cannonList = MapDataManager_1.default.getInstance().getCurCannonPoint();
                        for (i = 0; i < _cannonList.length; i++) {
                            this.m_cannonList[i] = this.createCannonData();
                            this.m_cannonList[i].pos = _cannonList[i];
                        }
                        this.m_curZIndex = 100;
                        this.m_moveCannonNode.on('touchstart', this.touchStart, this);
                        this.m_moveCannonNode.on('touchmove', this.touchMove, this);
                        this.m_moveCannonNode.on('touchend', this.touchEnd, this);
                        this.m_moveCannonNode.on('touchcancel', this.touchCancel, this);
                        this.buildEndPoint();
                        return [4 /*yield*/, UIManagerPro_1.UIManagerPro.getInstance().showPrefab("BossUI")];
                    case 1:
                        ts = _a.sent();
                        ts.play(function () {
                            PlayerDataManager_1.default.getInstance().gameStateType = Enum_1.GameStateType.Playing;
                            MapDataManager_1.default.getInstance().beginCreateMonster();
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    GameUIControl.prototype.gameOver = function () {
        this.moveToNextMap();
    };
    GameUIControl.prototype.buildEndPoint = function () {
        return __awaiter(this, void 0, void 0, function () {
            var list, lastPos, pos, crownPrefab;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        list = MapDataManager_1.default.getInstance().getCurPahtList();
                        lastPos = list[list.length - 1];
                        pos = cc.v2(0, 0);
                        pos.x = lastPos.x * 106 + 106 / 2;
                        pos.y = -lastPos.y * 106 - 106 / 2;
                        if (!(this.m_curCrown == null)) return [3 /*break*/, 2];
                        return [4 /*yield*/, ResManagerPro_1.ResManagerPro.Instance.IE_GetAsset("prefabs", "crown", cc.Prefab)];
                    case 1:
                        crownPrefab = _a.sent();
                        this.m_curCrown = cc.instantiate(crownPrefab);
                        this.crownBuild.addChild(this.m_curCrown);
                        this.m_curCrown.addComponent(CrownControl_1.default);
                        _a.label = 2;
                    case 2:
                        pos.y += 25;
                        this.m_curCrown.setPosition(pos);
                        return [2 /*return*/];
                }
            });
        });
    };
    GameUIControl.prototype.setNextCrownPos = function (pos) {
        return __awaiter(this, void 0, void 0, function () {
            var crownPrefab;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.m_nextCrown == null)) return [3 /*break*/, 2];
                        return [4 /*yield*/, ResManagerPro_1.ResManagerPro.Instance.IE_GetAsset("prefabs", "crown", cc.Prefab)];
                    case 1:
                        crownPrefab = _a.sent();
                        this.m_nextCrown = cc.instantiate(crownPrefab);
                        this.m_nextCrown.addComponent(CrownControl_1.default);
                        this.crownBuild.addChild(this.m_nextCrown);
                        _a.label = 2;
                    case 2:
                        pos.y += 25;
                        this.m_nextCrown.setPosition(pos);
                        return [2 /*return*/];
                }
            });
        });
    };
    GameUIControl.prototype.moveToNextMap = function () {
        var moveTo = cc.moveBy(0.5, cc.v2(-640, 0));
        var callFunc = cc.callFunc(function () {
            this.crownBuild.setPosition(cc.v2(-320, 310));
            this.buildEndPoint();
        }.bind(this));
        this.crownBuild.runAction(cc.sequence(moveTo, callFunc));
    };
    GameUIControl.prototype.touchStart = function (event) {
        var pos = event.getLocation();
        var nodePos = this.m_moveCannonNode.convertToNodeSpaceAR(pos);
        this.m_selecetCannon = this.getCannonByPosition(nodePos);
        if (this.m_selecetCannon != null) {
            var cannonEntity = this.m_selecetCannon.cannonEntity;
            if (cannonEntity != null) {
                if (this.m_moveCannon != null) {
                    this.m_moveCannon.removeFromParent();
                    this.m_moveCannon = null;
                }
                this.m_moveCannon = cc.instantiate(cannonEntity.baseComponent.gameObject);
                this.m_moveCannonNode.addChild(this.m_moveCannon);
                this.m_moveCannon.getChildByName("range").active = true;
                this.showCannonHint(cannonEntity);
                this.setShowDestroy(true);
            }
            else {
                this.m_selecetCannon = null;
            }
        }
    };
    GameUIControl.prototype.touchMove = function (event) {
        if (this.m_moveCannon == null)
            return;
        var delta = event.getDelta();
        var pos = this.m_moveCannon.getPosition();
        pos.x += delta.x;
        pos.y += delta.y;
        this.m_moveCannon.setPosition(pos);
        var pos = event.getLocation();
        var nodePos = this.m_moveCannonNode.convertToNodeSpaceAR(pos);
        var cannon = this.getCannonByPosition(nodePos);
        if (cannon != null) {
            var cannonEntity = cannon.cannonEntity;
            if (cannonEntity != null) {
                cannonEntity.baseComponent.gameObject.getChildByName("range").active = true;
            }
            else {
                this.hideCannonRange();
            }
        }
    };
    GameUIControl.prototype.touchEnd = function (event) {
        //this.setAllCannonOpacity();
        var pos = event.getLocation();
        var nodePos = this.m_moveCannonNode.convertToNodeSpaceAR(pos);
        var block = this.getCannonByPosition(nodePos);
        if (block != null) {
            if (this.m_moveCannon != null) {
                this.changeCannon(this.m_selecetCannon, block);
            }
        }
        if (this.m_moveCannon != null) {
            this.m_moveCannon.removeFromParent();
            this.m_moveCannon = null;
            this.hideCannonHint();
        }
        this.hideCannonRange();
        this.setShowDestroy(false);
        var pos = event.getLocation();
        if (this.isInDestroy(pos)) {
            // this.m_selecetCannon.cannonEntity.node.removeFromParent();
            // this.m_selecetCannon.cannonEntity.node.destroy();
            // this.m_selecetCannon.cannonEntity = null;
        }
    };
    GameUIControl.prototype.touchCancel = function (event) {
        //this.setAllCannonOpacity();
        if (this.m_moveCannon != null) {
            this.m_moveCannon.removeFromParent();
            this.m_moveCannon = null;
        }
        this.hideCannonRange();
        this.setShowDestroy(false);
        var pos = event.getLocation();
        if (this.isInDestroy(pos)) {
            // this.m_selecetCannon.cannonEntity.node.removeFromParent();
            // this.m_selecetCannon.cannonEntity.node.destroy();
            // this.m_selecetCannon.cannon = null;
        }
    };
    GameUIControl.prototype.changeCannon = function (startItem, endItem) {
        if (startItem.pos.x == endItem.pos.x &&
            startItem.pos.y == endItem.pos.y) {
            return;
        }
        var startEntity = startItem.cannonEntity;
        var endEntity = endItem.cannonEntity;
        if (startEntity == null) {
            return;
        }
        //3.结束为有炮,需要合成.
        var playEffect = false;
        if (endEntity != null) {
            if (EntityUtils_1.default.getInstance().cannonCompare(startEntity.roleComponent, endEntity.roleComponent)) {
                EntityUtils_1.default.getInstance().cannonLevelUp(startEntity.roleComponent, startEntity.baseComponent);
                endEntity.unitComponent.isDead = true;
                endEntity.baseComponent.gameObject.destroy();
                endEntity = null;
                playEffect = true;
                //
                PlayerDataManager_1.default.getInstance().addTaskCount(Enum_1.Task.TASK_HEBING_FANGYUTA);
                PlayerDataManager_1.default.getInstance().addTaskCount(Enum_1.Chengjiou.CHENGJIOU_QIANGHUA_JINENG);
            }
        }
        //1.结束位置没有炮
        if (endItem == null) {
            // var a = 1;
            // a = 1;
        }
        if (endEntity == null) {
            startEntity.baseComponent.gameObject.x = endItem.pos.x * 106 + 106 / 2;
            startEntity.baseComponent.gameObject.y = -endItem.pos.y * 106 - 106 / 2;
            startEntity.transformComponent.x = startEntity.baseComponent.gameObject.x;
            startEntity.transformComponent.y = startEntity.baseComponent.gameObject.y;
            endItem.cannonEntity = startItem.cannonEntity;
            startItem.cannonEntity = endEntity;
            if (playEffect) {
                //endEntity.effectAction();
            }
        }
        else {
            //2.结束位置有炮,但是登陆或类型不同.
            startEntity.baseComponent.gameObject.x = endItem.pos.x * 106 + 106 / 2;
            startEntity.baseComponent.gameObject.y = -endItem.pos.y * 106 - 106 / 2;
            startEntity.transformComponent.x = startEntity.baseComponent.gameObject.x;
            startEntity.transformComponent.y = startEntity.baseComponent.gameObject.y;
            endEntity.baseComponent.gameObject.x = startItem.pos.x * 106 + 106 / 2;
            endEntity.baseComponent.gameObject.y = -startItem.pos.y * 106 - 106 / 2;
            endEntity.transformComponent.x = startEntity.baseComponent.gameObject.x;
            endEntity.transformComponent.y = startEntity.baseComponent.gameObject.y;
            endItem.cannonEntity = startItem.cannonEntity;
            startItem.cannonEntity = endEntity;
        }
    };
    GameUIControl.prototype.showCannonHint = function (cannon) {
        for (var i = 0; i < this.m_cannonList.length; i++) {
            var entity = this.m_cannonList[i].cannonEntity;
            if (entity != null) {
                if (entity.roleComponent.level == cannon.roleComponent.level) {
                    entity.baseComponent.gameObject.getChildByName("ui_mergeRemind").active = true;
                }
            }
        }
    };
    GameUIControl.prototype.hideCannonHint = function () {
        for (var i = 0; i < this.m_cannonList.length; i++) {
            var entity = this.m_cannonList[i].cannonEntity;
            if (entity != null) {
                entity.baseComponent.gameObject.getChildByName("ui_mergeRemind").active = false;
            }
        }
    };
    GameUIControl.prototype.hideCannonRange = function () {
        for (var i = 0; i < this.m_cannonList.length; i++) {
            var cannonEntity = this.m_cannonList[i].cannonEntity;
            if (cannonEntity != null) {
                cannonEntity.baseComponent.gameObject.getChildByName("range").active = false;
            }
        }
    };
    GameUIControl.prototype.setShowDestroy = function (bShow) {
        this.m_destroyNode.active = bShow;
    };
    GameUIControl.prototype.isInDestroy = function (world_pos) {
        var pos = this.m_destroyNode.convertToNodeSpaceAR(world_pos);
        if (pos.x < 50 &&
            pos.x > -50 &&
            pos.y < 50 &&
            pos.y > -50) {
            return true;
        }
        return false;
    };
    GameUIControl.prototype.createCannonData = function () {
        var obj = {};
        obj.pos = cc.v2(0, 0);
        obj.cannonEntity = null;
        return obj;
    };
    GameUIControl.prototype.getCannonByPosition = function (nodePos) {
        var x = Math.floor(nodePos.x / 106);
        var y = Math.floor((-nodePos.y) / 106);
        console.log(x, y);
        for (var i = 0; i < this.m_cannonList.length; i++) {
            if (this.m_cannonList[i].pos.x == x && this.m_cannonList[i].pos.y == y) {
                return this.m_cannonList[i];
            }
        }
        return null;
    };
    GameUIControl.prototype.getCanMakeIndex = function () {
        for (var i = 0; i < this.m_cannonList.length; i++) {
            if (this.m_cannonList[i].cannonEntity == null) {
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
    GameUIControl.prototype.refreshGoldDiamond = function () {
        var gold = PlayerDataManager_1.default.getInstance().getGold();
        var diamond = PlayerDataManager_1.default.getInstance().getDiamond();
        this.m_labGold.string = '' + gold;
        this.m_diamond.string = '' + diamond;
        //this.updateCheckPoint();
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
    GameUIControl.prototype.registerTopBtn = function () {
        this.buttonAddClickEvent("top/glod/btGlod", this.clickBtnEvent, this);
        this.buttonAddClickEvent("top/glod/btDiamond", this.clickBtnEvent, this);
        this.buttonAddClickEvent("top/map", this.clickBtnEvent, this);
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
                        return [4 /*yield*/, ECSManager_1.default.getInstance().createCannonEntity(index, 0)];
                    case 1:
                        cannonEntity = _a.sent();
                        this.m_cannonList[index].cannonEntity = cannonEntity;
                        return [3 /*break*/, 3];
                    case 2:
                        if ("map<Button>" == btn.name) {
                            UIManagerPro_1.UIManagerPro.getInstance().showPrefab("MapUI");
                        }
                        else if ("btGlod<Button>" == btn.name) {
                            PlayerDataManager_1.default.getInstance().addGold(100);
                        }
                        else if ("btDiamond<Button>" == btn.name) {
                            PlayerDataManager_1.default.getInstance().addDiamond(100);
                        }
                        else if ("bt<Button>" == btn.name) {
                            UIManagerPro_1.UIManagerPro.getInstance().showPrefab("TaskUI");
                        }
                        else if ("autoMake<Button>" == btn.name) {
                        }
                        else if ("intensify<Button>" == btn.name) {
                            UIManagerPro_1.UIManagerPro.getInstance().showPrefab("IntensifyUI");
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