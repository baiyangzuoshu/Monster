import { _decorator, Component, Node } from 'cc';
import { MonsterEntity } from './Entity/MonsterEntity';
import { CannonEntity } from './Entity/CannonEntity';
import { ECSFactory } from './ECSFactory';
import { NavSystem } from './System/NavSystem';
import { Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ECSWorld')
export class ECSWorld extends Component {
    private static _instance:ECSWorld=null;

    private monsters:MonsterEntity[]=[];
    private cannons:CannonEntity[]=[];

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

    public destroyEntity(entity:MonsterEntity|CannonEntity){
        if(entity instanceof MonsterEntity){
            let index=this.monsters.indexOf(entity);
            if(index>=0){
                this.monsters.splice(index,1);
            }
        }else if(entity instanceof CannonEntity){
            let index=this.cannons.indexOf(entity);
            if(index>=0){
                this.cannons.splice(index,1);
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

    private navMonster(deltaTime: number){
        for (let i = 0; i < this.monsters.length; i++) {
            NavSystem.update(this.monsters[i].baseCompnent,this.monsters[i].navCompnent,deltaTime);
        }
    }

    update(deltaTime: number) {
        this.navMonster(deltaTime);
    }
}

