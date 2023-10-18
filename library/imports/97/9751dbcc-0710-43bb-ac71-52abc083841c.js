"use strict";
cc._RF.push(module, '9751dvMBxBDu6xxUqvAg4Qc', 'PlayerDataManager');
// Scripts/Manager/PlayerDataManager.ts

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
var PlayerDataManager = /** @class */ (function (_super) {
    __extends(PlayerDataManager, _super);
    function PlayerDataManager() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.userData = null;
        _this.getTaskByID = function (taskID) {
            if (this.userData.taskData == null) {
                this.userData.taskData = [];
            }
            if (this.userData.taskData[taskID] == null) {
                this.userData.taskData[taskID] = {};
            }
            if (this.userData.taskData[taskID].curCount == null) {
                this.userData.taskData[taskID].curCount = 0;
            }
            if (this.userData.taskData[taskID].maxIndex == null) {
                this.userData.taskData[taskID].maxIndex = 0;
            }
            return this.userData.taskData[taskID];
        };
        //强化
        _this.getInternsifLevel = function (ID) {
            if (this.userData.internsifLevel == null) {
                this.userData.internsifLevel = [];
            }
            if (this.userData.internsifLevel[ID] == null) {
                this.userData.internsifLevel[ID] = 0;
            }
            return this.userData.internsifLevel[ID];
        };
        return _this;
    }
    PlayerDataManager_1 = PlayerDataManager;
    PlayerDataManager.getInstance = function () {
        return PlayerDataManager_1._instance;
    };
    PlayerDataManager.prototype.onLoad = function () {
        if (null === PlayerDataManager_1._instance) {
            PlayerDataManager_1._instance = this;
        }
        else {
            this.destroy();
            return;
        }
    };
    PlayerDataManager.prototype.save = function () {
        var str = JSON.stringify(this.userData);
        cc.sys.localStorage.setItem('userData', str);
    };
    PlayerDataManager.prototype.load = function () {
        var str = cc.sys.localStorage.getItem('userData');
        if (str == null || str == '') {
            this.userData = {};
            return;
        }
        this.userData = JSON.parse(str);
    };
    PlayerDataManager.prototype.del = function () {
        cc.sys.localStorage.removeItem('userData');
    };
    PlayerDataManager.prototype.getGold = function () {
        if (this.userData.gold == null) {
            this.userData.gold = 0;
        }
        return this.userData.gold;
    };
    PlayerDataManager.prototype.setGold = function (gold) {
        this.userData.gold = gold;
        this.save();
    };
    PlayerDataManager.prototype.subGold = function (subNum) {
        if (this.userData.gold == null) {
            this.userData.gold = 0;
        }
        this.userData.gold -= subNum;
        this.save();
    };
    PlayerDataManager.prototype.addGold = function (addNum) {
        if (this.userData.gold == null) {
            this.userData.gold = 0;
        }
        this.userData.gold += addNum;
        this.save();
    };
    PlayerDataManager.prototype.getDiamond = function () {
        if (this.userData.diamond == null) {
            this.userData.diamond = 30;
        }
        return this.userData.diamond;
    };
    PlayerDataManager.prototype.setDiamond = function (diamond) {
        this.userData.diamond = diamond;
        this.save();
    };
    PlayerDataManager.prototype.subDiamond = function (subNum) {
        if (this.userData.diamond == null) {
            this.userData.diamond = 0;
        }
        this.userData.diamond -= subNum;
        this.save();
    };
    PlayerDataManager.prototype.addDiamond = function (addNum) {
        if (this.userData.diamond == null) {
            this.userData.diamond = 0;
        }
        this.userData.diamond += addNum;
        this.save();
    };
    //大关卡
    PlayerDataManager.prototype.getBigCheckPointCount = function () {
        if (this.userData.bigCheckPointCount == null) {
            this.userData.bigCheckPointCount = 0;
        }
        return this.userData.bigCheckPointCount;
    };
    PlayerDataManager.prototype.setBigCheckPointCount = function (big) {
        this.userData.bigCheckPointCount = big;
    };
    PlayerDataManager.prototype.addBigCheckPointCount = function () {
        if (this.userData.bigCheckPointCount == null) {
            this.userData.bigCheckPointCount = 0;
        }
        this.save();
        return this.userData.bigCheckPointCount++;
    };
    PlayerDataManager.prototype.subBigCheckPointCount = function () {
        if (this.userData.bigCheckPointCount == null) {
            this.userData.bigCheckPointCount = 0;
        }
        if (this.userData.bigCheckPointCount == 0) {
            return 0;
        }
        this.save();
        return this.userData.bigCheckPointCount--;
    };
    //小关卡
    PlayerDataManager.prototype.getSmallCheckPointCount = function () {
        if (this.userData.smallCheckPointCount == null) {
            this.userData.smallCheckPointCount = 0;
        }
        return this.userData.smallCheckPointCount;
    };
    PlayerDataManager.prototype.setSmallCheckPointCount = function (small) {
        this.userData.smallCheckPointCount = small;
    };
    PlayerDataManager.prototype.addSmallCheckPointCount = function () {
        if (this.userData.smallCheckPointCount == null) {
            this.userData.smallCheckPointCount = 0;
        }
        this.save();
        return this.userData.smallCheckPointCount++;
    };
    PlayerDataManager.prototype.subSmallCheckPointCount = function () {
        if (this.userData.smallCheckPointCount == null) {
            this.userData.smallCheckPointCount = 0;
        }
        if (this.userData.smallCheckPointCount == 0) {
            return 0;
        }
        this.save();
        return this.userData.bigCheckPointCount--;
    };
    PlayerDataManager.prototype.getCheckPoint = function () {
        var checkPoint = {};
        checkPoint.big = this.getBigCheckPointCount();
        checkPoint.small = this.getSmallCheckPointCount();
        // checkPoint.big = 10;
        return checkPoint;
    };
    PlayerDataManager.prototype.addTaskCount = function (taskID) {
        var item = this.getTaskByID(taskID);
        if (item == null) {
            return false;
        }
        this.userData.taskData[taskID].curCount++;
        this.save();
        return this.userData.taskData[taskID].curCount;
    };
    PlayerDataManager.prototype.nextTask = function (taskID) {
        var item = this.getTaskByID(taskID);
        if (item == null) {
            return false;
        }
        this.userData.taskData[taskID].curCount = 0;
        this.userData.taskData[taskID].maxIndex++;
        this.save();
        return this.userData.taskData[taskID].curCount;
    };
    PlayerDataManager.prototype.addInternsifLevel = function (ID) {
        if (this.userData.internsifLevel == null) {
            this.userData.internsifLevel = [];
        }
        if (this.userData.internsifLevel[ID] == null) {
            this.userData.internsifLevel[ID] = 0;
        }
        this.userData.internsifLevel[ID]++;
        this.save();
        return this.userData.internsifLevel[ID];
    };
    var PlayerDataManager_1;
    PlayerDataManager._instance = null;
    PlayerDataManager = PlayerDataManager_1 = __decorate([
        ccclass
    ], PlayerDataManager);
    return PlayerDataManager;
}(cc.Component));
exports.default = PlayerDataManager;

cc._RF.pop();