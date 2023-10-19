"use strict";
cc._RF.push(module, '19b04irgx9Cd7XqQqcRwiF7', 'MapDataManager');
// Scripts/Manager/MapDataManager.ts

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
var DataManager_1 = require("../data/DataManager");
var ECSManager_1 = require("../ECS/ECSManager");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var MapDataManager = /** @class */ (function (_super) {
    __extends(MapDataManager, _super);
    function MapDataManager() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.cannonList = null;
        _this.mapBlockData = null;
        _this.pathList = null;
        _this.startPos = [];
        _this.m_mapBlockItem = [];
        _this.blockMaps = null;
        return _this;
    }
    MapDataManager_1 = MapDataManager;
    MapDataManager.getInstance = function () {
        return MapDataManager_1._instance;
    };
    MapDataManager.prototype.onLoad = function () {
        if (null === MapDataManager_1._instance) {
            MapDataManager_1._instance = this;
        }
        else {
            this.destroy();
            return;
        }
        this.startPos = [];
        this.m_mapBlockItem = [];
        this.startPos.push(cc.v2(0, 0));
        this.startPos.push(cc.v2(640, 0));
        var canvas = cc.find("Canvas");
        this.blockMaps = canvas.getChildByName("Game").getChildByName("blockMaps");
    };
    MapDataManager.prototype.getCurPahtList = function () {
        var index = DataManager_1.default.getInstance().getCurBlockDataID();
        if (index >= this.pathList.length) {
            index = this.pathList.length - 1;
        }
        return this.pathList[index];
    };
    MapDataManager.prototype.getCurBlockData = function () {
        var index = DataManager_1.default.getInstance().getCurBlockDataID();
        if (index >= this.mapBlockData.length) {
            index = this.mapBlockData.length - 1;
        }
        return this.mapBlockData[index];
    };
    MapDataManager.prototype.getCurCannonPoint = function () {
        return this.cannonList;
    };
    MapDataManager.prototype.getBlockDataByIndex = function (index) {
        if (this.mapBlockData[index] != null) {
            return this.mapBlockData[index];
        }
        return null;
    };
    MapDataManager.prototype.getPathDataByIndex = function (index) {
        if (index >= this.pathList[index] != null) {
            return this.pathList[index];
        }
        return null;
    };
    MapDataManager.prototype.loadData = function () {
        return __awaiter(this, void 0, Promise, function () {
            var data, jsonData;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, ResManagerPro_1.ResManagerPro.Instance.IE_GetAsset("data", "mapData", cc.JsonAsset)];
                    case 1:
                        data = _a.sent();
                        jsonData = data.json;
                        this.cannonList = jsonData._cannonList;
                        this.mapBlockData = jsonData._mapBlockData;
                        this.pathList = jsonData._pathList;
                        return [2 /*return*/];
                }
            });
        });
    };
    MapDataManager.prototype.buildBlockMap = function (index, blockMapData) {
        return __awaiter(this, void 0, void 0, function () {
            var j, y, i, x, block, com, name, blockAtlas;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.m_mapBlockItem[index] == null) {
                            this.m_mapBlockItem[index] = [];
                        }
                        j = 0;
                        _a.label = 1;
                    case 1:
                        if (!(j < 6)) return [3 /*break*/, 6];
                        y = j * 106;
                        if (this.m_mapBlockItem[index][j] == null) {
                            this.m_mapBlockItem[index][j] = [];
                        }
                        i = 0;
                        _a.label = 2;
                    case 2:
                        if (!(i < 6)) return [3 /*break*/, 5];
                        x = i * 106;
                        block = null;
                        if (this.m_mapBlockItem[index][j][i] == null) {
                            block = new cc.Node;
                            this.blockMaps.addChild(block);
                        }
                        else {
                            block = this.m_mapBlockItem[index][j][i].node;
                        }
                        block.x = x + 106 / 2;
                        block.y = -y - 106 / 2;
                        block.x += this.startPos[index].x;
                        block.y += this.startPos[index].y;
                        com = block.addComponent(cc.Sprite);
                        this.m_mapBlockItem[index][j][i] = com;
                        name = '' + blockMapData[j][i];
                        return [4 /*yield*/, ResManagerPro_1.ResManagerPro.Instance.IE_GetAsset("texture", "block/block-1", cc.SpriteAtlas)];
                    case 3:
                        blockAtlas = _a.sent();
                        com.spriteFrame = blockAtlas.getSpriteFrame(name);
                        _a.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 2];
                    case 5:
                        j++;
                        return [3 /*break*/, 1];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    MapDataManager.prototype.beginCreateMonster = function () {
        var index = 0;
        var list = this.getCurPahtList();
        var levelData = DataManager_1.default.getInstance().getCurMonsterData();
        DataManager_1.default.getInstance().setCurMonsterCount(levelData.length);
        var actionList = [];
        for (var i = 0; i < levelData.length; i++) {
            var offset = Math.random();
            var seq = cc.sequence(cc.delayTime(0.2 + offset), cc.callFunc(function () {
                if (index >= levelData.length) {
                    return;
                }
                var speed = levelData[index].speed;
                var node = this.createMonsterByData(levelData[index], list, speed);
                index++;
            }.bind(this)));
            actionList.push(seq);
        }
        var seqList = cc.sequence(actionList);
        this.node.runAction(seqList);
    };
    MapDataManager.prototype.createMonsterByData = function (data, list, speed) {
        return __awaiter(this, void 0, void 0, function () {
            var type, id, hp, gold;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        type = data.type;
                        id = data.id;
                        hp = data.hp;
                        gold = data.gold;
                        return [4 /*yield*/, this.createMonster(type, id, list, hp, gold, speed)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    //type 0:小怪物 1:中型怪物 2:boss
    //index:怪物图片名
    //起始点
    MapDataManager.prototype.createMonster = function (type, index, list, hp, gold, speed) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        gold = gold || 0;
                        return [4 /*yield*/, ECSManager_1.default.getInstance().createMonsterEntity(type, index, list, hp, gold, speed)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    var MapDataManager_1;
    MapDataManager._instance = null;
    MapDataManager = MapDataManager_1 = __decorate([
        ccclass
    ], MapDataManager);
    return MapDataManager;
}(cc.Component));
exports.default = MapDataManager;

cc._RF.pop();