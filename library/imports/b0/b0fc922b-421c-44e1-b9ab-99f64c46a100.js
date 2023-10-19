"use strict";
cc._RF.push(module, 'b0fc9IrQhxE4bmrmfZMRqEA', 'IntensifyDataManager');
// Scripts/data/IntensifyDataManager.ts

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
var IntensifyDataManager = /** @class */ (function (_super) {
    __extends(IntensifyDataManager, _super);
    function IntensifyDataManager() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.data = [
            {
                title: '补给站容量扩充',
                value: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
                diamond: [5, 15, 20, 30, 50, 80, 120, 160, 200, 250, 320, 500],
                icon: 'ui_g_libraryCount',
                showPer: false,
            },
            {
                title: '炮台暴击提升',
                value: [1, 2, 3, 3.5, 4],
                diamond: [5, 15, 20, 30, 50],
                icon: 'ui_g_crit',
                showPer: true,
            },
        ];
        return _this;
    }
    IntensifyDataManager_1 = IntensifyDataManager;
    IntensifyDataManager.getInstance = function () {
        return IntensifyDataManager_1._instance;
    };
    IntensifyDataManager.prototype.onLoad = function () {
        if (null === IntensifyDataManager_1._instance) {
            IntensifyDataManager_1._instance = this;
        }
        else {
            this.destroy();
            return;
        }
    };
    IntensifyDataManager.prototype.getData = function () {
        return this.data;
    };
    IntensifyDataManager.prototype.getIntensifyDataByID = function (ID) {
        if (ID >= this.data.length) {
            return null;
        }
        return this.data[ID];
    };
    IntensifyDataManager.prototype.getTitle = function (ID, index) {
        var data = this.getIntensifyDataByID(ID);
        if (data == null) {
            return null;
        }
        return data.title;
    };
    IntensifyDataManager.prototype.getIcon = function (ID) {
        var data = this.getIntensifyDataByID(ID);
        if (data == null) {
            return null;
        }
        return data.icon;
    };
    IntensifyDataManager.prototype.getValue = function (ID, index) {
        var data = this.getIntensifyDataByID(ID);
        if (data == null) {
            return null;
        }
        return data.value[index];
    };
    IntensifyDataManager.prototype.getDiamond = function (ID, index) {
        var data = this.getIntensifyDataByID(ID);
        if (data == null) {
            return null;
        }
        return data.diamond[index];
    };
    var IntensifyDataManager_1;
    IntensifyDataManager._instance = null;
    IntensifyDataManager = IntensifyDataManager_1 = __decorate([
        ccclass
    ], IntensifyDataManager);
    return IntensifyDataManager;
}(cc.Component));
exports.default = IntensifyDataManager;

cc._RF.pop();