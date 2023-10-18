"use strict";
cc._RF.push(module, '2c4f3L0BDJHGJOG8ZZQ9DQo', 'DataManager');
// Scripts/data/DataManager.ts

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
var PlayerDataManager_1 = require("../Manager/PlayerDataManager");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var DataManager = /** @class */ (function (_super) {
    __extends(DataManager, _super);
    function DataManager() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.checkPointNodePos = [{ x: 94, y: -114 }, { x: 173, y: -68 }, { x: 228, y: -156 }, { x: 343, y: -161 }, { x: 393, y: -64 }, { x: 508, y: -70 }, { x: 545, y: -159 }, { x: 658, y: -132 }, { x: 762, y: -156 }, { x: 812, y: -70 }, { x: 924, y: -101 }, { x: 1028, y: -70 }, { x: 1070, y: -161 }, { x: 1190, y: -132 }, { x: 1291, y: -159 }, { x: 1361, y: -99 }, { x: 1474, y: -64 }, { x: 1535, y: -156 }, { x: 1637, y: -156 }, { x: 1692, y: -79 }, { x: 1799, y: -68 }, { x: 1841, y: -159 }, { x: 1958, y: -132 }, { x: 2057, y: -156 }, { x: 2106, y: -68 }, { x: 2216, y: -90 }, { x: 2324, y: -68 }, { x: 2363, y: -159 }, { x: 2484, y: -125 }, { x: 2590, y: -152 }, { x: 2662, y: -101 }, { x: 2770, y: -64 }, { x: 2829, y: -152 }, { x: 2937, y: -154 }, { x: 2981, y: -70 }, { x: 3104, y: -68 }, { x: 3131, y: -156 }, { x: 3249, y: -128 }, { x: 3366, y: -163 }, { x: 3399, y: -62 }, { x: 3516, y: -95 }, { x: 3624, y: -73 }, { x: 3665, y: -156 }, { x: 3786, y: -132 }, { x: 3892, y: -161 }, { x: 3962, y: -90 }, { x: 4072, y: -73 }, { x: 4125, y: -161 }, { x: 4243, y: -156 }, { x: 4285, y: -70 }, { x: 4395, y: -70 }, { x: 4436, y: -156 }, { x: 4551, y: -125 }, { x: 4656, y: -163 }, { x: 4694, y: -73 }, { x: 4809, y: -95 }, { x: 4924, y: -68 }, { x: 4966, y: -161 }, { x: 5078, y: -130 }, { x: 5183, y: -161 }, { x: 5256, y: -99 }, { x: 5371, y: -73 }, { x: 5428, y: -154 }, { x: 5536, y: -163 }, { x: 5575, y: -68 }, { x: 5690, y: -73 }, { x: 5729, y: -156 }, { x: 5850, y: -134 }, { x: 5956, y: -152 }, { x: 6002, y: -70 }, { x: 6112, y: -97 }, { x: 6246, y: -79 }, { x: 6275, y: -156 }, { x: 6394, y: -137 }, { x: 6504, y: -161 }, { x: 6544, y: -73 }, { x: 6659, y: -99 }, { x: 6767, y: -75 }, { x: 6806, y: -161 }, { x: 6925, y: -132 }, { x: 7033, y: -161 }];
        //游戏结束,省下的怪物加速移动值
        _this.gameEndMonsterSpeed = 400;
        //当前怪物数量
        _this.currentMonsterCount = 0;
        //炮台数据
        _this.cannonUpLevel = [
            //圆炮
            { type: 6, level: 0, atk: 1 },
            { type: 6, level: 1, atk: 10 },
            { type: 6, level: 2, atk: 80 },
            //闪电炮
            { type: 1, level: 0, atk: 180 },
            { type: 1, level: 1, atk: 260 },
            { type: 1, level: 2, atk: 540 },
            //导弹炮
            { type: 3, level: 0, atk: 680 },
            { type: 3, level: 1, atk: 780 },
            { type: 3, level: 2, atk: 960 },
            //音波炮
            { type: 4, level: 0, atk: 1100 },
            { type: 4, level: 1, atk: 1200 },
            { type: 4, level: 2, atk: 1350 },
            //紫光炮
            { type: 2, level: 0, atk: 1300 },
            { type: 2, level: 1, atk: 1550 },
            { type: 2, level: 2, atk: 1680 },
            //激光炮
            { type: 0, level: 0, atk: 1980 },
            { type: 0, level: 1, atk: 2200 },
            { type: 0, level: 2, atk: 2800 },
            //圆炮
            { type: 6, level: 3, atk: 3800 },
            { type: 6, level: 4, atk: 4800 },
            { type: 6, level: 5, atk: 6800 },
            //闪电炮
            { type: 1, level: 3, atk: 9800 },
            { type: 1, level: 4, atk: 13500 },
            { type: 1, level: 5, atk: 17000 },
        ];
        //每关的怪物数据
        _this.monsterDesign = [
            //第一关,下标0
            {
                checkPointData: {
                    succedGold: 100,
                    faildGold: 50,
                    diamond: 20,
                },
                map: {
                    blockData: 0,
                },
                monster: [
                    // {type:1,id:0,hp:5,speed:1.2},
                    // {type:1,id:0,hp:5,speed:1.2},
                    { type: 0, id: 0, hp: 1, speed: 120, gold: 1 },
                    { type: 0, id: 1, hp: 1, speed: 120, gold: 1 },
                    { type: 0, id: 1, hp: 1, speed: 120, gold: 1 },
                    { type: 0, id: 1, hp: 1, speed: 120, gold: 1 },
                    { type: 0, id: 1, hp: 1, speed: 120, gold: 1 },
                    { type: 1, id: 0, hp: 5, speed: 80, gold: 10 },
                    { type: 0, id: 2, hp: 1, speed: 120, gold: 1 },
                    { type: 0, id: 3, hp: 1, speed: 120, gold: 1 },
                    { type: 0, id: 4, hp: 1, speed: 120, gold: 1 },
                    { type: 1, id: 1, hp: 5, speed: 80, gold: 10 },
                    { type: 0, id: 6, hp: 1, speed: 120, gold: 1 },
                    { type: 0, id: 6, hp: 1, speed: 120, gold: 1 },
                    { type: 0, id: 7, hp: 1, speed: 120, gold: 1 },
                    { type: 0, id: 8, hp: 1, speed: 120, gold: 1 },
                    { type: 0, id: 8, hp: 1, speed: 120, gold: 1 },
                    { type: 0, id: 8, hp: 1, speed: 120, gold: 1 },
                    { type: 2, id: 9, hp: 600, speed: 70, gold: 300 },
                ]
            },
            //第2关
            {
                checkPointData: {
                    succedGold: 200,
                    faildGold: 100,
                    diamond: 0,
                },
                map: {
                    blockData: 1,
                },
                monster: [
                    // {type:1,id:0,hp:5,speed:1.2},
                    // {type:1,id:0,hp:5,speed:1.2},
                    { type: 0, id: 0, hp: 10, speed: 120, gold: 10 },
                    { type: 0, id: 7, hp: 10, speed: 120, gold: 10 },
                    { type: 0, id: 7, hp: 10, speed: 120, gold: 10 },
                    { type: 0, id: 7, hp: 10, speed: 120, gold: 10 },
                    { type: 0, id: 7, hp: 10, speed: 120, gold: 10 },
                    { type: 1, id: 7, hp: 50, speed: 80, gold: 100 },
                    { type: 0, id: 2, hp: 10, speed: 120, gold: 10 },
                    { type: 0, id: 3, hp: 10, speed: 120, gold: 10 },
                    { type: 0, id: 4, hp: 10, speed: 120, gold: 10 },
                    { type: 1, id: 2, hp: 50, speed: 80, gold: 100 },
                    { type: 0, id: 6, hp: 10, speed: 120, gold: 10 },
                    { type: 0, id: 6, hp: 10, speed: 120, gold: 10 },
                    { type: 0, id: 7, hp: 10, speed: 120, gold: 10 },
                    { type: 0, id: 2, hp: 10, speed: 120, gold: 10 },
                    { type: 0, id: 2, hp: 10, speed: 120, gold: 10 },
                    { type: 0, id: 2, hp: 10, speed: 120, gold: 10 },
                ]
            },
            //第2关
            {
                checkPointData: {
                    succedGold: 200,
                    faildGold: 100,
                    diamond: 20,
                },
                map: {
                    blockData: 1,
                },
                monster: [
                    // {type:1,id:0,hp:5,speed:1.2},
                    // {type:1,id:0,hp:5,speed:1.2},
                    { type: 0, id: 0, hp: 50, speed: 120, gold: 100 },
                    { type: 0, id: 7, hp: 50, speed: 120, gold: 100 },
                    { type: 0, id: 7, hp: 50, speed: 120, gold: 100 },
                    { type: 0, id: 7, hp: 50, speed: 120, gold: 100 },
                    { type: 0, id: 7, hp: 50, speed: 120, gold: 100 },
                    { type: 1, id: 7, hp: 100, speed: 80, gold: 300 },
                    { type: 0, id: 2, hp: 80, speed: 120, gold: 100 },
                    { type: 0, id: 3, hp: 80, speed: 120, gold: 100 },
                    { type: 0, id: 4, hp: 80, speed: 120, gold: 100 },
                    { type: 1, id: 2, hp: 200, speed: 80, gold: 300 },
                    { type: 0, id: 6, hp: 70, speed: 120, gold: 100 },
                    { type: 0, id: 6, hp: 70, speed: 120, gold: 100 },
                    { type: 0, id: 7, hp: 70, speed: 120, gold: 100 },
                    { type: 0, id: 2, hp: 70, speed: 120, gold: 100 },
                    { type: 0, id: 2, hp: 70, speed: 120, gold: 100 },
                    { type: 0, id: 2, hp: 70, speed: 120, gold: 100 },
                    { type: 2, id: 1, hp: 600, speed: 70, gold: 300 },
                ]
            },
        ];
        //每关的索引,二位数组
        _this.eachCheckPointData = [
            [0, 1, 2],
            [1, 2, 3, 4, 5, 6],
            [7, 8, 9, 10, 11, 12],
        ];
        _this.bossName = [
            '大嘴兽',
            '懒懒兽',
            '火龙怪',
            '刺刺怪',
            '绿发怪',
            '紫发怪',
            '牛头怪',
            '猪猪兽',
            '猫头兽',
            '黄猫头',
            '绿面具',
            '黄面具',
            '铁龟怪',
            '智障怪',
            '慌张怪',
            '红丫丫',
            '蓝丫丫',
            '小火龙',
            '大火龙',
        ];
        return _this;
    }
    DataManager_1 = DataManager;
    DataManager.getInstance = function () {
        return DataManager_1._instance;
    };
    DataManager.prototype.onLoad = function () {
        if (null === DataManager_1._instance) {
            DataManager_1._instance = this;
        }
        else {
            this.destroy();
            return;
        }
    };
    DataManager.prototype.getData = function (big, small) {
        if (big == null || small == null) {
            this.monsterDesign[this.monsterDesign.length - 1].haveData = false;
            return this.monsterDesign[this.monsterDesign.length - 1];
        }
        if (big >= this.eachCheckPointData.length) {
            this.monsterDesign[this.monsterDesign.length - 1].haveData = false;
            return this.monsterDesign[this.monsterDesign.length - 1];
        }
        if (small >= this.eachCheckPointData[big].length) {
            this.monsterDesign[this.monsterDesign.length - 1].haveData = false;
            return this.monsterDesign[this.monsterDesign.length - 1];
        }
        var index = this.eachCheckPointData[big][small];
        if (index >= this.monsterDesign.length) {
            this.monsterDesign[this.monsterDesign.length - 1].haveData = false;
            return this.monsterDesign[this.monsterDesign.length - 1];
        }
        this.monsterDesign[index].haveData = true;
        return this.monsterDesign[index];
    };
    //上一关
    DataManager.prototype.previousCheckPoint = function () {
        var checkPoint = PlayerDataManager_1.default.getInstance().getCheckPoint();
        checkPoint.small--;
        if (checkPoint.small < 0) {
            checkPoint.small = 0;
        }
        if (checkPoint.big < 0) {
            checkPoint.big = 0;
        }
        PlayerDataManager_1.default.getInstance().setBigCheckPointCount(checkPoint.big);
        PlayerDataManager_1.default.getInstance().setSmallCheckPointCount(checkPoint.small);
    };
    DataManager.prototype.getCurData = function () {
        var checkPoint = PlayerDataManager_1.default.getInstance().getCheckPoint();
        var data = this.getData(checkPoint.big, checkPoint.small);
        return data;
    };
    //下一关
    DataManager.prototype.nextCheckPoint = function () {
        var checkPoint = PlayerDataManager_1.default.getInstance().getCheckPoint();
        if (this.isCurBossAttack()) {
            checkPoint.small = 0;
            checkPoint.big++;
        }
        else {
            checkPoint.small++;
        }
        PlayerDataManager_1.default.getInstance().setBigCheckPointCount(checkPoint.big);
        PlayerDataManager_1.default.getInstance().setSmallCheckPointCount(checkPoint.small);
        return this.getCurData();
    };
    //获取当前地图块id
    DataManager.prototype.getCurBlockDataID = function () {
        var checkPoint = PlayerDataManager_1.default.getInstance().getCheckPoint();
        var data = this.getData(checkPoint.big, checkPoint.small);
        return data.map.blockData;
    };
    //获取关卡输赢奖励金币
    DataManager.prototype.getCurCheckPoint = function () {
        var checkPoint = PlayerDataManager_1.default.getInstance().getCheckPoint();
        var data = this.getData(checkPoint.big, checkPoint.small);
        return data.checkPointData;
    };
    //获取关卡怪物数据
    DataManager.prototype.getCurMonsterData = function () {
        var checkPoint = PlayerDataManager_1.default.getInstance().getCheckPoint();
        var data = this.getData(checkPoint.big, checkPoint.small);
        return data.monster;
    };
    //设置当前关卡怪兽数量
    DataManager.prototype.setCurMonsterCount = function (count) {
        if (count == null)
            return;
        this.currentMonsterCount = count;
    };
    //获取当前关卡怪物数量
    DataManager.prototype.getCurMonsterCount = function () {
        return this.currentMonsterCount;
    };
    //增加关卡怪物数量
    DataManager.prototype.addCurMonsterCount = function () {
        return this.currentMonsterCount++;
    };
    //减少关卡怪物数量
    DataManager.prototype.subCurMonsterCount = function () {
        return this.currentMonsterCount--;
    };
    DataManager.prototype.isCurBossAttack = function () {
        var checkPoint = PlayerDataManager_1.default.getInstance().getCheckPoint();
        var data = this.getData(checkPoint.big, checkPoint.small);
        for (var i = 0; i < data.monster.length; i++) {
            if (data.monster[i].type == 2) {
                return true;
            }
        }
        return false;
    };
    DataManager.prototype.getBossNameByID = function (id) {
        if (id < 0 || id >= this.bossName.length) {
            return this.bossName[0];
        }
        return this.bossName[id];
    };
    var DataManager_1;
    DataManager._instance = null;
    DataManager = DataManager_1 = __decorate([
        ccclass
    ], DataManager);
    return DataManager;
}(cc.Component));
exports.default = DataManager;

cc._RF.pop();