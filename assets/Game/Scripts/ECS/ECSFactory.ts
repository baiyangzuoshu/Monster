import { CannonEntity } from "./Entity/CannonEntity";
import { MonsterEntity } from "./Entity/MonsterEntity";

export class ECSFactory  {
    private static entityID:number=0;

    public static createMonster():MonsterEntity{
        let entity=new MonsterEntity();
        entity.baseCompnent.id=this.entityID++;
        return entity;
    }

    public static createCannon():CannonEntity{
        let entity=new CannonEntity();
        entity.baseCompnent.id=this.entityID++;
        return entity;
    }
}

