"use strict";
cc._RF.push(module, '074077yvNFPUYK8/oQptjhm', 'MapUIControl');
// Scripts/UI/MapUIControl.ts

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
var UIControl_1 = require("../../FrameWork/ui/UIControl");
var DataManager_1 = require("../data/DataManager");
var PlayerDataManager_1 = require("../Manager/PlayerDataManager");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var MapUIControl = /** @class */ (function (_super) {
    __extends(MapUIControl, _super);
    function MapUIControl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.m_scrollView = null;
        _this.m_onNode = null;
        _this.m_pointNode = null;
        _this.m_point = null;
        _this.m_curPoint = null;
        _this.m_bossView = null;
        _this.m_bg = null;
        _this.m_labGold = null;
        _this.m_labDiamond = null;
        _this.m_pointData = [];
        _this.m_curtPos = null;
        return _this;
    }
    // LIFE-CYCLE CALLBACKS:
    MapUIControl.prototype.onLoad = function () {
        _super.prototype.onLoad.call(this);
        this.m_scrollView = this.getChildByUrl("scrollview").getComponent(cc.ScrollView);
        this.m_onNode = this.getChildByUrl("scrollview/view/content");
        this.m_pointNode = this.getChildByUrl("scrollview/view/content/point");
        this.m_point = this.getChildByUrl("scrollview/view/content/point/point");
        this.m_curPoint = this.getChildByUrl("scrollview/view/content/point/curPoint");
        this.m_bossView = this.getChildByUrl("bossView");
        this.m_bg = this.getChildByUrl("bg");
        this.m_pointNode.zIndex = 1000;
    };
    MapUIControl.prototype.updatePoint = function () {
        while (this.m_pointNode.children.length) {
            var point = this.m_pointNode.children[0];
            point.removeFromParent();
            point.destroy();
        }
        for (var i = 0; i < this.m_pointData.length; i++) {
            var pos = this.m_pointData[i];
            var node = cc.instantiate(this.m_point);
            this.m_pointNode.addChild(node);
            node.active = true;
            node.setPosition(pos);
        }
        var node = cc.instantiate(this.m_curPoint);
        this.m_pointNode.addChild(node);
        node.active = true;
        node.setPosition(this.m_curtPos);
        this.curPointRunAction(node);
    };
    MapUIControl.prototype.curPointRunAction = function (node) {
        var seq = cc.sequence(cc.scaleTo(0.1, 1.2, 0.8), cc.spawn(cc.moveBy(0.2, cc.v2(0, 30)), cc.scaleTo(0.2, 1, 1)), cc.spawn(cc.moveBy(0.2, cc.v2(0, -30)), cc.scaleTo(0.2, 1.2, 0.8)), cc.scaleTo(0.1, 1, 1));
        node.runAction(cc.repeatForever(seq));
    };
    MapUIControl.prototype.start = function () {
    };
    MapUIControl.prototype.onClickDel = function () {
        this.m_pointData.pop();
        this.updatePoint();
    };
    MapUIControl.prototype.onOut = function () {
        var obj = [];
        for (var i = 0; i < this.m_pointData.length; i++) {
            var pos = cc.v2();
            pos.x = Math.floor(this.m_pointData[i].x);
            pos.y = Math.floor(this.m_pointData[i].y);
            obj.push(pos);
        }
        cc.log(JSON.stringify(obj));
    };
    MapUIControl.prototype.show = function () {
        this.m_bg.active = true;
        this.m_bossView.active = false;
        this.node.active = true;
        this.m_pointData = [];
        var checkPoint = PlayerDataManager_1.default.getInstance().getCheckPoint();
        this.m_curtPos = DataManager_1.default.getInstance().checkPointNodePos[0];
        if (checkPoint.big > 1) {
            for (var i = 0; i < checkPoint.big; i++) {
                var pos = DataManager_1.default.getInstance().checkPointNodePos[i];
                this.m_pointData.push(pos);
            }
        }
        this.m_curtPos = DataManager_1.default.getInstance().checkPointNodePos[checkPoint.big];
        this.updatePoint();
        var value = this.m_curtPos.x - 640 / 2;
        if (value < 0) {
            value = 0;
        }
        var pre = value / this.m_onNode.width;
        this.m_scrollView.scrollToPercentVertical(pre);
    };
    MapUIControl.prototype.hide = function () {
        this.node.active = false;
    };
    MapUIControl.prototype.onClickBG = function () {
        this.hide();
    };
    MapUIControl.prototype.showBossView = function () {
        this.show();
        this.m_bossView.active = true;
        this.m_bg.active = false;
    };
    MapUIControl.prototype.hideBossView = function () {
        this.hide();
        this.m_bossView.active = false;
    };
    MapUIControl.prototype.goldFlyEnd = function (gold) {
        PlayerDataManager_1.default.getInstance().addGold(gold);
        //g_gameUI.updateGameUI();
    };
    MapUIControl.prototype.diamondFlyEnd = function (diamond) {
        PlayerDataManager_1.default.getInstance().addDiamond(diamond);
        //g_gameUI.updateGameUI();
    };
    MapUIControl.prototype.showSucceed = function (gold, diamond) {
        this.m_labGold.string = '' + gold.toString();
        this.m_labDiamond.string = '' + diamond.toString();
        this.showBossView();
        var count = 50;
        var createFly = function () {
            if (gold > 0) {
                var addGold = Math.floor(gold / count);
                //g_coinFly.createCoinToTip(this.m_labGold.node,this.goldFlyEnd.bind(this),addGold);
            }
            if (diamond > 0) {
                var addDiamond = Math.floor(diamond / count);
                //g_diamondFly.createDiamondToTip(this.m_labDiamond.node,this.diamondFlyEnd.bind(this),addDiamond);
            }
        };
        var actionList = [];
        actionList.push(cc.delayTime(1));
        for (var i = 0; i < count; i++) {
            actionList.push(cc.delayTime(0.01));
            actionList.push(cc.callFunc(createFly.bind(this)));
        }
        actionList.push(cc.callFunc(function () {
            PlayerDataManager_1.default.getInstance().setGold(gold);
            PlayerDataManager_1.default.getInstance().setDiamond(diamond);
            //g_gameUI.updateGameUI();
        }.bind(this)));
        this.node.runAction(cc.sequence(actionList));
        // this.m_labGold.string = numberToString(gold);
    };
    MapUIControl = __decorate([
        ccclass
    ], MapUIControl);
    return MapUIControl;
}(UIControl_1.UIControl));
exports.default = MapUIControl;

cc._RF.pop();