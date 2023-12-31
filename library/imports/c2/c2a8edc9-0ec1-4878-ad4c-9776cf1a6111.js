"use strict";
cc._RF.push(module, 'c2a8e3JDsFIeK1Ml3bPGmER', 'Enum');
// Scripts/Enum.ts

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnitState = exports.GameStateType = exports.Chengjiou = exports.SkillBuffer = exports.Intensify = exports.Task = exports.BulletState = void 0;
var BulletState;
(function (BulletState) {
    BulletState[BulletState["None"] = 0] = "None";
    BulletState[BulletState["Effect"] = 1] = "Effect";
    BulletState[BulletState["Attack"] = 2] = "Attack";
    BulletState[BulletState["Dead"] = 3] = "Dead";
})(BulletState = exports.BulletState || (exports.BulletState = {}));
var Task;
(function (Task) {
    Task[Task["TASK_HEBING_FANGYUTA"] = 0] = "TASK_HEBING_FANGYUTA";
    Task[Task["TASK_JIDAO_DIREN"] = 1] = "TASK_JIDAO_DIREN";
    Task[Task["TASK_QIANGHUA_JINENG"] = 2] = "TASK_QIANGHUA_JINENG"; //强化技能
})(Task = exports.Task || (exports.Task = {}));
var Intensify;
(function (Intensify) {
    Intensify[Intensify["INTENSIFY_KUORONG"] = 0] = "INTENSIFY_KUORONG";
    Intensify[Intensify["INTENSIFY_BAOJI"] = 1] = "INTENSIFY_BAOJI"; //暴击
})(Intensify = exports.Intensify || (exports.Intensify = {}));
var SkillBuffer;
(function (SkillBuffer) {
    SkillBuffer[SkillBuffer["BUFFER_JINBIFANBEI"] = 0] = "BUFFER_JINBIFANBEI";
    SkillBuffer[SkillBuffer["BUFFER_GUAIWUJIANSHU"] = 1] = "BUFFER_GUAIWUJIANSHU";
    SkillBuffer[SkillBuffer["BUFFER_GONGJIFANBEI"] = 2] = "BUFFER_GONGJIFANBEI";
    SkillBuffer[SkillBuffer["BUFFER_QUANPINGGONGJI"] = 3] = "BUFFER_QUANPINGGONGJI"; //全屏攻击
})(SkillBuffer = exports.SkillBuffer || (exports.SkillBuffer = {}));
var Chengjiou;
(function (Chengjiou) {
    Chengjiou[Chengjiou["CHENGJIOU_QIANGHUA_JINENG"] = 3] = "CHENGJIOU_QIANGHUA_JINENG"; //合并防御塔
})(Chengjiou = exports.Chengjiou || (exports.Chengjiou = {}));
var GameStateType;
(function (GameStateType) {
    GameStateType[GameStateType["None"] = 0] = "None";
    GameStateType[GameStateType["Start"] = 1] = "Start";
    GameStateType[GameStateType["Playing"] = 2] = "Playing";
    GameStateType[GameStateType["End"] = 3] = "End";
})(GameStateType = exports.GameStateType || (exports.GameStateType = {}));
var UnitState;
(function (UnitState) {
    UnitState[UnitState["None"] = 0] = "None";
    UnitState[UnitState["Active"] = 1] = "Active";
})(UnitState = exports.UnitState || (exports.UnitState = {}));

cc._RF.pop();