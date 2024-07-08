import { find ,Node} from "cc";
import { CannonEntity } from "./Entity/CannonEntity";
import { MonsterEntity } from "./Entity/MonsterEntity";
import { ResManager } from "../../../Framework/Scripts/Managers/ResManager";
import { BundleName, GUI } from "../Constants";
import { Prefab } from "cc";
import { instantiate } from "cc";

export class ECSFactory  {
    private static entityID:number=0;
    private static entityLayer:Node=null;

    public static init(){
        this.entityLayer=find("Canvas/EntityLayer");
        console.log("ECSFactory init",this.entityLayer);
    }

    public static async createMonster():Promise<MonsterEntity>{
        let entity=new MonsterEntity();

        let monsterPrefab=await ResManager.Instance.IE_GetAsset(BundleName.Role,"Monster",Prefab) as Prefab;
        let monster=instantiate(monsterPrefab);
        this.entityLayer.addChild(monster);

        entity.baseCompnent.id=this.entityID++;
        entity.baseCompnent.gameObject=monster;

        entity.transformComponent.x=0;
        entity.transformComponent.y=0;


        return entity;
    }

    public static createCannon():CannonEntity{
        let entity=new CannonEntity();
        entity.baseCompnent.id=this.entityID++;
        return entity;
    }
}

