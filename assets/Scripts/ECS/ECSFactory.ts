// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { ResManagerPro } from "../../FrameWork/manager/ResManagerPro";
import CannonEntitiy from "./Entities/CannonEntitiy";
import MonsterEntity from "./Entities/MonsterEntity";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ECSFactory extends cc.Component {

    private static _instance:ECSFactory=null
    public static getInstance():ECSFactory{
        return ECSFactory._instance
    }

    onLoad () {
        if(null===ECSFactory._instance){
            ECSFactory._instance=this
        }
        else{
            this.destroy()
            return
        }

        let canvas=cc.find("Canvas");
        this.monsterNode=canvas.getChildByName("Game").getChildByName("monsterNode");
        this.moveCannon=canvas.getChildByName("Game").getChildByName("moveCannon");
    }

    private monsterNode:cc.Node=null;
    private moveCannon:cc.Node=null;
    private static entityID:number=0;

    public async createMonsterEntity(type:number,index:number,list,hp,gold,speed){
        let entity=new MonsterEntity();

        let _pathPos = [];
        for (let i = 0; i < list.length; i++) {
            var x = list[i].x*106 + 106/2;
            var y = -list[i].y*106 - 106/2 -35;
            _pathPos.push(cc.v2(x,y));
        }

        entity.baseComponent.entityID=ECSFactory.entityID++;
        let monsterPrefab=await ResManagerPro.Instance.IE_GetAsset("prefabs","monster/msItem",cc.Prefab) as cc.Prefab;
        let node=cc.instantiate(monsterPrefab);
        entity.baseComponent.gameObject=node;
        this.monsterNode.addChild(node);

        let monsterSpriteAtlas=await ResManagerPro.Instance.IE_GetAsset("texture","monster/monster_"+type,cc.SpriteAtlas) as cc.SpriteAtlas;
        let right=entity.baseComponent.gameObject.getChildByName("item").getChildByName("scale").getChildByName("right").getComponent(cc.Sprite)
        let left=entity.baseComponent.gameObject.getChildByName("item").getChildByName("scale").getChildByName("left").getComponent(cc.Sprite)
        right.spriteFrame=monsterSpriteAtlas.getSpriteFrame(index.toString())
        left.spriteFrame=monsterSpriteAtlas.getSpriteFrame(index.toString())

        node.x=_pathPos[0].x;
        node.y=_pathPos[0].y;

        entity.transformComponent.x=_pathPos[0].x;
        entity.transformComponent.y=_pathPos[0].y;

        entity.navComponent.pathList=_pathPos;
        entity.navComponent.speed=speed;

        entity.unitComponent.hp=hp;
        entity.unitComponent.gold=gold;
        
        entity.roleComponent.type=type;
        entity.roleComponent.index=index;

        return entity;
    }

    public async createCannonEntity(index:number,level:number){
        let entity=new CannonEntitiy();

        entity.baseComponent.entityID=ECSFactory.entityID++;
        let cannonPrefab=await ResManagerPro.Instance.IE_GetAsset("prefabs","cannon",cc.Prefab) as cc.Prefab;
        let node=cc.instantiate(cannonPrefab);
        entity.baseComponent.gameObject=node;
        this.moveCannon.addChild(node);

        return entity
    }
}
