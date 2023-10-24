// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { BulletState } from "../../Enum";
import AnimateComponent from "../Components/AnimateComponent";
import BaseComponent from "../Components/BaseComponent";
import RoleComponent from "../Components/RoleComponent";

const {ccclass, property} = cc._decorator;

@ccclass
export default class AnimateSystem extends cc.Component {

    private static _instance:AnimateSystem=null
    public static getInstance():AnimateSystem{
        return AnimateSystem._instance
    }

    onLoad () {
        if(null===AnimateSystem._instance){
            AnimateSystem._instance=this
        }
        else{
            this.destroy()
            return
        }
    }

    onMonsterUpdate(dt,baseComponent:BaseComponent,roleComponent:RoleComponent,animateComponent:AnimateComponent) {
        if(animateComponent.playActionTime>0){
            animateComponent.playActionTime-=dt;
            return;
        }
        
        if( roleComponent.type > 0 ){
            animateComponent.playActionTime=1;

            var moveScale1 = cc.scaleTo(0.5,1.1,0.9);
            var moveScale2 = cc.scaleTo(0.5,0.9,1.1);
            var seqMoveScale = cc.sequence(moveScale1,moveScale2);
    
            baseComponent.gameObject.runAction(seqMoveScale);
        }else{
            animateComponent.playActionTime=0.4;

            var jump1 = cc.moveBy(0.2,cc.v2(0,30));
            var jump2 = cc.moveBy(0.2,cc.v2(0,-30));
            var seqJump = cc.sequence(jump1,jump2);

            baseComponent.gameObject.runAction(seqJump);
        }
    }

    onBulletUpdate(dt:number,baseComponent:BaseComponent,animateComponent:AnimateComponent){
        if(BulletState.Effect!=animateComponent.state){
            return;
        }

        animateComponent.playActionTime-=dt;

        if(animateComponent.playActionTime<0){
            animateComponent.state=BulletState.Attack;
            let bullet = baseComponent.gameObject.getChildByName('bullet');
            let effect =baseComponent.gameObject.getChildByName('effect');
            effect.active = false;
            bullet.active = true;
            return;
        }
        
        let effect = baseComponent.gameObject.getChildByName('effect');
        let bullet = baseComponent.gameObject.getChildByName('bullet');
        let effectAnimate = effect.getComponent(cc.Animation);
        effect.active = true;
        bullet.active = false;
        effectAnimate.play('fire');
    }

    
}
