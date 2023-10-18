"use strict";
cc._RF.push(module, 'edaf0lvjllM55+nOHu8RXRY', 'EntityUtils');
// Scripts/ECS/EntityUtils.ts

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
var EntityUtils = /** @class */ (function (_super) {
    __extends(EntityUtils, _super);
    function EntityUtils() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    EntityUtils_1 = EntityUtils;
    EntityUtils.getInstance = function () {
        return EntityUtils_1._instance;
    };
    EntityUtils.prototype.onLoad = function () {
        if (null === EntityUtils_1._instance) {
            EntityUtils_1._instance = this;
        }
        else {
            this.destroy();
            return;
        }
    };
    EntityUtils.prototype.updateMonsterDirection = function (start, end, baseComponent) {
        if (end.x > start.x) {
            baseComponent.gameObject.getChildByName("item").getChildByName("scale").getChildByName("right").active = true;
            baseComponent.gameObject.getChildByName("item").getChildByName("scale").getChildByName("left").active = false;
        }
        else if (end.x < start.x) {
            baseComponent.gameObject.getChildByName("item").getChildByName("scale").getChildByName("right").active = false;
            baseComponent.gameObject.getChildByName("item").getChildByName("scale").getChildByName("left").active = true;
        }
    };
    var EntityUtils_1;
    EntityUtils._instance = null;
    EntityUtils = EntityUtils_1 = __decorate([
        ccclass
    ], EntityUtils);
    return EntityUtils;
}(cc.Component));
exports.default = EntityUtils;

cc._RF.pop();