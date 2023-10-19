"use strict";
cc._RF.push(module, '6a89aZprghB5pFCWYhYpWiW', 'TaskDataManager');
// Scripts/data/TaskDataManager.ts

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
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var TaskDataManager = /** @class */ (function (_super) {
    __extends(TaskDataManager, _super);
    function TaskDataManager() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.data = [
            {
                title: '[合成]合成防御塔{0}次',
                max: [1, 5, 10, 20, 30, 60, 120, 150, 200, 280, 400],
                award: [10, 50, 110, 200, 300, 600, 1200, 1500, 2000, 2800, 4000],
                taskType: 0,
            },
            {
                title: '击败{0}个敌人',
                max: [1, 5, 10, 20, 30, 60, 120, 150, 200, 280, 400],
                award: [1, 5, 10, 20, 30, 60, 120, 150, 200, 280, 400],
                taskType: 0,
            },
            {
                title: '强化技能{0}次',
                max: [1, 5, 10, 20, 30, 60, 120, 150, 200, 280, 400],
                award: [1, 5, 10, 20, 30, 60, 120, 150, 200, 280, 400],
                taskType: 0,
            },
            {
                title: '合成{0}次防御塔',
                max: [1, 5, 10, 20, 30, 60, 120, 150, 200, 280, 400],
                award: [10, 50, 110, 200, 300, 600, 1200, 1500, 2000, 2800, 4000],
                taskType: 1,
            },
        ];
        return _this;
    }
    TaskDataManager_1 = TaskDataManager;
    TaskDataManager.getInstance = function () {
        return TaskDataManager_1._instance;
    };
    TaskDataManager.prototype.onLoad = function () {
        if (null === TaskDataManager_1._instance) {
            TaskDataManager_1._instance = this;
        }
        else {
            this.destroy();
            return;
        }
    };
    TaskDataManager.prototype.getTaskDataByID = function (taskID) {
        if (taskID >= this.data.length) {
            return null;
        }
        return this.data[taskID];
    };
    TaskDataManager.prototype.getAward = function (taskID, index) {
        var taskData = this.getTaskDataByID(taskID);
        if (taskData == null) {
            return null;
        }
        var award = taskData.award;
        if (index >= award.leight) {
            index = award.leight - 1;
        }
        return award[index];
    };
    TaskDataManager.prototype.getTitle = function (taskID, index) {
        var taskData = this.getTaskDataByID(taskID);
        if (taskData == null) {
            return null;
        }
        var title = taskData.title;
        if (index >= taskData.max.leight) {
            index = taskData.max.leight - 1;
        }
        return title.format(this.data[taskID].max[index]);
    };
    TaskDataManager.prototype.getMaxCount = function (taskID, maxIndex) {
        var taskData = this.getTaskDataByID(taskID);
        if (taskData == null) {
            return null;
        }
        if (maxIndex >= taskData.max.leight) {
            maxIndex = taskData.max.leight - 1;
        }
        return this.data[taskID].max[maxIndex];
    };
    TaskDataManager.prototype.getData = function () {
        return this.data;
    };
    var TaskDataManager_1;
    TaskDataManager._instance = null;
    TaskDataManager = TaskDataManager_1 = __decorate([
        ccclass
    ], TaskDataManager);
    return TaskDataManager;
}(cc.Component));
exports.default = TaskDataManager;

cc._RF.pop();