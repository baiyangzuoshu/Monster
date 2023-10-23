// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { EventManager } from "../../../FrameWork/manager/EventManager";
import { GameStateType } from "../../Enum";
import { GameUI } from "../../EventName";
import PlayerDataManager from "../../Manager/PlayerDataManager";
import BaseComponent from "../Components/BaseComponent";
import NavComponent from "../Components/NavComponent";
import TransformComponent from "../Components/TransformComponent";
import EntityUtils from "../EntityUtils";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NavSystem extends cc.Component {
    private static _instance:NavSystem=null
    public static getInstance():NavSystem{
        return NavSystem._instance
    }

    onLoad () {
        if(null===NavSystem._instance){
            NavSystem._instance=this
        }
        else{
            this.destroy()
            return
        }
    }

    public onUpdate(dt:number,navComponent:NavComponent,baseComponent:BaseComponent,transformComponent:TransformComponent) {
        if(navComponent.curTime>0){
            navComponent.curTime-=dt
            transformComponent.x+=dt*navComponent.vx;
            transformComponent.y+=dt*navComponent.vy;

            baseComponent.gameObject.x=transformComponent.x;
            baseComponent.gameObject.y=transformComponent.y;

            return
        }

        navComponent.curIndex++;
        if(navComponent.pathList.length-1<navComponent.curIndex){
            PlayerDataManager.getInstance().gameStateType=GameStateType.End;
            EventManager.getInstance().emit(GameUI.gameOver);
            return
        }

        var src = cc.v3(transformComponent.x,transformComponent.y,0)
        var dst = cc.v3(navComponent.pathList[navComponent.curIndex].x, navComponent.pathList[navComponent.curIndex].y, 0);
        var dir = cc.v3();
        cc.Vec3.subtract(dir, dst, src);
        var dis = dir.len()

        EntityUtils.getInstance().updateMonsterDirection(src,dst,baseComponent);

        navComponent.curTime = dis / navComponent.speed;

        navComponent.vx = navComponent.speed * dir.x / dis;
        navComponent.vy = navComponent.speed * dir.y / dis;
    }
}
