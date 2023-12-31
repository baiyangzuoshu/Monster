// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { ResManagerPro } from "../../FrameWork/manager/ResManagerPro";
import { util } from "../../FrameWork/Utils/util";
import DataManager from "../data/DataManager";
import MapDataManager from "../Manager/MapDataManager";
import BulletEntity from "./Entities/BulletEntity";
import CannonEntity from "./Entities/CannonEntity";
import MonsterEntity from "./Entities/MonsterEntity";
import { BulletState, UnitState } from "../Enum";
import EffectEntity from "./Entities/EffectEntity";

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
        this.bulletBuild=canvas.getChildByName("Game").getChildByName("bulletBuild");
        this.effectBuild=canvas.getChildByName("Game").getChildByName("effectBuild");
    }

    private monsterNode:cc.Node=null;
    private moveCannon:cc.Node=null;
    private bulletBuild:cc.Node=null;
    private effectBuild:cc.Node=null;
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

        entity.attackComponent.hp=hp;
        entity.attackComponent.maxHp=hp;
        entity.attackComponent.gold=gold;

        entity.roleComponent.type=type;
        entity.roleComponent.index=index;

        entity.shapeComponent.width=node.width;
        entity.shapeComponent.height=node.height;

        return entity;
    }

    public async createCannonEntity(idx:number,level:number){
        let entity=new CannonEntity();

        let cannonPrefab=await ResManagerPro.Instance.IE_GetAsset("prefabs","cannon",cc.Prefab) as cc.Prefab;
        let node=cc.instantiate(cannonPrefab);
        entity.baseComponent.gameObject=node;
        this.moveCannon.addChild(node);

        var lvData = DataManager.getInstance().cannonUpLevel[level];
        
        let gunPrefab=await ResManagerPro.Instance.IE_GetAsset("prefabs","gun/gun_"+lvData.type,cc.Prefab) as cc.Prefab;
        let gunNode=cc.instantiate(gunPrefab);
        node.getChildByName("gun").addChild(gunNode);

        let angle=util.randomNum(0,360);
        node.getChildByName("gun").angle=angle;

        var index = Math.floor(lvData.level/3);
        let name = ''+lvData.type+'_'+index;
        let padSpriteAtlas=await ResManagerPro.Instance.IE_GetAsset("texture","cannon/pad",cc.SpriteAtlas) as cc.SpriteAtlas;
        let frame = padSpriteAtlas.getSpriteFrame(name);
        node.getChildByName("pad").getComponent(cc.Sprite).spriteFrame = frame;
        node.getChildByName("ui_towerLevel").getChildByName("lv").getComponent(cc.Label).string = ''+(lvData.level+1);

        var startPos = cc.v2(317,-952);
        node.setPosition(startPos);
        var _cannonList = MapDataManager.getInstance().getCurCannonPoint();
        var pos = _cannonList[idx];
        var x = pos.x*106 + 106/2;
        var y = -pos.y*106 - 106/2;
        var endPos = cc.v2(x,y);

        var moveTo = cc.moveTo(0.5,endPos);
        var scaleTo1 = cc.scaleTo(0.2,4,4);
        var delta = cc.delayTime(0.2);
        var scaleTo2 = cc.scaleTo(0.1,1,1);
        var seq = cc.sequence(scaleTo1,delta,scaleTo2,cc.callFunc(function(){
            entity.unitComponent.state = UnitState.Active;
        }.bind(this)));
        var sp = cc.spawn(moveTo,seq);
        node.runAction(sp);

        entity.baseComponent.entityID=ECSFactory.entityID++;

        entity.transformComponent.x=x
        entity.transformComponent.y=y

        entity.unitComponent.angle=angle;
        entity.unitComponent.state = UnitState.None;

        entity.roleComponent.level=level;
        entity.roleComponent.type=lvData.type;

        entity.attackComponent.atk=lvData.atk;

        return entity
    }

    public async createBulletEntity(level:number,worldPos:cc.Vec3,attackEntity:MonsterEntity,angle:number){
        let entity=new BulletEntity();

        var lvData = DataManager.getInstance().cannonUpLevel[level];
        
        let bulletPrefab=await ResManagerPro.Instance.IE_GetAsset("prefabs","bullet/bullet_"+lvData.type,cc.Prefab) as cc.Prefab;
        let bulletNode=cc.instantiate(bulletPrefab);
        this.bulletBuild.addChild(bulletNode);
        let nodePos=this.bulletBuild.convertToNodeSpaceAR(worldPos);
        bulletNode.setPosition(nodePos);
        bulletNode.angle=angle;
        if(2==lvData.type){
            bulletNode.getChildByName("bullet").angle = util.getAngle(nodePos, attackEntity.baseComponent.gameObject.getPosition());
        }

        entity.baseComponent.entityID=ECSFactory.entityID++;
        entity.baseComponent.gameObject=bulletNode;

        entity.transformComponent.x=nodePos.x;
        entity.transformComponent.y=nodePos.y;

        entity.unitComponent.monsterID=attackEntity.baseComponent.entityID;

        entity.shapeComponent.width=bulletNode.width;
        entity.shapeComponent.height=bulletNode.height;

        entity.roleComponent.type=lvData.type;

        entity.attackComponent.atk=lvData.atk;

        entity.animateComponent.state=BulletState.Effect;
        entity.animateComponent.playActionTime=0.25;

        return entity;
    }

    public async createEffectEntity(worldPos:cc.Vec3){
        let entity=new EffectEntity();

        let effectPrefab=await ResManagerPro.Instance.IE_GetAsset("prefabs","deadEffect",cc.Prefab) as cc.Prefab;
        let effectNode=cc.instantiate(effectPrefab);
        this.effectBuild.addChild(effectNode);
        let nodePos=this.effectBuild.convertToNodeSpaceAR(worldPos);
        effectNode.setPosition(nodePos);

        entity.baseComponent.entityID=ECSFactory.entityID++;
        entity.baseComponent.gameObject=effectNode;

        entity.transformComponent.x=nodePos.x;
        entity.transformComponent.y=nodePos.y;

        entity.animateComponent.playActionTime=1.5;

        return entity;
    }
}
