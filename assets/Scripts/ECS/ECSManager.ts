// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import ECSFactory from "./ECSFactory";
import CannonEntitiy from "./Entities/CannonEntitiy";
import MonsterEntity from "./Entities/MonsterEntity";
import AISystem from "./Systems/AISystem";
import AnimateSystem from "./Systems/AnimateSystem";
import NavSystem from "./Systems/NavSystem";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ECSManager extends cc.Component {

    private static _instance:ECSManager=null
    public static getInstance():ECSManager{
        return ECSManager._instance
    }

    onLoad () {
        if(null===ECSManager._instance){
            ECSManager._instance=this
        }
        else{
            this.destroy()
            return
        }
    }

    private monsters:Array<MonsterEntity>=[];
    private cannones:Array<CannonEntitiy>=[];

    async createMonsterEntity(type,index,list,hp,gold,speed){
        let entity=await ECSFactory.getInstance().createMonsterEntity(type,index,list,hp,gold,speed);
        this.monsters.push(entity);

        return entity
    }

    public async createCannonEntity(index:number,level:number){
        let entity=await ECSFactory.getInstance().createCannonEntity(index,level);
        this.cannones.push(entity);

        return entity
    }

    navSystemMonster(dt:number){
        for(let i=0;i<this.monsters.length;i++){
            NavSystem.getInstance().onUpdate(dt,this.monsters[i].navComponent,this.monsters[i].baseComponent,this.monsters[i].transformComponent);
        }
    }

    animateSystemMonster(dt:number){
        for(let i=0;i<this.monsters.length;i++){
            AnimateSystem.getInstance().onMonsterUpdate(dt,this.monsters[i].baseComponent,this.monsters[i].roleComponent,this.monsters[i].animateComponent);
        }
    }

    AISystemCannon(dt:number){
        for(let i=0;i<this.cannones.length;i++){
            console.log(i)
            AISystem.getInstance().onCannonUpdate(dt,this.cannones[i].unitComponent,this.cannones[i].baseComponent);
        }
    }

    calcNearDistance(cannon):cc.Node{
        var minDis = 9999;
        var minMonster:cc.Node = null;
        var curDis = 230;
        
        for (let i = 0; i < this.monsters.length; i++) {
            let monster=this.monsters[i];
            if( monster.unitComponent.isDead )continue;

            let src=cc.v2(monster.baseComponent.gameObject.x,monster.baseComponent.gameObject.y);
            let dst=cc.v2(cannon.x,cannon.y);
            let dis=src.sub(dst).mag();
            
            if(dis < curDis && dis < Math.abs( minDis) ){
                minDis = dis;
                minMonster = monster.baseComponent.gameObject;
            }
        }
        //cc.log(minDis);
        return minMonster;
    }

    protected update(dt: number): void {
        //怪物行走
        this.navSystemMonster(dt);
        //怪物动画
        this.animateSystemMonster(dt);
        //AI
        this.AISystemCannon(dt);
    }
}
