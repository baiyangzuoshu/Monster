"use strict";
cc._RF.push(module, '2df20IHHdJD57pg6T+1xTBe', 'CollectHitSystem');
// Scripts/ECS/Systems/CollectHitSystem.ts

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
Object.defineProperty(exports, "__esModule", { value: true });
var AttackSystem_1 = require("./AttackSystem");
var CollectHitSystem = /** @class */ (function (_super) {
    __extends(CollectHitSystem, _super);
    function CollectHitSystem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CollectHitSystem.getInstance = function () {
        return CollectHitSystem._instance;
    };
    CollectHitSystem.prototype.onLoad = function () {
        if (null === CollectHitSystem._instance) {
            CollectHitSystem._instance = this;
        }
        else {
            this.destroy();
            return;
        }
    };
    CollectHitSystem.prototype.onUpdate = function (atk, hitPos, bulletShapeComponent, bulletTransformComponent, bulletUnitComponent, monsterUnitComponent, monsterBaseComponent, monsterAttackComponent) {
        var rect = new cc.Rect(bulletTransformComponent.x - 0, bulletTransformComponent.y - bulletShapeComponent.height / 2, bulletShapeComponent.width, bulletShapeComponent.height);
        if (rect.contains(hitPos)) {
            AttackSystem_1.default.getInstance().attackStartAction(atk, bulletUnitComponent, monsterUnitComponent, monsterBaseComponent, monsterAttackComponent);
            return true;
        }
        return false;
    };
    CollectHitSystem._instance = null;
    return CollectHitSystem;
}(cc.Component));
exports.default = CollectHitSystem;

cc._RF.pop();