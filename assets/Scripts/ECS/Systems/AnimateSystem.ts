// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { BulletState, UnitState } from "../../Enum";
import AnimateComponent from "../Components/AnimateComponent";
import AttackComponent from "../Components/AttackComponent";
import BaseComponent from "../Components/BaseComponent";
import RoleComponent from "../Components/RoleComponent";
import UnitComponent from "../Components/UnitComponent";
import ECSManager from "../ECSManager";
import AttackSystem from "./AttackSystem";

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

    onBulletUpdate(dt:number,bulletAttackComponent:AttackComponent,bulletBaseComponent:BaseComponent,bulletAnimateComponent:AnimateComponent,bulletUnitComponent:UnitComponent,bulletRoleComponent:RoleComponent){
        if(BulletState.Effect!=bulletAnimateComponent.state){
            return;
        }

        bulletAnimateComponent.playActionTime-=dt;

        if(bulletAnimateComponent.playActionTime<0){
            bulletAnimateComponent.state=BulletState.Attack;
            bulletUnitComponent.state=UnitState.Active;
            let bullet = bulletBaseComponent.gameObject.getChildByName('bullet');
            let effect =bulletBaseComponent.gameObject.getChildByName('effect');
            effect.active = false;
            bullet.active = true;
            if(1==bulletRoleComponent.type){//闪电炮
                cc.tween(bullet)
                .delay(0.1)
                .call(()=>{
                    bulletUnitComponent.isDead=true;
                    let monsterEntity=ECSManager.getInstance().getMonsterById(bulletUnitComponent.monsterID);

                    if(null==monsterEntity){
                        return;
                    }

                    let monsterUnitComponent=monsterEntity.unitComponent;
                    let monsterBaseComponent=monsterEntity.baseComponent;
                    let monsterAttackComponent=monsterEntity.attackComponent;
                    let atk=bulletAttackComponent.atk;
                    AttackSystem.getInstance().attackStartAction(atk,bulletUnitComponent,monsterUnitComponent,monsterBaseComponent,monsterAttackComponent);
                })
                .start();
            }
            
            return;
        }
        
        let effect = bulletBaseComponent.gameObject.getChildByName('effect');
        let bullet = bulletBaseComponent.gameObject.getChildByName('bullet');
        let effectAnimate = effect.getComponent(cc.Animation);
        effect.active = true;
        bullet.active = false;
        effectAnimate.play('fire');
    }

    onEffectUpdate(dt:number,baseComponent:BaseComponent,animateComponent:AnimateComponent,unitComponent:UnitComponent){
        if(unitComponent.isDead){
            return;
        }

        animateComponent.playActionTime-=dt;

        if(animateComponent.playActionTime<0){
            unitComponent.isDead=true;
            return;
        }

        if(unitComponent.state==UnitState.None){
            var anim = baseComponent.gameObject.getComponent(cc.Animation);
            anim.play('deadEffect');
            unitComponent.state=UnitState.Active;
        }
    }
}
