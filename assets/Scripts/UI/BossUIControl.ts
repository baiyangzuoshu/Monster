// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { ResManagerPro } from "../../FrameWork/manager/ResManagerPro";
import { UIControl } from "../../FrameWork/ui/UIControl";
import DataManager from "../data/DataManager";
import PlayerDataManager from "../Manager/PlayerDataManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BossUIControl extends UIControl {
    m_labLevel:cc.Label=null;
    m_bossName:cc.Label=null;
    m_bossSprite:cc.Sprite=null;
    m_anim:cc.Animation=null;
    m_callBack:Function=null;
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        super.onLoad();
        this.m_anim = this.node.getComponent(cc.Animation);
        this.m_labLevel=this.getChildByUrl("labLevel").getComponent(cc.Label);
        this.m_bossName=this.getChildByUrl("bossName").getComponent(cc.Label);
        this.m_bossSprite=this.getChildByUrl("bossSprite").getComponent(cc.Sprite);

    }

    async play(callFunc){
        //设置关卡
        var checkPoint = PlayerDataManager.getInstance().getCheckPoint();
        this.m_labLevel.string = ''+(checkPoint.big+1);
        this.m_labLevel.string += '-';
        this.m_labLevel.string += (checkPoint.small+1);
        
        var id = 0;
        var monster = DataManager.getInstance().getCurMonsterData();
        for (let i = 0; i < monster.length; i++) {
            if( monster[i].type == 2 ){
                id = monster[i].id;
                break;
            }
            
        }
        var name = DataManager.getInstance().getBossNameByID(id);
        this.m_bossName.string = name;
        let m_bossAtlas=await ResManagerPro.Instance.IE_GetAsset("texture","monster/monster_2",cc.SpriteAtlas) as cc.SpriteAtlas;
        var frame = m_bossAtlas.getSpriteFrame(id.toString());
        this.m_bossSprite.spriteFrame = frame;
        this.node.active = true;
        this.m_anim.play('bossView');
        this.m_callBack = callFunc;
    }

    end(){
        this.node.active = false;

        if( this.m_callBack != null ){
            this.m_callBack();
        }
    }
}
