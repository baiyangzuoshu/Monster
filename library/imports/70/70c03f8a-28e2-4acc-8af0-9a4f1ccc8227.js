"use strict";
cc._RF.push(module, '70c03+KKOJKzIrwmk8czIIn', 'taskData');
// Scripts/data/taskData.js

"use strict";

window.g_taskData = new Object();
window.g_taskData.data = [{
  //0
  title: '[合成]合成防御塔{0}次',
  max: [1, 5, 10, 20, 30, 60, 120, 150, 200, 280, 400],
  award: [10, 50, 110, 200, 300, 600, 1200, 1500, 2000, 2800, 4000],
  taskType: 0
}, {
  //1
  title: '击败{0}个敌人',
  max: [1, 5, 10, 20, 30, 60, 120, 150, 200, 280, 400],
  award: [1, 5, 10, 20, 30, 60, 120, 150, 200, 280, 400],
  taskType: 0
}, {
  //2
  title: '强化技能{0}次',
  max: [1, 5, 10, 20, 30, 60, 120, 150, 200, 280, 400],
  award: [1, 5, 10, 20, 30, 60, 120, 150, 200, 280, 400],
  taskType: 0
}, {
  //3
  title: '合成{0}次防御塔',
  max: [1, 5, 10, 20, 30, 60, 120, 150, 200, 280, 400],
  award: [10, 50, 110, 200, 300, 600, 1200, 1500, 2000, 2800, 4000],
  taskType: 1
}];

g_taskData.getTaskDataByID = function (taskID) {
  if (taskID >= this.data.leight) {
    return null;
  }

  return this.data[taskID];
};

g_taskData.getAward = function (taskID, index) {
  var taskData = this.getTaskDataByID(taskID);

  if (taskData == null) {
    return null;
  }

  var award = taskData.award;

  if (index >= award.leight) {
    index = award.leight - 1;
  }

  return award[index];
};

g_taskData.getTitle = function (taskID, index) {
  var taskData = this.getTaskDataByID(taskID);

  if (taskData == null) {
    return null;
  }

  var title = taskData.title;

  if (index >= taskData.max.leight) {
    index = taskData.max.leight - 1;
  }

  return title.format(this.data[taskID].max[index]);
};

g_taskData.getMaxCount = function (taskID, maxIndex) {
  var taskData = this.getTaskDataByID(taskID);

  if (taskData == null) {
    return null;
  }

  if (maxIndex >= taskData.max.leight) {
    maxIndex = taskData.max.leight - 1;
  }

  return this.data[taskID].max[maxIndex];
};

g_taskData.getData = function () {
  return g_taskData.data;
};

cc._RF.pop();