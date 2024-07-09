import { Vec2 } from "cc";
import { Vec3 } from "cc";

export class Utils  {
    public static getMonsterPosition(pos:Vec2):Vec3{
        const startX = pos.x * 106 + 106 / 2;
        const startY = -pos.y * 106 - 106 / 2 - 35;

        return new Vec3(startX,startY,0);
    }
}


