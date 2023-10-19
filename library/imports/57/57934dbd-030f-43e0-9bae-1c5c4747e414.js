"use strict";
cc._RF.push(module, '5793429Aw9D4JuuHFxHR+QU', 'GameLanch ');
// Scripts/GameLanch .ts

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
var EventManager_1 = require("../FrameWork/manager/EventManager");
var ExcelManager_1 = require("../FrameWork/manager/ExcelManager");
var ResManagerPro_1 = require("../FrameWork/manager/ResManagerPro");
var UIManagerPro_1 = require("../FrameWork/manager/UIManagerPro");
var DataManager_1 = require("./data/DataManager");
var ECSFactory_1 = require("./ECS/ECSFactory");
var ECSManager_1 = require("./ECS/ECSManager");
var EntityUtils_1 = require("./ECS/EntityUtils");
var AnimateSystem_1 = require("./ECS/Systems/AnimateSystem");
var NavSystem_1 = require("./ECS/Systems/NavSystem");
var GameApp_1 = require("./GameApp");
var MapDataManager_1 = require("./Manager/MapDataManager");
var PlayerDataManager_1 = require("./Manager/PlayerDataManager");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var GameLanch = /** @class */ (function (_super) {
    __extends(GameLanch, _super);
    function GameLanch() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // LIFE-CYCLE CALLBACKS:
    GameLanch.prototype.onLoad = function () {
        //框架
        this.addComponent(ExcelManager_1.ExcelManager);
        this.addComponent(EventManager_1.EventManager);
        this.addComponent(UIManagerPro_1.UIManagerPro);
        this.addComponent(ResManagerPro_1.ResManagerPro);
        //游戏
        this.addComponent(GameApp_1.default);
        this.addComponent(AnimateSystem_1.default);
        this.addComponent(EntityUtils_1.default);
        this.addComponent(NavSystem_1.default);
        this.addComponent(PlayerDataManager_1.default).load();
        this.addComponent(DataManager_1.default);
        this.addComponent(MapDataManager_1.default);
        this.addComponent(ECSFactory_1.default);
        this.addComponent(ECSManager_1.default);
    };
    GameLanch.prototype.start = function () {
        GameApp_1.default.getInstance().startGame();
    };
    GameLanch = __decorate([
        ccclass
    ], GameLanch);
    return GameLanch;
}(cc.Component));
exports.default = GameLanch;

cc._RF.pop();