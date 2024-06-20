import { Vec3 } from "cc";

export function randomNum(minNum: number, maxNum?: number): number {
    if (maxNum === undefined) {
      return Math.floor(Math.random() * minNum + 1);
    } else {
      return Math.floor(Math.random() * (maxNum - minNum + 1) + minNum);
    }
  }
  
  export function getAngle(start: Vec3, end: Vec3): number {
    const x = end.x - start.x;
    const y = end.y - start.y;
    const hypotenuse = Math.sqrt(x * x + y * y);
  
    const cos = x / hypotenuse;
    const radian = Math.acos(cos);
    let angle = 180 / (Math.PI / radian);
  
    if (y < 0) {
      angle = -angle;
    } else if (y === 0 && x < 0) {
      angle = 180;
    }
    return angle;
  }
  
  export function getDistance(start: Vec3, end: Vec3): number {
    const pos = new Vec3(start.x - end.x, start.y - end.y, start.z - end.z);
    const dis = Math.sqrt(pos.x * pos.x + pos.y * pos.y + pos.z * pos.z);
    return dis;
  }
  
  export function numberToString(number: number): string {
    let str = '';
    const data = [
      { minnum: 1000000000, maxnum: 9999999999, toStr: 'e' },
      { minnum: 100000000, maxnum: 999999999, toStr: 'o' },
      { minnum: 10000000, maxnum: 99999999, toStr: 'p' },
      { minnum: 1000000, maxnum: 9999999, toStr: 't' },
      { minnum: 100000, maxnum: 999999, toStr: 'g' },
      { minnum: 10000, maxnum: 99999, toStr: 'm' },
      { minnum: 1000, maxnum: 9999, toStr: 'b' },
      { minnum: 100, maxnum: 999, toStr: 'k' },
    ];
    for (const item of data) {
      if (number >= item.minnum && number <= item.maxnum) {
        number /= item.minnum;
        number = parseFloat(number.toFixed(1));
        str = '' + number + item.toStr;
        return str;
      }
    }
    return '' + number;
  }
  
  declare global {
    interface String {
      format(...args: any[]): string;
    }
  }
  
  String.prototype.format = function (...args: any[]): string {
    let s = this;
    for (let i = 0; i < args.length; i++) {
      s = s.replace(new RegExp(`\\{${i}\\}`, 'g'), args[i]);
    }
    return s;
  };
  