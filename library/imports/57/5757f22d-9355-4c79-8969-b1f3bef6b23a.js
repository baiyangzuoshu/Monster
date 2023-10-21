"use strict";
cc._RF.push(module, '5757fItk1VMeYlpsfO+9rI6', 'crownControl');
// Scripts/UI/crownControl.ts

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
var crownControl = /** @class */ (function (_super) {
    __extends(crownControl, _super);
    function crownControl() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.m_crown = null;
        _this.m_diamond = null;
        _this.m_light = null;
        return _this;
    }
    // LIFE-CYCLE CALLBACKS:
    crownControl.prototype.onLoad = function () {
        _super.prototype.onLoad.call(this);
        this.m_crown = this.getChildByUrl("crown");
        this.m_diamond = this.getChildByUrl("diamond");
        this.m_light = this.getChildByUrl("light");
        this.moveUpDown(this.m_crown, 5);
        this.moveUpDown(this.m_diamond, -5);
        this.moveUpDown(this.m_light, -5);
        this.m_light.setScale(cc.v2(0.6, 0.6));
        var scaleTo = cc.scaleTo(0.5, 1.2, 1.2);
        var fade = cc.fadeTo(0.5, 100);
        var sp = cc.spawn(scaleTo, fade);
        var seq2 = cc.sequence(sp, cc.callFunc(function () {
            this.m_light.setScale(cc.v2(0.6, 0.6));
            this.m_light.opacity = 255;
        }.bind(this)));
        this.m_light.runAction(cc.repeatForever(seq2));
    };
    crownControl.prototype.moveUpDown = function (node, offset) {
        var pos = node.getPosition();
        var moveUp = cc.moveTo(1, cc.v2(pos.x, pos.y + offset));
        var moveDown = cc.moveTo(1, cc.v2(pos.x, pos.y - offset));
        node.runAction(cc.repeatForever(cc.sequence(moveUp, moveDown)));
    };
    crownControl = __decorate([
        ccclass
    ], crownControl);
    return crownControl;
}(UIControl_1.UIControl));
exports.default = crownControl;

cc._RF.pop();