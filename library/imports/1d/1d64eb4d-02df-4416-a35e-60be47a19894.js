"use strict";
cc._RF.push(module, '1d64etNAt9EFqNeYL5HoZiU', 'buildBtn1Control');
// Scripts/UI/buildBtn1Control.ts

"use strict";
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
var buildBtn1Control = /** @class */ (function (_super) {
    __extends(buildBtn1Control, _super);
    function buildBtn1Control() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // LIFE-CYCLE CALLBACKS:
    buildBtn1Control.prototype.onLoad = function () {
        _super.prototype.onLoad.call(this);
    };
    buildBtn1Control.prototype.start = function () {
    };
    buildBtn1Control = __decorate([
        ccclass
    ], buildBtn1Control);
    return buildBtn1Control;
}(UIControl_1.UIControl));
exports.default = buildBtn1Control;

cc._RF.pop();