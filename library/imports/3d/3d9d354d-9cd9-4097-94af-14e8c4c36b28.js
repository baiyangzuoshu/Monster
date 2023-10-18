"use strict";
cc._RF.push(module, '3d9d3VNnNlAl5SvFOjEw2so', 'intensifyData');
// Scripts/data/intensifyData.js

"use strict";

window.g_intensifyData = new Object();
window.g_intensifyData.data = [{
  //0
  title: '补给站容量扩充',
  value: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
  diamond: [5, 15, 20, 30, 50, 80, 120, 160, 200, 250, 320, 500],
  icon: 'ui_g_libraryCount',
  showPer: false
}, {
  //1
  title: '炮台暴击提升',
  value: [1, 2, 3, 3.5, 4],
  diamond: [5, 15, 20, 30, 50],
  icon: 'ui_g_crit',
  showPer: true
}];

g_intensifyData.getData = function () {
  return g_intensifyData.data;
};

g_intensifyData.getIntensifyDataByID = function (ID) {
  if (ID >= this.data.leight) {
    return null;
  }

  return this.data[ID];
};

g_intensifyData.getTitle = function (ID, index) {
  var data = this.getIntensifyDataByID(ID);

  if (data == null) {
    return null;
  }

  return data.title;
};

g_intensifyData.getIcon = function (ID) {
  var data = this.getIntensifyDataByID(ID);

  if (data == null) {
    return null;
  }

  return data.icon;
};

g_intensifyData.getValue = function (ID, index) {
  var data = this.getIntensifyDataByID(ID);

  if (data == null) {
    return null;
  }

  return data.value[index];
};

g_intensifyData.getDiamond = function (ID, index) {
  var data = this.getIntensifyDataByID(ID);

  if (data == null) {
    return null;
  }

  return data.diamond[index];
};

cc._RF.pop();