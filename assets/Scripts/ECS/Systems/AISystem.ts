// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import utils = require("markdown-it/lib/common/utils");
import { util } from "../../../FrameWork/Utils/util";
import { BulletState, GameState, SkillBuffer } from "../../Enum";
import AnimateComponent from "../Components/AnimateComponent";
import BaseComponent from "../Components/BaseComponent";
import RoleComponent from "../Components/RoleComponent";
import TransformComponent from "../Components/TransformComponent";
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

    async onCannonUpdate(dt,unitComponent:UnitComponent,baseComponent:BaseComponent,roleComponent:RoleComponent) {
        if(unitComponent.state != GameState.Active){
            return
        }
        
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

            unitComponent.fireTime-=dt;

            if( unitComponent.fireTime>0 ){
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
                    unitComponent.fireTime = 1.0;
                    
                    let worldPos=baseComponent.gameObject.getChildByName("gun").convertToWorldSpaceAR(cc.v3(0,0,0));
                    await ECSManager.getInstance().createBulletEntity(roleComponent.level,worldPos,unitComponent.m_attackTarget,unitComponent.angle);

                    baseComponent.gameObject.getChildByName("gun").angle=angle;
                    unitComponent.angle=angle;

                    unitComponent.m_attackTarget=null;
                }
            }
        }
    }

    onBulletUpdate(dt:number,unitComponent:UnitComponent,baseComponent:BaseComponent,transformComponent:TransformComponent,roleComponent:RoleComponent,animateComponent:AnimateComponent){
        if( unitComponent.isDead || unitComponent.m_attackTarget == null ||animateComponent.state!=BulletState.Attack){
            return;
        }
        
        if(6==roleComponent.type||4==roleComponent.type||2==roleComponent.type||0==roleComponent.type){
            var move = 500*dt;

            var target = unitComponent.m_attackTarget;
            var targetH = target.height;
            var moveToPos = target.getPosition();
            moveToPos.y += targetH/2;
            var angle = util.getAngle(baseComponent.gameObject.getPosition(),moveToPos);
            
            var x = Math.cos(angle * (Math.PI/180)) * move ;
            var y = Math.sin(angle * (Math.PI/180)) * move ;
    
            baseComponent.gameObject.x += x;
            baseComponent.gameObject.y += y;
    
            transformComponent.x=baseComponent.gameObject.x;
            transformComponent.y=baseComponent.gameObject.y;
        }
        else if(1==roleComponent.type){
           
            var target = unitComponent.m_attackTarget;
            var targetPos = target.getPosition();
    
            var bulletPos = baseComponent.gameObject.convertToWorldSpaceAR(cc.v2(0,0));
            var targetPos = target.convertToWorldSpaceAR(cc.v2(0,0));
    
            var targetH = target.height;
            targetPos.y += targetH/2;
            var angle = util.getAngle(bulletPos,targetPos);
            this.node.angle = angle;
            let dir=cc.v3()
            cc.Vec3.subtract(dir,cc.v3(targetPos.x,targetPos.y),cc.v3(bulletPos.x,bulletPos.y))
            var dis = dir.len();
    
            dis = Math.abs(dis);
        }
        else if(3==roleComponent.type){
            
            var move = 500*dt;

            var target = unitComponent.m_attackTarget;
            var targetH = target.height;
            var moveToPos = target.getPosition();
            moveToPos.y += targetH/2;
            var angle = util.getAngle(baseComponent.gameObject.getPosition(),moveToPos);
            
            var x = Math.cos(angle * (Math.PI/180)) * move ;//+ this._playerNode.x;
            var y = Math.sin(angle * (Math.PI/180)) * move ;//+ this._playerNode.y;

            baseComponent.gameObject.angle = angle - 90;

            baseComponent.gameObject.x += x;
            baseComponent.gameObject.y += y;

            transformComponent.x=baseComponent.gameObject.x;
            transformComponent.y=baseComponent.gameObject.y;
        }
        
    }
}
