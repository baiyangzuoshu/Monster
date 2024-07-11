import { _decorator, Component, Node } from 'cc';
import { MonsterEntity } from './Entity/MonsterEntity';
import { CannonEntity } from './Entity/CannonEntity';
import { ECSFactory } from './ECSFactory';
import { NavSystem } from './System/NavSystem';
import { Vec3 } from 'cc';
import { BulletEntity } from './Entity/BulletEntity';
import { SkillManager } from '../../../script/gameUI/skillBuffer';
import { BUFFER_QUANPINGGONGJI } from '../../../script/define';
import { getDistance } from '../../../script/utlis';
import { AttackSystem } from './System/AttackSystem';
import { CollisionSystem } from './System/CollisionSystem';
const { ccclass, property } = _decorator;

@ccclass('ECSWorld')
export class ECSWorld extends Component {
    private static _instance:ECSWorld=null;

    private monsters:MonsterEntity[]=[];
    private cannons:CannonEntity[]=[];
    private bullets:BulletEntity[]=[];

    static get instance(){
        return this._instance;
    }

    onLoad() {
        if(ECSWorld._instance){
            this.destroy();
            return;
        }

        ECSWorld._instance=this;
    }

    public destroyEntity(entity:MonsterEntity|CannonEntity|BulletEntity){
        if(entity instanceof MonsterEntity){
            let index=this.monsters.indexOf(entity);
            if(index>=0){
                this.monsters[index].baseCompnent.gameObject.destroy();
                this.monsters.splice(index,1);
            }
        }else if(entity instanceof CannonEntity){
            let index=this.cannons.indexOf(entity);
            if(index>=0){
                this.cannons[index].baseCompnent.gameObject.destroy();
                this.cannons.splice(index,1);
            }
        }else if(entity instanceof BulletEntity){
            let index=this.bullets.indexOf(entity);
            if(index>=0){
                this.bullets[index].baseCompnent.gameObject.destroy();
                this.bullets.splice(index,1);
            }
        }
    }

    public async createMonster(index:number):Promise<MonsterEntity>{
        let entity=await ECSFactory.createMonster(index);
        this.monsters.push(entity);
        return entity;
    }

    public async createCannon(pos:Vec3):Promise<CannonEntity>{
        let entity=await ECSFactory.createCannon(pos);
        this.cannons.push(entity);
        return entity;
    }

    public async createBullet(target:Node,pos:Vec3,index:number,atk:number):Promise<BulletEntity>{
        let entity=await ECSFactory.createBullet(target,pos,index,atk);
        this.bullets.push(entity);
        return entity
    }
    //
    calcNearDistance(cannon: Node) {
        let minDis = 9999;
        let minMonster:Node = null;
        let curDis = 230;
        if (SkillManager.instance.bufferState[BUFFER_QUANPINGGONGJI]) {
            curDis *= 10;
        }
        for (let i = 0; i < this.monsters.length; i++) {
            const dis = getDistance(this.monsters[i].baseCompnent.gameObject.getPosition(), cannon.getPosition());
            if (dis < curDis && dis < Math.abs(minDis)) {
                minDis = dis;
                minMonster = this.monsters[i].baseCompnent.gameObject;
            }
        }
        return minMonster;
    }
    //
    private navMonster(deltaTime: number){
        for (let i = 0; i < this.monsters.length; i++) {
            NavSystem.update(this.monsters[i].baseCompnent,this.monsters[i].navCompnent,deltaTime);
        }
    }

    private navBullet(deltaTime: number){
        for (let i = 0; i < this.bullets.length; i++) {
            NavSystem.bulletUpdate(this.bullets[i].baseCompnent,this.bullets[i].attackComponent,deltaTime);
        }
    }

    private cannonAttack(deltaTime: number){
        for (let i = 0; i < this.cannons.length; i++) {
            const cannonEntity = this.cannons[i];
            cannonEntity.attackComponent.m_fireTime -= deltaTime;
            if(cannonEntity.attackComponent.m_fireTime>0){
                continue;
            }

            const target = this.calcNearDistance(this.cannons[i].baseCompnent.gameObject);
            if (cannonEntity.attackComponent.m_attackTarget == null) {
                cannonEntity.attackComponent.m_attackTarget=target;
            }

            AttackSystem.cannonAttackUpdate(cannonEntity,deltaTime);
        }
    }

    private bulletAttack(deltaTime: number){
        let removeList:BulletEntity[]=[];
        for (let i = 0; i < this.bullets.length; i++) {
            if(!this.bullets[i].attackComponent.m_bHit)continue;

            AttackSystem.bulletAttackUpdate(this.bullets[i],deltaTime);

            removeList.push(this.bullets[i]);
        }

        for (let i = 0; i < removeList.length; i++) {
            this.destroyEntity(removeList[i]);
        }
    }

    private checkBuletCollision(){
        for (let i = 0; i < this.bullets.length; i++) {
            if(this.bullets[i].attackComponent.m_bHit)continue;

            for (let j = 0; j < this.monsters.length; j++) {
                CollisionSystem.checkCollision(this.bullets[i],this.monsters[j]);
            }
        }
    }

    update(deltaTime: number) {
        //
        this.navMonster(deltaTime);
        this.navBullet(deltaTime);
        //
        this.cannonAttack(deltaTime);
        this.bulletAttack(deltaTime);
        //
        this.checkBuletCollision();
    }
}

