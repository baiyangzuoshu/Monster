import { BaseComponent } from "../Component/BaseComponent";
import { NaviComponent } from "../Component/NaviComponent";
import { Utils } from "../../Utils/Utils";
import { getAngle } from "../../../../script/utlis";
import { UITransform } from "cc";
import { AttackComponent } from "../Component/AttackComponent";

export class NavSystem {
    static update(baseCompnent:BaseComponent,navCompnent:NaviComponent,deltaTime: number) {
        if(navCompnent.pathIndex>=navCompnent.pathList.length){
            return;
        }

        if(navCompnent.time<=0){
            navCompnent.pathIndex++;
            if(navCompnent.pathIndex>=navCompnent.pathList.length){
                return;
            }

            let start=Utils.getMonsterPosition(navCompnent.pathList[navCompnent.pathIndex-1]);
            let end=Utils.getMonsterPosition(navCompnent.pathList[navCompnent.pathIndex]);
            let dir=end.subtract(start);
            let len=dir.length();

            navCompnent.time=len/navCompnent.speed;
            navCompnent.vx=navCompnent.speed*(dir.x/len);
            navCompnent.vy=navCompnent.speed*(dir.y/len);
            return;
        }

        navCompnent.time-=deltaTime;
        let x=baseCompnent.gameObject.position.x+navCompnent.vx*deltaTime;
        let y=baseCompnent.gameObject.position.y+navCompnent.vy*deltaTime;
        baseCompnent.gameObject.setPosition(x,y);
    }

    static bulletUpdate(baseCompnent:BaseComponent,attackComponent:AttackComponent,dt: number) {
        const bullet = baseCompnent.gameObject;
        
        const target = attackComponent.m_attackTarget;
        if (target == null) return;

        const move = 500 * dt;

        const targetH = target.getComponent(UITransform).height;
        const moveToPos = target.getPosition();
        moveToPos.y += targetH / 2;
        const angle = getAngle(bullet.getPosition(), moveToPos);

        const x = Math.cos(angle * (Math.PI / 180)) * move;
        const y = Math.sin(angle * (Math.PI / 180)) * move;

        bullet.setPosition(bullet.position.x + x, bullet.position.y + y);
    }
}

