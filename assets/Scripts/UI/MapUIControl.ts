// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { EventManager } from "../../FrameWork/manager/EventManager";
import { UIControl } from "../../FrameWork/ui/UIControl";
import DataManager from "../data/DataManager";
import { GameUI } from "../EventName";
import PlayerDataManager from "../Manager/PlayerDataManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MapUIControl extends UIControl {

    m_scrollView:cc.ScrollView=null;
    m_onNode:cc.Node=null;
    m_pointNode:cc.Node=null;
    m_point:cc.Node=null;
    m_curPoint:cc.Node=null;
    m_bossView:cc.Node=null;
    m_bg:cc.Node=null;

    m_labGold:cc.Label=null;
    m_labDiamond:cc.Label=null;

    m_pointData=[];
    m_curtPos:any=null;
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        super.onLoad();

        this.m_scrollView=this.getChildByUrl("map").getComponent(cc.ScrollView);
        this.m_onNode=this.getChildByUrl("map/view/content");
        this.m_pointNode=this.getChildByUrl("map/view/content/map_0");
        this.m_point=this.getChildByUrl("map/view/ui_map_img_2");
        this.m_curPoint=this.getChildByUrl("map/view/ui_map_location");
        this.m_bossView=this.getChildByUrl("bossNode");
        this.m_bg=this.getChildByUrl("bg");
        this.m_labGold=this.getChildByUrl("bossNode/gold/lab_gold").getComponent(cc.Label);
        this.m_labDiamond=this.getChildByUrl("bossNode/diamond/lab_diamond").getComponent(cc.Label);

        this.m_pointNode.zIndex = 1000;
    }

    updatePoint(){
        while(this.m_pointNode.children.length){
            var point = this.m_pointNode.children[0];
            point.removeFromParent();
            point.destroy();
        }
        for (let i = 0; i < this.m_pointData.length; i++) {
            var pos = this.m_pointData[i];    
            var node = cc.instantiate(this.m_point);
            this.m_pointNode.addChild(node);
            node.active = true;
            node.setPosition(pos);
        }
        var node = cc.instantiate(this.m_curPoint);
        this.m_pointNode.addChild(node);
        node.active = true;
        node.setPosition(this.m_curtPos);
        this.curPointRunAction(node);
    }

    curPointRunAction(node){
        var seq = cc.sequence(
            cc.scaleTo(0.1,1.2,0.8),
            cc.spawn(
                cc.moveBy(0.2,cc.v2(0,30)),
                cc.scaleTo(0.2,1,1),
            ),
            cc.spawn(
                cc.moveBy(0.2,cc.v2(0,-30)),
                cc.scaleTo(0.2,1.2,0.8),
            ),
            cc.scaleTo(0.1,1,1),
        );

        node.runAction(cc.repeatForever(seq));
    }

    start () {
        this.show();
    }

    onClickDel(){
        this.m_pointData.pop();
        this.updatePoint();
    }

    onOut(){
        var obj =[];
        for( var i = 0;i < this.m_pointData.length;i++){
            var pos=cc.v2();
            pos.x = Math.floor(this.m_pointData[i].x) ;
            pos.y = Math.floor(this.m_pointData[i].y) ;
            obj.push(pos);
        }
        cc.log(JSON.stringify(obj));
    }

    show(){
        this.m_bg.active = true;
        this.m_bossView.active = false;
        this.node.active = true;

        this.m_pointData = [];
        var checkPoint = PlayerDataManager.getInstance().getCheckPoint();
        this.m_curtPos = DataManager.getInstance().checkPointNodePos[0];

        if( checkPoint.big > 1 ){
            for (let i = 0; i < checkPoint.big; i++) {
                var pos = DataManager.getInstance().checkPointNodePos[i];
                this.m_pointData.push(pos);
            }
        }
        this.m_curtPos = DataManager.getInstance().checkPointNodePos[checkPoint.big];
        this.updatePoint();

        var value = this.m_curtPos.x - 640/2;
        if( value < 0 ){
            value = 0;
        }
        var pre = value / this.m_onNode.width;
        this.m_scrollView.scrollToPercentVertical(pre);
    }

    hide(){
        this.node.active = false;
    }

    onClickBG(){
        this.hide();
    }

    showBossView(){
        this.show();
        this.m_bossView.active = true;
        this.m_bg.active = false;
    }

    hideBossView(){
        this.hide();
        this.m_bossView.active = false;
    }

    goldFlyEnd(gold){
        PlayerDataManager.getInstance().addGold(gold);
        EventManager.getInstance().emit(GameUI.updateGameUI);
    }

    diamondFlyEnd(diamond){
        PlayerDataManager.getInstance().addDiamond(diamond);
        EventManager.getInstance().emit(GameUI.updateGameUI);
    }

    showSucceed(gold:number,diamond:number){
        this.m_labGold.string = ''+gold.toString();
        this.m_labDiamond.string = ''+diamond.toString();

        this.showBossView();
        var count = 50;
        var createFly = function(){
            if( gold > 0 ){
                var addGold = Math.floor(gold/count) ;
                //g_coinFly.createCoinToTip(this.m_labGold.node,this.goldFlyEnd.bind(this),addGold);
            }
            if( diamond > 0 ){
                var addDiamond = Math.floor(diamond/count) ;
                //g_diamondFly.createDiamondToTip(this.m_labDiamond.node,this.diamondFlyEnd.bind(this),addDiamond);
            }
        }
        var actionList=[]
        actionList.push(cc.delayTime(1));
        for (let i = 0; i < count; i++) {
            actionList.push(cc.delayTime(0.01));
            actionList.push(cc.callFunc(createFly.bind(this)));
        }
        actionList.push(cc.callFunc(function(){
            PlayerDataManager.getInstance().setGold(gold);
            PlayerDataManager.getInstance().setDiamond(diamond);
            EventManager.getInstance().emit(GameUI.updateGameUI);
        }.bind(this)))
        this.node.runAction(cc.sequence(actionList));
        this.m_labGold.string = gold+"";
    }
}
