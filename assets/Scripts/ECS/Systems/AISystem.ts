// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import utils = require("markdown-it/lib/common/utils");
import { util } from "../../../FrameWork/Utils/util";
import { SkillBuffer } from "../../Enum";
import BaseComponent from "../Components/BaseComponent";
import UnitComponent from "../Components/UnitComponent";
import ECSManager from "../ECSManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class AISystem extends cc.Component {
    private static _instance:AISystem=null
    public static getInstance():AISystem{
        return AISystem._instance
    }

    onLoad () {
        if(null===AISystem._instance){
            AISystem._instance=this
        }
        else{
            this.destroy()
            return
        }
    }

    onCannonUpdate(dt,unitComponent:UnitComponent,baseComponent:BaseComponent) {
        if( unitComponent.m_attackTarget == null){
            unitComponent.m_attackTarget = ECSManager.getInstance().calcNearDistance(baseComponent.gameObject);
        }
        if( unitComponent.m_attackTarget != null){
            if( unitComponent.isDead ){
                unitComponent.m_attackTarget=null;
                return;
            }
            let src=cc.v3(unitComponent.m_attackTarget.getPosition().x,unitComponent.m_attackTarget.getPosition().y,0)
            let dst=cc.v3(baseComponent.gameObject.x,baseComponent.gameObject.y,0)
            let dir=cc.v3()
            cc.Vec3.subtract(dir,src,dst)
            var dis = dir.len();
            //cc.log(dis);
            var curDis = 230;
            Math.abs(dis);
            if(dis > curDis ){
                unitComponent.m_attackTarget=null;
                return;
            }
            var start = baseComponent.gameObject.getPosition();
            var end = unitComponent.m_attackTarget.getPosition();
            var angle = util.getAngle(start,end);
            angle += 360;
            angle -= 90;
            if( unitComponent.m_bFire ){
                unitComponent.angle=angle;
                baseComponent.gameObject.getChildByName("gun").angle=unitComponent.angle;
            }else{
                var moveAngle = 300*dt;
                if( unitComponent.angle > angle || 
                    angle - unitComponent.angle > 180 ){
                    moveAngle = -moveAngle;
                }

                unitComponent.angle += moveAngle;
                baseComponent.gameObject.getChildByName("gun").angle=unitComponent.angle;

                if( unitComponent.angle < 0 ) {
                    unitComponent.angle += 360;
                    baseComponent.gameObject.getChildByName("gun").angle=unitComponent.angle;
                }
                

                if( Math.abs(unitComponent.angle - angle) < Math.abs(moveAngle) ){
                    unitComponent.m_bFire = true;
                    //this.beginFire();
                    baseComponent.gameObject.getChildByName("gun").angle=angle;
                    unitComponent.angle=angle;
                }
            }
        }
    }
}
