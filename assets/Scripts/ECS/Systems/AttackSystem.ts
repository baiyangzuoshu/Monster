// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { Interface } from "readline";
import { util } from "../../../FrameWork/Utils/util";
import DataManager from "../../data/DataManager";
import IntensifyDataManager from "../../data/IntensifyDataManager";
import { GameState, Intensify, SkillBuffer, Task } from "../../Enum";
import PlayerDataManager from "../../Manager/PlayerDataManager";
import BaseComponent from "../Components/BaseComponent";
import RoleComponent from "../Components/RoleComponent";
import UnitComponent from "../Components/UnitComponent";
import ECSManager from "../ECSManager";

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

    public attackStartAction(hp:number,unitComponent:UnitComponent,baseComponent:BaseComponent,roleComponent:RoleComponent){
        if(unitComponent.isDead ){
            return;
        }
        if( hp == null ){
            cc.log('攻击力未定义');
            return;
        }
       
        var rand = util.randomNum(0,1000);
        var isDouble = false;
        if( rand <= 500){
            var lv = PlayerDataManager.getInstance().getInternsifLevel(Intensify.INTENSIFY_BAOJI);
            var double = IntensifyDataManager.getInstance().getValue(Intensify.INTENSIFY_BAOJI,lv);
            hp = hp*2+hp*(double/100);
            hp = hp+hp*(double/100);
            //hp = hp.toFixed(2);
            isDouble = true;
        }
        
        roleComponent.hp -= hp;
        if( roleComponent.hp <= 0 ){
            baseComponent.gameObject.stopAllActions();
            let m_HpBar=baseComponent.gameObject.getChildByName("item").getChildByName("hp").getChildByName("bar").getComponent(cc.ProgressBar);
            m_HpBar.progress = 0;

            unitComponent.isDead = true;
            baseComponent.gameObject.opacity = 0;
            var pos = baseComponent.gameObject.getPosition();
            //g_effectBuild.createDeadEffect(pos);
            var cale_gold = roleComponent.gold;
            
            if( cale_gold > 0){
                var flyEnd = function(gold){
                    PlayerDataManager.getInstance().addGold(gold);
                    //g_gameUI.updateGameUI();
                }
                //g_coinFly.createCoinToTip(this.node,flyEnd.bind(this),cale_gold);
            }

            DataManager.getInstance().subCurMonsterCount();
            //杀死最后一个怪物
            if( DataManager.getInstance().getCurMonsterCount() <= 0 ){
                //显示结算框
                //g_gameUI.showSucceed();
                // //2面以后关闭结算框,进行下一局
                // this.scheduleOnce(function() {
                //     g_GlobalData.hideSmallSettlement();
                // }, 2);
            }
            
            PlayerDataManager.getInstance().addTaskCount(Task.TASK_JIDAO_DIREN);
            
        }else{
            let m_HpBar=baseComponent.gameObject.getChildByName("item").getChildByName("hp").getChildByName("bar").getComponent(cc.ProgressBar);
            m_HpBar.progress = roleComponent.hp / roleComponent.maxHp;
        }
        let str="";
        if( isDouble ){
            str = '暴击'+hp;
        }
        //g_hpEffect.createHpEffect(this.node.getPosition(),str);
    }

    async onUpdate(dt,unitComponent:UnitComponent,baseComponent:BaseComponent,roleComponent:RoleComponent) {
        if(unitComponent.state != GameState.Active||unitComponent.isDead){
            return
        }
        
        if( unitComponent.m_attackTarget == null){
            unitComponent.attackEntity = ECSManager.getInstance().calcNearDistance(baseComponent.gameObject);
            if(unitComponent.attackEntity){
                unitComponent.m_attackTarget=unitComponent.attackEntity.baseComponent.gameObject;
            }
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

                    this.attackStartAction(roleComponent.atk,unitComponent.attackEntity.unitComponent,unitComponent.attackEntity.baseComponent,unitComponent.attackEntity.roleComponent);

                    unitComponent.m_attackTarget=null;
                    unitComponent.attackEntity=null;
                }
            }
        }
    }
}
