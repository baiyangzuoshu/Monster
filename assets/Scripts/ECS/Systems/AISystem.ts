// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { util } from "../../../FrameWork/Utils/util";
import { BulletState } from "../../Enum";
import AnimateComponent from "../Components/AnimateComponent";
import BaseComponent from "../Components/BaseComponent";
import RoleComponent from "../Components/RoleComponent";
import TransformComponent from "../Components/TransformComponent";
import UnitComponent from "../Components/UnitComponent";
import MonsterEntity from "../Entities/MonsterEntity";

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

    onBulletUpdate(dt:number,monsterEntity:MonsterEntity,unitComponent:UnitComponent,baseComponent:BaseComponent,transformComponent:TransformComponent,roleComponent:RoleComponent,animateComponent:AnimateComponent){
        if( unitComponent.isDead || monsterEntity == null ||animateComponent.state!=BulletState.Attack){
            return;
        }
        
        if(6==roleComponent.type||4==roleComponent.type||2==roleComponent.type||0==roleComponent.type){
            var move = 500*dt;
            var target = monsterEntity.baseComponent.gameObject;
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
            var target = monsterEntity.baseComponent.gameObject;
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
            var target = monsterEntity.baseComponent.gameObject;
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
