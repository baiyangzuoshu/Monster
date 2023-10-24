// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { EventManager } from "../../FrameWork/manager/EventManager";
import { ResManagerPro } from "../../FrameWork/manager/ResManagerPro";
import { UIControl } from "../../FrameWork/ui/UIControl";
import IntensifyDataManager from "../data/IntensifyDataManager";
import { GameUI } from "../EventName";
import PlayerDataManager from "../Manager/PlayerDataManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class IntensifyItemControl extends UIControl {

    // LIFE-CYCLE CALLBACKS:
    m_title:cc.Label=null;
    m_icon:cc.Sprite=null;
    m_lvLabel:cc.Label=null;
    m_preLabel:cc.Label=null;
    m_upLevelButton:cc.Button=null;
    m_needDiamond:cc.Label=null;
    m_ID:number=0;

    onLoad () {
        super.onLoad();
        this.m_title=this.getChildByUrl("item/title").getComponent(cc.Label);
        this.m_icon=this.getChildByUrl("item/ui_g_buildUpProb").getComponent(cc.Sprite);
        this.m_lvLabel=this.getChildByUrl("item/lv").getComponent(cc.Label);
        this.m_preLabel=this.getChildByUrl("item/value").getComponent(cc.Label);
        this.m_upLevelButton=this.getChildByUrl("item/upLevel").getComponent(cc.Button);
        this.m_needDiamond=this.getChildByUrl("item/upLevel/Background/Label").getComponent(cc.Label);

        this.buttonAddClickEvent("item/upLevel",this.onClickUp,this);
    }

    setID(ID){
        this.m_ID = ID;
    }

    setTitle(str){
        this.m_title.string = str;
    }

    onClickUp(){
        var data = IntensifyDataManager.getInstance().getIntensifyDataByID(this.m_ID);
        if( data == null )return;
        var lv = PlayerDataManager.getInstance().getInternsifLevel(this.m_ID);
        if( lv >= data['value'].length ){
            lv = data['value'].length - 1
            this.m_upLevelButton.interactable = false;
            return;
        }
        var needDiamond = IntensifyDataManager.getInstance().getDiamond(this.m_ID,lv);
        var haveDiamond = PlayerDataManager.getInstance().getDiamond();
        if( haveDiamond < needDiamond){
            this.m_upLevelButton.interactable = false;
            return;
        }

        PlayerDataManager.getInstance().subDiamond(needDiamond);
        PlayerDataManager.getInstance().addInternsifLevel(this.m_ID);
        
        EventManager.getInstance().emit(GameUI.updateGameUI);
        this.updateItem();
    }

    async updateItem(){
        this.m_upLevelButton.interactable = true;
        var data = IntensifyDataManager.getInstance().getIntensifyDataByID(this.m_ID);
        if( data == null )return;
        var title = IntensifyDataManager.getInstance().getTitle(this.m_ID,0);
        this.setTitle(title);

        var iconName = IntensifyDataManager.getInstance().getIcon(this.m_ID);
        let gameUIAtlas=await ResManagerPro.Instance.IE_GetAsset("texture","gameUI/gameUI",cc.SpriteAtlas) as cc.SpriteAtlas;
        var frame = gameUIAtlas.getSpriteFrame(iconName);
        this.m_icon.spriteFrame = frame;

        var lv = PlayerDataManager.getInstance().getInternsifLevel(this.m_ID);
        if( lv >= data['value'].length ){
            lv = data['value'].length - 1
            this.m_upLevelButton.interactable = false;
        }
        var needDiamond = IntensifyDataManager.getInstance().getDiamond(this.m_ID,lv);
        var haveDiamond = PlayerDataManager.getInstance().getDiamond();
        if( haveDiamond < needDiamond){
            this.m_upLevelButton.interactable = false;
        }
        this.m_needDiamond.string = ''+needDiamond;
        this.m_lvLabel.string = 'Lv.'+(lv+1);

        var curLv = IntensifyDataManager.getInstance().getValue(this.m_ID,lv);
        var nextLv = IntensifyDataManager.getInstance().getValue(this.m_ID,lv+1);
        
        var showPer = data['showPer'];
        var showPerString ='';
        if( showPer ){
            showPerString='%';
        }

        if( nextLv == null ){
            this.m_preLabel.string = ''+curLv+showPerString+' - MAX';
        }else{
            this.m_preLabel.string = ''+curLv+showPerString+' - '+nextLv+showPerString;
        }

    }
}
