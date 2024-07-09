import { find ,Node} from "cc";
import { CannonEntity } from "./Entity/CannonEntity";
import { MonsterEntity } from "./Entity/MonsterEntity";
import { ResManager } from "../../../Framework/Scripts/Managers/ResManager";
import { BundleName, GUI } from "../Constants";
import { Prefab } from "cc";
import { instantiate } from "cc";
import { Monster } from "../Role/Monster";
import { GameManager } from "../Manager/GameManager";
import { g_GlobalData } from "../../../script/data/data";
import { Vec2 } from "cc";
import { v2 } from "cc";
import { v3 } from "cc";
import { Vec3 } from "cc";
import { Utils } from "../Utils/Utils";

export class ECSFactory  {
    private static entityID:number=0;
    private static entityLayer:Node=null;

    public static init(){
        this.entityLayer=find("Canvas/EntityLayer");
        console.log("ECSFactory init",this.entityLayer);
    }

    public static async createMonster(index:number):Promise<MonsterEntity>{
        let entity=new MonsterEntity();

        let monsterPrefab=await ResManager.Instance.IE_GetAsset(BundleName.Role,"Monster",Prefab) as Prefab;
        let monster=instantiate(monsterPrefab);
        this.entityLayer.addChild(monster);

        entity.baseCompnent.id=this.entityID++;
        entity.baseCompnent.gameObject=monster;

        const list = GameManager.instance.getCurPahtList();
        const levelData = g_GlobalData.getCurMonsterData();

        entity.navCompnent.pathList=list;

        let start:Vec3=Utils.getMonsterPosition(list[0]);
        let end:Vec3=Utils.getMonsterPosition(list[1]);
        let dir=end.subtract(start);
        let len=dir.length();

        monster.setPosition(start);

        entity.transformComponent.x=start.x;
        entity.transformComponent.y=start.y;

        entity.navCompnent.speed=levelData[index].speed;
        entity.navCompnent.pathIndex=1;
        entity.navCompnent.time=len/levelData[index].speed;
        entity.navCompnent.vx=entity.navCompnent.speed*dir.x/len;
        entity.navCompnent.vy=entity.navCompnent.speed*dir.y/len;
        

        entity.roleComponent.hp=levelData[index].hp;
        entity.roleComponent.id=levelData[index].id;
        entity.roleComponent.gold=levelData[index].gold;
        entity.roleComponent.type=levelData[index].type;


        let ts=monster.addComponent(Monster);
        await ts.init();
        ts.setImage(entity.roleComponent.type,entity.roleComponent.id);

        return entity;
    }

    public static createCannon():CannonEntity{
        let entity=new CannonEntity();
        entity.baseCompnent.id=this.entityID++;
        return entity;
    }
}

