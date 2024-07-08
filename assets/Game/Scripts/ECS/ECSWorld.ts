import { _decorator, Component, Node } from 'cc';
import { MonsterEntity } from './Entity/MonsterEntity';
import { CannonEntity } from './Entity/CannonEntity';
import { ECSFactory } from './ECSFactory';
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

    public async createMonster():Promise<MonsterEntity>{
        let entity=await ECSFactory.createMonster();
        this.monsters.push(entity);
        return entity;
    }

    public createCannon():CannonEntity{
        let entity=ECSFactory.createCannon();
        this.cannons.push(entity);
        return entity;
    }

    update(deltaTime: number) {
        console.log('update ECSWorld');
    }
}

