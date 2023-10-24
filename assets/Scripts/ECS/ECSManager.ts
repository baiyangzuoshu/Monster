// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { GameStateType } from "../Enum";
import PlayerDataManager from "../Manager/PlayerDataManager";
import ECSFactory from "./ECSFactory";
import BulletEntity from "./Entities/BulletEntity";
import CannonEntity from "./Entities/CannonEntity";
import MonsterEntity from "./Entities/MonsterEntity";
import AISystem from "./Systems/AISystem";
import AnimateSystem from "./Systems/AnimateSystem";
import AttackSystem from "./Systems/AttackSystem";
import CollectHitSystem from "./Systems/CollectHitSystem";
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
    private cannones:Array<CannonEntity>=[];
    private bullets:Array<BulletEntity>=[];

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

    public async createBulletEntity(level:number,worldPos:cc.Vec3,attackEntity:MonsterEntity,angle:number){
        let entity=await ECSFactory.getInstance().createBulletEntity(level,worldPos,attackEntity,angle);
        this.bullets.push(entity);

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

    animateSystemBullet(dt:number){
        for(let i=0;i<this.bullets.length;i++){
            AnimateSystem.getInstance().onBulletUpdate(dt,this.bullets[i].baseComponent,this.bullets[i].animateComponent);
        }
    }

    async attackSystemUpdate(dt:number){
        for(let i=0;i<this.cannones.length;i++){
            await AttackSystem.getInstance().onUpdate(dt,this.cannones[i].unitComponent,this.cannones[i].baseComponent,this.cannones[i].roleComponent,this.cannones[i].attackComponent);
        }
    }

    AISystemBullet(dt:number){
        for(let i=0;i<this.bullets.length;i++){
            AISystem.getInstance().onBulletUpdate(dt,this.bullets[i].unitComponent,this.bullets[i].baseComponent,this.bullets[i].transformComponent,this.bullets[i].roleComponent,this.bullets[i].animateComponent);
        }
    }

    collectHitSystemBullet(dt:number){
        for(let i=0;i<this.bullets.length;i++){
            let bullet=this.bullets[i];
            let bulletTransformComponent=bullet.transformComponent;
            let bulletUnitComponent=bullet.unitComponent;
            let bulletShapeComponent=bullet.shapeComponent;
            let monsterEntity=bulletUnitComponent.attackEntity;

            if(bulletUnitComponent.isDead)continue;
            if(null==monsterEntity)continue;

            let monsterUnitComponent=monsterEntity.unitComponent;
            let monsterBaseComponent=monsterEntity.baseComponent;
            let monsterAttackComponent=monsterEntity.attackComponent;
            let atk=bullet.attackComponent.atk;

            let hitPos=cc.v2(monsterEntity.baseComponent.gameObject.x,monsterEntity.baseComponent.gameObject.y);
            let isHit=CollectHitSystem.getInstance().onUpdate(atk,hitPos,bulletShapeComponent,bulletTransformComponent,bulletUnitComponent,monsterUnitComponent,monsterBaseComponent,monsterAttackComponent);
            if(isHit){
                bulletUnitComponent.isDead=true;
            }
        }
    }

    cleanDeadMonster(){
        for(let i=0;i<this.monsters.length;i++){
            if(this.monsters[i].unitComponent.isDead){
                //this.monsters[i].baseComponent.gameObject.destroy();
                this.monsters.splice(i,1);
                i--;
            }
        }
    }

    cleanDeadBullet(){
        for(let i=0;i<this.bullets.length;i++){
            if(this.bullets[i].unitComponent.isDead){
                this.bullets[i].baseComponent.gameObject.destroy();
                this.bullets.splice(i,1);
                i--;
            }
        }
    }

    calcNearDistance(cannon):MonsterEntity{
        var minDis = 9999;
        var minMonster:MonsterEntity = null;
        var curDis = 230;
        
        for (let i = 0; i < this.monsters.length; i++) {
            let monster=this.monsters[i];
            if( monster.unitComponent.isDead )continue;

            let src=cc.v2(monster.baseComponent.gameObject.x,monster.baseComponent.gameObject.y);
            let dst=cc.v2(cannon.x,cannon.y);
            let dis=src.sub(dst).mag();
            
            if(dis < curDis && dis < Math.abs( minDis) ){
                minDis = dis;
                minMonster = monster;
            }
        }
        //cc.log(minDis);
        return minMonster;
    }

    protected async update(dt: number): Promise<void> {
        if(GameStateType.Playing!=PlayerDataManager.getInstance().gameStateType){
            return;
        }
        //怪物行走
        this.navSystemMonster(dt);
        //怪物动画
        this.animateSystemMonster(dt);
        //攻击
        await this.attackSystemUpdate(dt);
        //子弹动画
        this.animateSystemBullet(dt);
        //AI
        this.AISystemBullet(dt);
        //碰撞检测
        this.collectHitSystemBullet(dt);
        //清理死亡怪物
        this.cleanDeadMonster();
        //清理死亡子弹
        this.cleanDeadBullet();
    }
}
