// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { UIManagerPro } from "../../FrameWork/manager/UIManagerPro";
import { UIControl } from "../../FrameWork/ui/UIControl";
import IntensifyDataManager from "../data/IntensifyDataManager";
import ECSManager from "../ECS/ECSManager";
import CannonEntitiy from "../ECS/Entities/CannonEntitiy";
import EntityUtils from "../ECS/EntityUtils";
import { Chengjiou, Intensify, Task } from "../Enum";
import MapDataManager from "../Manager/MapDataManager";
import PlayerDataManager from "../Manager/PlayerDataManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameUIControl extends UIControl {
    private m_canMakeCount:number = 10;
    private m_maxMakeCount:number = 10;
    private m_hammerAction = false;
    private m_waterAction = false;
    private m_water:cc.Node = null;
    private m_hammer:cc.Node = null;
    private m_makeNumberLabel:cc.Label = null;
    private m_cannonList = [];
    private m_curZIndex:number=0;
    private m_selecetCannon = null;
    private m_moveCannon = null;
    private m_moveCannonNode:cc.Node=null;

    onLoad () {
        super.onLoad();
        this.m_water=this.getChildByUrl("bottom/make/ui_build_water");
        this.m_hammer=this.getChildByUrl("bottom/make/ui_build_hammer");
        this.m_makeNumberLabel=this.getChildByUrl("bottom/make/num").getComponent(cc.Label);

        this.updateGameUI();

        this.registerBottomBtn();
    }

    start () {
        let canvas=cc.find("Canvas");
        this.m_moveCannonNode=canvas.getChildByName("Game").getChildByName("moveCannon");

        var _cannonList = MapDataManager.getInstance().getCurCannonPoint();
        for (let i = 0; i < _cannonList.length; i++) {
            this.m_cannonList[i] = this.createCannonData();
            this.m_cannonList[i].pos = _cannonList[i];
        }
        this.m_curZIndex = 100;
        this.m_moveCannonNode.on('touchstart',this.touchStart,this);
        this.m_moveCannonNode.on('touchmove',this.touchMove,this);
        this.m_moveCannonNode.on('touchend',this.touchEnd,this);
        this.m_moveCannonNode.on('touchcancel',this.touchCancel,this);
    }

    touchStart(event){
        var pos = event.getLocation();
        let nodePos=this.m_moveCannonNode.convertToNodeSpaceAR(pos);
        this.m_selecetCannon = this.getCannonByPosition(nodePos);
        if( this.m_selecetCannon != null ){
            var cannonEntity:CannonEntitiy = this.m_selecetCannon.cannonEntity;
            if( cannonEntity != null){
                if( this.m_moveCannon != null ){
                    this.m_moveCannon.removeFromParent();
                    this.m_moveCannon = null;
                }
                this.m_moveCannon = cc.instantiate(cannonEntity.baseComponent.gameObject);
                this.m_moveCannonNode.addChild(this.m_moveCannon);
                //var cloneCannon = this.m_moveCannon.getComponent('cannon');
                //this.showCannonRange(cannon);
                //cannon.node.opacity = 127;
                //this.showCannonHint(cannon.node._selfData.cannon);
                //g_bottomUI.setShowDestroy(true);
            }else{
                this.m_selecetCannon = null;
            }
        }
    }
    touchMove(event){
        if( this.m_moveCannon == null) 
            return;

        var delta = event.getDelta();
        var pos = this.m_moveCannon.getPosition();
        pos.x += delta.x;
        pos.y += delta.y;
        this.m_moveCannon.setPosition(pos);

        var pos = event.getLocation();
        let nodePos=this.m_moveCannonNode.convertToNodeSpaceAR(pos);
        var cannon = this.getCannonByPosition(nodePos);
        if( cannon != null ){
            var cannonEntity = cannon.cannonEntity;
            if( cannonEntity != null){
                //this.showCannonRange(cannon);
            }else{
                //this.hideCannonRange();
            }
        }
    }
    touchEnd(event){
        //this.setAllCannonOpacity();
        var pos = event.getLocation();
        let nodePos=this.m_moveCannonNode.convertToNodeSpaceAR(pos);
        var block = this.getCannonByPosition(nodePos);
        console.log(block)
        if(block != null){
            if( this.m_moveCannon != null ){
                this.changeCannon(this.m_selecetCannon,block);
            }
        }
        
        if( this.m_moveCannon != null ){
            this.m_moveCannon.removeFromParent();
            this.m_moveCannon = null;
            ///this.hideCannonHint();
        }

        
        //this.hideCannonRange();

        //g_bottomUI.setShowDestroy(false);

        var pos = event.getLocation();
        // if( g_bottomUI.isInDestroy(pos)){
        //     this.m_selecetCannon.cannonEntity.node.removeFromParent();
        //     this.m_selecetCannon.cannonEntity.node.destroy();
        //     this.m_selecetCannon.cannon = null;
        // }
    }
    touchCancel(event){
        //this.setAllCannonOpacity();
        if( this.m_moveCannon != null ){
            this.m_moveCannon.removeFromParent();
            this.m_moveCannon = null;
        }
                    
        //this.hideCannonRange();
        //g_bottomUI.setShowDestroy(false);

        var pos = event.getLocation();
        // if( g_bottomUI.isInDestroy(pos)){
        //     this.m_selecetCannon.cannonEntity.node.removeFromParent();
        //     this.m_selecetCannon.cannonEntity.node.destroy();
        //     this.m_selecetCannon.cannon = null;
        // }
    }

    changeCannon(startItem,endItem){
        if( startItem.pos.x == endItem.pos.x && 
            startItem.pos.y == endItem.pos.y){
                return;
            }
        let startEntity:CannonEntitiy=startItem.cannonEntity;
        let endEntity:CannonEntitiy=endItem.cannonEntity;
        if( startEntity == null ){
            return;
        }
        //3.结束为有炮,需要合成.
        var playEffect = false;
        if( endEntity != null ){
            if( EntityUtils.getInstance().cannonCompare(startEntity.roleComponent,endEntity.roleComponent)){
                EntityUtils.getInstance().cannonLevelUp(startEntity.roleComponent,startEntity.baseComponent);
                endEntity.unitComponent.isDead=true;
                endEntity.baseComponent.gameObject.destroy();
                endEntity = null;
                playEffect = true;
                //
                PlayerDataManager.getInstance().addTaskCount(Task.TASK_HEBING_FANGYUTA);
                PlayerDataManager.getInstance().addTaskCount(Chengjiou.CHENGJIOU_QIANGHUA_JINENG);
            }
        }

        //1.结束位置没有炮
        if( endItem == null ){
            // var a = 1;
            // a = 1;

        }
        if( endEntity == null ){
            startEntity.baseComponent.gameObject.x = endItem.pos.x * 106 + 106/2;
            startEntity.baseComponent.gameObject.y = -endItem.pos.y * 106 - 106/2;
            startEntity.transformComponent.x=startEntity.baseComponent.gameObject.x;
            startEntity.transformComponent.y=startEntity.baseComponent.gameObject.y;
            
            endItem.cannonEntity = startItem.cannonEntity;
            startItem.cannonEntity = endEntity;
            if( playEffect ){
                //endEntity.effectAction();
            }
        }else{
            
            //2.结束位置有炮,但是登陆或类型不同.
            startEntity.baseComponent.gameObject.x = endItem.pos.x * 106 + 106/2;
            startEntity.baseComponent.gameObject.y = -endItem.pos.y * 106 - 106/2;
            startEntity.transformComponent.x=startEntity.baseComponent.gameObject.x;
            startEntity.transformComponent.y=startEntity.baseComponent.gameObject.y;

            endEntity.baseComponent.gameObject.x = startItem.pos.x * 106 + 106/2;
            endEntity.baseComponent.gameObject.y = -startItem.pos.y * 106 - 106/2;
            endEntity.transformComponent.x=startEntity.baseComponent.gameObject.x;
            endEntity.transformComponent.y=startEntity.baseComponent.gameObject.y;

            endItem.cannonEntity = startItem.cannonEntity;
            startItem.cannonEntity = endEntity;
        }
    }

    createCannonData(){
        var obj:any= {};
        obj.pos = cc.v2(0,0);
        obj.cannonEntity = null;
        return obj;
    }

    getCannonByPosition(nodePos){
        let x = Math.floor(nodePos.x/106);
        let y = Math.floor((-nodePos.y)/106);
        console.log(x,y);
        for (let i = 0; i < this.m_cannonList.length; i++) {
            if(this.m_cannonList[i].pos.x == x && this.m_cannonList[i].pos.y == y){
                return this.m_cannonList[i];
            }
        }
        return null;
    }

    getCanMakeIndex(){
        for (let i = 0; i < this.m_cannonList.length; i++) {
            if(this.m_cannonList[i].cannonEntity == null ){
                return i;
            }
        }
        return null;
    }

    addMakeNumber(){
        this.m_canMakeCount++;
        if( this.m_canMakeCount > this.m_maxMakeCount ){
            this.m_canMakeCount = this.m_maxMakeCount;
        }
        this.updateMakeCount();
    }

    subMakeNumber(){
        this.m_canMakeCount--;
        if( this.m_canMakeCount < 0 ){
            this.m_canMakeCount = 0;
        }
        if( !this.m_waterAction ){
            this.m_water.height = 0;
        }
        this.updateMakeCount();
    }

    updateMakeCount(){
        this.m_makeNumberLabel.string = '' + this.m_canMakeCount + '/' + this.m_maxMakeCount;
    }

    update (dt) {
        if( this.m_canMakeCount < this.m_maxMakeCount){
            this.m_water.height += dt*50;
            this.m_waterAction = true;
            if ( this.m_water.height >= 133 ){
                this.addMakeNumber();
                if( this.m_canMakeCount == this.m_maxMakeCount){
                    this.m_water.height = 133;
                    this.m_waterAction = false;
                }else{
                    this.m_water.height = 0;
                }
            }
        }
    }

    updateGameUI(){
        if( !this.m_waterAction ){
            this.m_water.height = 0;
        }
        
        var lv = PlayerDataManager.getInstance().getInternsifLevel(Intensify.INTENSIFY_KUORONG);
        this.m_maxMakeCount = IntensifyDataManager.getInstance().getValue(Intensify.INTENSIFY_KUORONG,lv);
        this.updateMakeCount();
    }

    registerBottomBtn(){
        this.buttonAddClickEvent("bottom/make/make",this.clickBtnEvent,this);
        this.buttonAddClickEvent("bottom/make/autoMake",this.clickBtnEvent,this);
        this.buttonAddClickEvent("bottom/intensify",this.clickBtnEvent,this);
        this.buttonAddClickEvent("bottom/shop",this.clickBtnEvent,this);
        this.buttonAddClickEvent("bottom/destroy",this.clickBtnEvent,this);
        this.buttonAddClickEvent("bottom/cannon",this.clickBtnEvent,this);
        this.buttonAddClickEvent("bottom/task/bt",this.clickBtnEvent,this);
        this.buttonAddClickEvent("bottom/buffer/skill_coin0",this.clickBtnEvent,this);
        this.buttonAddClickEvent("bottom/buffer/skill_coin1",this.clickBtnEvent,this);
        this.buttonAddClickEvent("bottom/buffer/skill_coin2",this.clickBtnEvent,this);
        this.buttonAddClickEvent("bottom/buffer/skill_coin3",this.clickBtnEvent,this);
    }

    async clickBtnEvent(btn:cc.Button){
        console.log("clickBtnEvent",btn.name);
        if("make<Button>"==btn.name){
            var index = this.getCanMakeIndex();
            if( index == null ){
                return;
            }
            if( this.m_canMakeCount == 0){
                return;
            }
            if(!this.m_hammerAction ){
                var  rot1 = cc.rotateTo(0.2,-90);
                var rot2 = cc.rotateTo(0.2,0);
                var callFunc = cc.callFunc(function(){
                    this.m_hammerAction = false;
                }.bind(this));
                var seq = cc.sequence(rot1,rot2,callFunc);
                this.m_hammer.runAction(seq);

                this.m_hammerAction = true;
            }
            
            this.subMakeNumber();
            
            let cannonEntity=await ECSManager.getInstance().createCannonEntity(index,0);
            this.m_cannonList[index].cannonEntity=cannonEntity;
        }
        else if("bt<Button>"==btn.name){
            UIManagerPro.getInstance().showPrefab("TaskUI");
        }
        else if("autoMake<Button>"==btn.name){

        }
        else if("intensify<Button>"==btn.name){
            UIManagerPro.getInstance().showPrefab("IntensifyUI");
        }
        else if("shop<Button>"==btn.name){

        }
        else if("destroy<Button>"==btn.name){

        }
        else if("cannon<Button>"==btn.name){

        }
        else if("bt<Button>"==btn.name){

        }
        else if("skill_coin0<Button>"==btn.name){

        }
        else if("skill_coin1<Button>"==btn.name){

        }
        else if("skill_coin2<Button>"==btn.name){

        }
        else if("skill_coin3<Button>"==btn.name){
            
        }

    }

}


