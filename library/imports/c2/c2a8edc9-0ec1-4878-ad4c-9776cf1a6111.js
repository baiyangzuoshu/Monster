"use strict";
cc._RF.push(module, 'c2a8e3JDsFIeK1Ml3bPGmER', 'Enum');
// Scripts/Enum.ts

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chengjiou = exports.Buffer = exports.Intensify = exports.Task = exports.UnitState = void 0;
var UnitState;
(function (UnitState) {
    UnitState[UnitState["Normal"] = 0] = "Normal";
    UnitState[UnitState["Active"] = 1] = "Active";
    UnitState[UnitState["Dead"] = 2] = "Dead";
})(UnitState = exports.UnitState || (exports.UnitState = {}));
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
var Buffer;
(function (Buffer) {
    Buffer[Buffer["BUFFER_JINBIFANBEI"] = 0] = "BUFFER_JINBIFANBEI";
    Buffer[Buffer["BUFFER_GUAIWUJIANSHU"] = 1] = "BUFFER_GUAIWUJIANSHU";
    Buffer[Buffer["BUFFER_GONGJIFANBEI"] = 2] = "BUFFER_GONGJIFANBEI";
    Buffer[Buffer["BUFFER_QUANPINGGONGJI"] = 3] = "BUFFER_QUANPINGGONGJI"; //全屏攻击
})(Buffer = exports.Buffer || (exports.Buffer = {}));
var Chengjiou;
(function (Chengjiou) {
    Chengjiou[Chengjiou["CHENGJIOU_QIANGHUA_JINENG"] = 3] = "CHENGJIOU_QIANGHUA_JINENG"; //合并防御塔
})(Chengjiou = exports.Chengjiou || (exports.Chengjiou = {}));

cc._RF.pop();