// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { EventManager } from "../../../FrameWork/manager/EventManager";
import { UIManagerPro } from "../../../FrameWork/manager/UIManagerPro";
import { util } from "../../../FrameWork/Utils/util";
import DataManager from "../../data/DataManager";
import IntensifyDataManager from "../../data/IntensifyDataManager";
import {Intensify, Task, UnitState } from "../../Enum";
import { GameUI } from "../../EventName";
import PlayerDataManager from "../../Manager/PlayerDataManager";
import AttackComponent from "../Components/AttackComponent";
import BaseComponent from "../Components/BaseComponent";
import RoleComponent from "../Components/RoleComponent";
import UnitComponent from "../Components/UnitComponent";
import ECSManager from "../ECSManager";
import MonsterEntity from "../Entities/MonsterEntity";

const {ccclass, property} = cc._decorator;

@ccclass
export default class AttackSystem extends cc.Component {

    private static _instance:AttackSystem=null
    public static getInstance():AttackSystem{
        return AttackSystem._instance
    }

    onLoad () {
        if(null===AttackSystem._instance){
            AttackSystem._instance=this
        }
        else{
            this.destroy()
            return
        }
    }

    public async attackStartAction(hp:number,bulletUnitComponent:UnitComponent,monsterUnitComponent:UnitComponent,monsterBaseComponent:BaseComponent,monsterAttackComponent:AttackComponent){
        if(monsterUnitComponent.isDead ){
            return;
        }
        var rand = util.randomNum(0,1000);
        var isDouble = false;
        if( rand <= 500){
            var lv = PlayerDataManager.getInstance().getInternsifLevel(Intensify.INTENSIFY_BAOJI);
            var double = IntensifyDataManager.getInstance().getValue(Intensify.INTENSIFY_BAOJI,lv);
            hp = hp*2+hp*(double/100);
            hp = hp+hp*(double/100);
            hp = Math.floor(hp);
            isDouble = true;
        }
        monsterAttackComponent.hp -= hp;
        if( monsterAttackComponent.hp <= 0 ){
            monsterBaseComponent.gameObject.stopAllActions();
            let m_HpBar=monsterBaseComponent.gameObject.getChildByName("item").getChildByName("hp").getChildByName("bar").getComponent(cc.ProgressBar);
            m_HpBar.progress = 0;

            monsterUnitComponent.isDead = true;
            monsterBaseComponent.gameObject.opacity = 0;

            bulletUnitComponent.monsterID = 0;

            var pos = monsterBaseComponent.gameObject.convertToWorldSpaceAR(cc.v3(0,0,0));
            await ECSManager.getInstance().createEffectEntity(pos);
            
            var cale_gold = monsterAttackComponent.gold;
            
            if( cale_gold > 0){
                var flyEnd = function(gold){
                    PlayerDataManager.getInstance().addGold(gold);
                    EventManager.getInstance().emit(GameUI.updateGameUI);
                }
                //g_coinFly.createCoinToTip(this.node,flyEnd.bind(this),cale_gold);
            }
            DataManager.getInstance().subCurMonsterCount();
            //杀死最后一个怪物
            if( DataManager.getInstance().getCurMonsterCount() <= 0 ){
                //显示结算框
                EventManager.getInstance().emit(GameUI.showSucceed);
                // //2面以后关闭结算框,进行下一局
                this.scheduleOnce(function() {
                    UIManagerPro.getInstance().closePrefab("SmallSettlementUI");
                }, 2);
            }
            
            PlayerDataManager.getInstance().addTaskCount(Task.TASK_JIDAO_DIREN);
            
        }else{
            let m_HpBar=monsterBaseComponent.gameObject.getChildByName("item").getChildByName("hp").getChildByName("bar").getComponent(cc.ProgressBar);
            m_HpBar.progress = monsterAttackComponent.hp / monsterAttackComponent.maxHp;
        }
        let str="";
        if( isDouble ){
            str = '暴击'+hp;
        }
        //g_hpEffect.createHpEffect(this.node.getPosition(),str);
        let worldPos=monsterBaseComponent.gameObject.convertToWorldSpaceAR(cc.v3(0,0,0));
        EventManager.getInstance().emit(GameUI.createHpEffect,{worldPos:worldPos,str:str});
    }

    async onUpdate(dt,cannonUnitComponent:UnitComponent,cannonBaseComponent:BaseComponent,cannonRoleComponent:RoleComponent,cannonAttackComponent:AttackComponent) {
        if(cannonUnitComponent.state != UnitState.Active||cannonUnitComponent.isDead){
            return
        }
        let attackEntity:MonsterEntity=null;
        if( cannonUnitComponent.monsterID == 0){
            attackEntity = ECSManager.getInstance().calcNearDistance(cannonBaseComponent.gameObject);
        }

        if( attackEntity != null){
            if( cannonUnitComponent.isDead ){
                cannonUnitComponent.monsterID=0;
                return;
            }
            var end = attackEntity.baseComponent.gameObject.getPosition();
            let src=cc.v3(end.x,end.y,0)
            let dst=cc.v3(cannonBaseComponent.gameObject.x,cannonBaseComponent.gameObject.y,0)
            let dir=cc.v3()
            cc.Vec3.subtract(dir,src,dst)
            var dis = dir.len();
            //cc.log(dis);
            var curDis = 230;
            Math.abs(dis);
            if(dis > curDis ){
                cannonUnitComponent.monsterID=0;
                return;
            }
            var start = cannonBaseComponent.gameObject.getPosition();
            
            var angle = util.getAngle(start,end);
            angle += 360;
            angle -= 90;

            cannonUnitComponent.fireTime-=dt;

            if( cannonUnitComponent.fireTime>0 ){
                cannonUnitComponent.angle=angle;
                cannonBaseComponent.gameObject.getChildByName("gun").angle=cannonUnitComponent.angle;
            }else{
                var moveAngle = 300*dt;
                if( cannonUnitComponent.angle > angle || 
                    angle - cannonUnitComponent.angle > 180 ){
                    moveAngle = -moveAngle;
                }

                cannonUnitComponent.angle += moveAngle;
                cannonBaseComponent.gameObject.getChildByName("gun").angle=cannonUnitComponent.angle;

                if( cannonUnitComponent.angle < 0 ) {
                    cannonUnitComponent.angle += 360;
                    cannonBaseComponent.gameObject.getChildByName("gun").angle=cannonUnitComponent.angle;
                }

                if( Math.abs(cannonUnitComponent.angle - angle) < Math.abs(moveAngle) ){
                    cannonUnitComponent.fireTime = 1.0;
                    
                    let worldPos=cannonBaseComponent.gameObject.getChildByName("gun").convertToWorldSpaceAR(cc.v3(0,0,0));
                    await ECSManager.getInstance().createBulletEntity(cannonRoleComponent.level,worldPos,attackEntity,cannonUnitComponent.angle);

                    cannonBaseComponent.gameObject.getChildByName("gun").angle=angle;
                    cannonUnitComponent.angle=angle;
                    
                    cannonUnitComponent.monsterID = 0;
                }
            }
        }
    }
}
