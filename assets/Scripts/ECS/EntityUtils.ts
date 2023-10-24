// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { ResManagerPro } from "../../FrameWork/manager/ResManagerPro";
import { util } from "../../FrameWork/Utils/util";
import DataManager from "../data/DataManager";
import AttackComponent from "./Components/AttackComponent";
import BaseComponent from "./Components/BaseComponent";
import RoleComponent from "./Components/RoleComponent";

const {ccclass, property} = cc._decorator;

@ccclass
export default class EntityUtils extends cc.Component {

    private static _instance:EntityUtils=null
    public static getInstance():EntityUtils{
        return EntityUtils._instance
    }

    onLoad () {
        if(null===EntityUtils._instance){
            EntityUtils._instance=this
        }
        else{
            this.destroy()
            return
        }
    }

    public  updateMonsterDirection(start:cc.Vec3,end:cc.Vec3,baseComponent:BaseComponent){
        if( end.x > start.x){
            baseComponent.gameObject.getChildByName("item").getChildByName("scale").getChildByName("right").active=true;
            baseComponent.gameObject.getChildByName("item").getChildByName("scale").getChildByName("left").active=false;
        }else if( end.x < start.x){
            baseComponent.gameObject.getChildByName("item").getChildByName("scale").getChildByName("right").active=false;
            baseComponent.gameObject.getChildByName("item").getChildByName("scale").getChildByName("left").active=true;
        }
    }

    public  cannonCompare(roleComponent1:RoleComponent,roleComponent2:RoleComponent){
        return roleComponent1.level==roleComponent2.level;
    }

    public  async cannonLevelUp(roleComponent:RoleComponent,baseComponent:BaseComponent,attackComponent:AttackComponent){
        roleComponent.level++;
        var level = roleComponent.level;

        var lvData = DataManager.getInstance().cannonUpLevel[level];
        var index = Math.floor(lvData.level/3);
        let name = ''+lvData.type+'_'+index;
        let padSpriteAtlas=await ResManagerPro.Instance.IE_GetAsset("texture","cannon/pad",cc.SpriteAtlas) as cc.SpriteAtlas;
        let frame = padSpriteAtlas.getSpriteFrame(name);
        baseComponent.gameObject.getChildByName("pad").getComponent(cc.Sprite).spriteFrame = frame;
        baseComponent.gameObject.getChildByName("ui_towerLevel").getChildByName("lv").getComponent(cc.Label).string = ''+(lvData.level+1);

        baseComponent.gameObject.getChildByName("gun").removeAllChildren();
        let gunPrefab=await ResManagerPro.Instance.IE_GetAsset("prefabs","gun/gun_"+lvData.type,cc.Prefab) as cc.Prefab;
        let gunNode=cc.instantiate(gunPrefab);
        baseComponent.gameObject.getChildByName("gun").addChild(gunNode);

        let angle=util.randomNum(0,360);
        baseComponent.gameObject.getChildByName("gun").angle=angle;


        roleComponent.type=lvData.type;

        attackComponent.atk=lvData.atk;
    }
}
