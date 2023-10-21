"use strict";
cc._RF.push(module, '6ec39z6Hl1LDZvky2Ev2G79', 'SmallSettlementControl');
// Scripts/UI/SmallSettlementControl.ts

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
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var SmallSettlementControl = /** @class */ (function (_super) {
    __extends(SmallSettlementControl, _super);
    function SmallSettlementControl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.m_faildNode = null;
        _this.m_succeedNode = null;
        _this.m_labGold = null;
        return _this;
    }
    // LIFE-CYCLE CALLBACKS:
    SmallSettlementControl.prototype.onLoad = function () {
        _super.prototype.onLoad.call(this);
        this.m_faildNode = this.getChildByUrl("ui_lose");
        this.m_succeedNode = this.getChildByUrl("ui_win");
        this.m_labGold = this.getChildByUrl("lab").getComponent(cc.Label);
    };
    SmallSettlementControl.prototype.showSucceed = function (gold) {
        this.show();
        this.m_labGold.string = gold.toString();
        this.m_faildNode.active = false;
        this.m_succeedNode.active = true;
    };
    SmallSettlementControl.prototype.showFaild = function (gold) {
        this.show();
        this.m_labGold.string = gold.toString();
        this.m_faildNode.active = true;
        this.m_succeedNode.active = false;
    };
    SmallSettlementControl.prototype.show = function () {
        var moveTo = cc.moveTo(0.3, cc.v2(0, 0));
        this.node.setPosition(cc.v2(0, 980));
        this.node.runAction(moveTo);
    };
    SmallSettlementControl.prototype.hide = function () {
        var moveTo = cc.moveTo(0.3, cc.v2(0, 980));
        this.node.setPosition(cc.v2(0, 0));
        this.node.runAction(moveTo);
    };
    SmallSettlementControl = __decorate([
        ccclass
    ], SmallSettlementControl);
    return SmallSettlementControl;
}(UIControl_1.UIControl));
exports.default = SmallSettlementControl;

cc._RF.pop();