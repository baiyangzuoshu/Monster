//生成从minNum到maxNum的随机数
function randomNum(minNum, maxNum) {
  switch (arguments.length) {
    case 1:
      return parseInt(Math.random() * minNum + 1, 10);
      break;
    case 2:
      return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
      //或者 Math.floor(Math.random()*( maxNum - minNum + 1 ) + minNum );
      break;
    default:
      return 0;
      break;
  }
}

function getAngle(start, end) {
  //两点的x、y值
  var x = end.x - start.x;
  var y = end.y - start.y;
  var hypotenuse = Math.sqrt(x * x + y * y);

  //斜边长度
  var cos = x / hypotenuse;

  var radian = Math.acos(cos);

  //求出弧度
  var angle = 180 / (Math.PI / radian);

  //用弧度算出角度
  if (y < 0) {
    angle = 0 - angle;
  }
  else if (y == 0 && x < 0) {
    angle = 180;
  }
  return angle;
}

function getDistance(start, end) {
  var pos = cc.v2(start.x - end.x, start.y - end.y);
  var dis = Math.sqrt(pos.x * pos.x + pos.y * pos.y);
  return dis;
}

function numberToString(number) {
  var str = '';
  var data = [
    { minnum: 1000000000,maxnum:9999999999, toStr: 'e' },
    { minnum: 100000000,maxnum:999999999, toStr: 'o' },
    { minnum: 10000000,maxnum:99999999, toStr: 'p' },
    { minnum: 1000000,maxnum:9999999, toStr: 't' },
    { minnum: 100000,maxnum:999999, toStr: 'g' },
    { minnum: 10000,maxnum:99999, toStr: 'm' },
    { minnum: 1000,maxnum:9999, toStr: 'b' },
    { minnum: 100,maxnum:999, toStr: 'k' },
  ];
  for (let i = 0; i < data.length; i++) {
    if (number >= data[i].minnum && number <=  data[i].maxnum ) {
      number /= data[i].minnum;
      number = number.toFixed(1);
      str = '' + number + data[i].toStr;
      return str;
    }
  }
  return ''+number;
}

String.prototype.format = function(){
  if(arguments.length==0){
    return this;
  }
  for(var s=this, i=0; i<arguments.length; i++){
    s = s.replace(new RegExp("\\{"+i+"\\}","g"), arguments[i]);
  }
  return s;
};