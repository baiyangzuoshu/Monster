// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { ResManagerPro } from "../../FrameWork/manager/ResManagerPro";
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
    }

    private monsterNode:cc.Node=null;
    private entityID:number=0;

    public async createMonsterEntity(type,index,list,hp,gold,speed){
        let entity=new MonsterEntity();

        let _pathPos = [];
        for (let i = 0; i < list.length; i++) {
            var x = list[i].x*106 + 106/2;
            var y = -list[i].y*106 - 106/2 -35;
            _pathPos.push(cc.v2(x,y));
        }

        entity.baseComponent.entityID=this.entityID++;
        let monsterPrefab=await ResManagerPro.Instance.IE_GetAsset("prefabs","monster/msItem",cc.Prefab) as cc.Prefab;
        let node=cc.instantiate(monsterPrefab);
        entity.baseComponent.gameObject=node;
        this.monsterNode.addChild(node);
        node.x=_pathPos[0].x;
        node.y=_pathPos[0].y;

        entity.transformComponent.x=_pathPos[0].x;
        entity.transformComponent.y=_pathPos[0].y;

        entity.navComponent.pathList=_pathPos;
        entity.navComponent.speed=speed;

        entity.unitComponent.hp=hp;
        entity.unitComponent.gold=gold;
        

        return entity;
    }
}
