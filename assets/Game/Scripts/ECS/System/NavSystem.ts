import { v2 } from "cc";
import { BaseComponent } from "../Component/BaseComponent";
import { NaviComponent } from "../Component/NaviComponent";
import { v3 } from "cc";
import { Utils } from "../../Utils/Utils";

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
}

