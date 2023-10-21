"use strict";
cc._RF.push(module, 'dd617aYszNH2ZYtGH87x92G', 'TaskItemControl');
// Scripts/UI/TaskItemControl.ts

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
var TaskDataManager_1 = require("../data/TaskDataManager");
var PlayerDataManager_1 = require("../Manager/PlayerDataManager");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var TaskItemControl = /** @class */ (function (_super) {
    __extends(TaskItemControl, _super);
    function TaskItemControl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.m_title = null;
        _this.m_curLabel = null;
        _this.m_progressBar = null;
        _this.m_awardLabl = null;
        _this.m_getButton = null;
        _this.m_awardCoin = null;
        _this.m_awardDiamond = null;
        _this.m_taskID = 0;
        return _this;
    }
    // LIFE-CYCLE CALLBACKS:
    TaskItemControl.prototype.onLoad = function () {
        _super.prototype.onLoad.call(this);
        this.m_title = this.getChildByUrl("item/title").getComponent(cc.Label);
        this.m_curLabel = this.getChildByUrl("item/curLabel").getComponent(cc.Label);
        this.m_progressBar = this.getChildByUrl("item/progressBar").getComponent(cc.ProgressBar);
        this.m_awardLabl = this.getChildByUrl("item/ui_win_numbg_rect/award").getComponent(cc.Label);
        this.m_getButton = this.getChildByUrl("item/get").getComponent(cc.Button);
        this.m_awardCoin = this.getChildByUrl("item/ui_win_numbg_rect/ui_coin");
        this.m_awardDiamond = this.getChildByUrl("item/ui_win_numbg_rect/ui_diamond");
        this.buttonAddClickEvent("item/get", this.onClickGet, this);
    };
    TaskItemControl.prototype.setTaskID = function (taskID) {
        this.m_taskID = taskID;
    };
    TaskItemControl.prototype.updateItem = function () {
        this.m_getButton.interactable = false;
        var data = TaskDataManager_1.default.getInstance().getData();
        var taskData = TaskDataManager_1.default.getInstance().getTaskDataByID(this.m_taskID);
        if (this.m_taskID >= data.length) {
            return;
        }
        var curTaskData = PlayerDataManager_1.default.getInstance().getTaskByID(this.m_taskID);
        var title = TaskDataManager_1.default.getInstance().getTitle(this.m_taskID, curTaskData.maxIndex);
        this.m_title.string = title;
        var maxCount = TaskDataManager_1.default.getInstance().getMaxCount(this.m_taskID, curTaskData.maxIndex);
        if (curTaskData.curCount >= maxCount) {
            curTaskData.curCount = maxCount;
            this.m_getButton.interactable = true;
        }
        var curLabel = '' + curTaskData.curCount + '/' + maxCount;
        this.m_curLabel.string = curLabel;
        var pre = curTaskData.curCount / maxCount;
        this.m_progressBar.progress = pre;
        if (taskData.taskType == 0) {
            this.m_awardCoin.active = true;
            this.m_awardDiamond.active = false;
        }
        else {
            this.m_awardCoin.active = false;
            this.m_awardDiamond.active = true;
        }
        this.m_awardLabl.string = TaskDataManager_1.default.getInstance().getAward(this.m_taskID, curTaskData.maxIndex);
    };
    TaskItemControl.prototype.goldFlyEnd = function (gold) {
        PlayerDataManager_1.default.getInstance().addGold(gold);
        //g_gameUI.updateGameUI();
    };
    TaskItemControl.prototype.diamondFlyEnd = function (diamond) {
        PlayerDataManager_1.default.getInstance().addDiamond(diamond);
        //g_gameUI.updateGameUI();
    };
    TaskItemControl.prototype.onClickGet = function () {
        var curTaskData = PlayerDataManager_1.default.getInstance().getTaskByID(this.m_taskID);
        var award = TaskDataManager_1.default.getInstance().getAward(this.m_taskID, curTaskData.maxIndex);
        var taskData = TaskDataManager_1.default.getInstance().getTaskDataByID(this.m_taskID);
        var count = 50;
        var createFly = function () {
            if (taskData.taskType == 0) {
                var value = Math.floor(award / count);
                //g_coinFly.createCoinToTip(this.m_awardCoin,this.goldFlyEnd.bind(this),value,g_gameUI.m_coinFlyNode);
            }
            if (taskData.taskType == 1) {
                var value = Math.floor(award / count);
                //g_diamondFly.createDiamondToTip(this.m_awardCoin,this.diamondFlyEnd.bind(this),value,g_gameUI.m_coinFlyNode);
            }
        };
        var actionList = [];
        // actionList.push(cc.delayTime(1));
        if (award < count) {
            count = award;
        }
        for (var i = 0; i < count; i++) {
            actionList.push(cc.delayTime(0.01));
            actionList.push(cc.callFunc(createFly.bind(this)));
        }
        actionList.push(cc.callFunc(function () {
            if (taskData.taskType == 0) {
                PlayerDataManager_1.default.getInstance().setGold(award);
            }
            else {
                PlayerDataManager_1.default.getInstance().setDiamond(award);
            }
            //g_gameUI.updateGameUI();
        }.bind(this)));
        this.node.runAction(cc.sequence(actionList));
        PlayerDataManager_1.default.getInstance().nextTask(this.m_taskID);
        this.updateItem();
    };
    TaskItemControl = __decorate([
        ccclass
    ], TaskItemControl);
    return TaskItemControl;
}(UIControl_1.UIControl));
exports.default = TaskItemControl;

cc._RF.pop();