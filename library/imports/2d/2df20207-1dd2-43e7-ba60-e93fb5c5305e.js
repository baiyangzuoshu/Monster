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
    CollectHitSystem.prototype.onUpdate = function (dt, hitPos, shapeComponent, transformComponent, unitComponent) {
        if (unitComponent.isDead) {
            return;
        }
        var rect = new cc.Rect(transformComponent.x - shapeComponent.width / 2, transformComponent.y - shapeComponent.height / 2, shapeComponent.width, shapeComponent.height);
        if (rect.contains(hitPos)) {
            return true;
        }
        return false;
    };
    CollectHitSystem._instance = null;
    return CollectHitSystem;
}(cc.Component));
exports.default = CollectHitSystem;

cc._RF.pop();