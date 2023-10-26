// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { EventManager } from "../../FrameWork/manager/EventManager";
import { ResManagerPro } from "../../FrameWork/manager/ResManagerPro";
import { UIManagerPro } from "../../FrameWork/manager/UIManagerPro";
import { UIControl } from "../../FrameWork/ui/UIControl";
import { util } from "../../FrameWork/Utils/util";
import DataManager from "../data/DataManager";
import IntensifyDataManager from "../data/IntensifyDataManager";
import ECSManager from "../ECS/ECSManager";
import CannonEntity from "../ECS/Entities/CannonEntity";
import EntityUtils from "../ECS/EntityUtils";
import { Chengjiou, GameStateType, Intensify, SkillBuffer, Task } from "../Enum";
import { GameUI } from "../EventName";
import MapDataManager from "../Manager/MapDataManager";
import PlayerDataManager from "../Manager/PlayerDataManager";
import CrownControl from "./CrownControl";

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
    private m_labGold:cc.Label=null;
    private m_diamond:cc.Label=null;
    private m_curCrown:cc.Node=null;
    private m_nextCrown:cc.Node=null;
    private crownBuild:cc.Node=null;
    private m_destroyNode:cc.Node=null;
    private skillNodeArray:Array<any>=[];

    onLoad () {
        super.onLoad();
        PlayerDataManager.getInstance().gameStateType=GameStateType.None;
        
        this.m_water=this.getChildByUrl("bottom/make/ui_build_water");
        this.m_hammer=this.getChildByUrl("bottom/make/ui_build_hammer");
        this.m_labGold=this.getChildByUrl("top/glod/btGlod/ui_coin_rect/gold").getComponent(cc.Label);
        this.m_diamond=this.getChildByUrl("top/glod/btDiamond/ui_coin_rect/diamond").getComponent(cc.Label);
        this.m_makeNumberLabel=this.getChildByUrl("bottom/make/num").getComponent(cc.Label);
        this.m_destroyNode=this.getChildByUrl("bottom/destroy");

        this.updateGameUI();
        this.refreshGoldDiamond();
        this.registerBottomBtn();
        this.registerUIEvents();
        this.registerTopBtn();
        this.loadSkillNodes();
    }

    loadSkillNodes(){
        for(let i=0;i<4;i++){
            let obj:any={}
            obj.m_lock=this.getChildByUrl("bottom/buffer/skill_coin"+i+"/ui_func_lock");
            obj.m_cd=this.getChildByUrl("bottom/buffer/skill_coin"+i+"/New Node/New Sprite(Splash)").getComponent(cc.Sprite);
            obj.m_time=this.getChildByUrl("bottom/buffer/skill_coin"+i+"/time").getComponent(cc.Label);
            obj.m_bufferType=i;
            obj.m_lock.active = false;
            obj.m_cd.node.active = false;
            obj.m_time.node.active = false;

            obj.m_timeData = 0;
            obj.m_maxTime = 60;
            this.skillNodeArray[i]=obj;
        }
    }

    registerUIEvents(){
        EventManager.getInstance().addEventListener(GameUI.refreshGoldDiamond,this.refreshGoldDiamond,this);
        EventManager.getInstance().addEventListener(GameUI.gameOver,this.gameOver,this);
        EventManager.getInstance().addEventListener(GameUI.showSucceed,this.showSucceed,this);
        EventManager.getInstance().addEventListener(GameUI.showFaild,this.showFaild,this);
        EventManager.getInstance().addEventListener(GameUI.updateGameUI,this.updateGameUI,this);
        EventManager.getInstance().addEventListener(GameUI.createHpEffect,this.createHpEffect,this);
    }

    onDestroy():void{
        EventManager.getInstance().removeEventListener(GameUI.refreshGoldDiamond,this.refreshGoldDiamond,this);
        EventManager.getInstance().removeEventListener(GameUI.gameOver,this.gameOver,this);
        EventManager.getInstance().removeEventListener(GameUI.showSucceed,this.showSucceed,this);
        EventManager.getInstance().removeEventListener(GameUI.showFaild,this.showFaild,this);
        EventManager.getInstance().removeEventListener(GameUI.updateGameUI,this.updateGameUI,this);
        EventManager.getInstance().removeEventListener(GameUI.createHpEffect,this.createHpEffect,this);
    }

    async start () {
        let canvas=cc.find("Canvas");
        this.m_moveCannonNode=this.getChildByUrl("moveCannon");
        this.crownBuild=canvas.getChildByName("Game").getChildByName("crownBuild");

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

        this.buildEndPoint();
        
        let ts=await UIManagerPro.getInstance().showPrefab("BossUI");
        ts.play(()=>{
            PlayerDataManager.getInstance().gameStateType=GameStateType.Playing;
            MapDataManager.getInstance().beginCreateMonster();
        });
    }

    gameOver(){
        this.moveToNextMap();
        this.showFaild();
    }

    async buildEndPoint(){
        var list = MapDataManager.getInstance().getCurPahtList();
        var lastPos = list[list.length-1];

        var pos = cc.v2(0,0);
        pos.x = lastPos.x * 106 + 106/2;
        pos.y = -lastPos.y * 106 - 106/2;

        if( this.m_curCrown == null ){
            let crownPrefab=await ResManagerPro.Instance.IE_GetAsset("prefabs","crown",cc.Prefab) as cc.Prefab;
            this.m_curCrown = cc.instantiate(crownPrefab);
            this.crownBuild.addChild( this.m_curCrown);
            this.m_curCrown.addComponent(CrownControl);
        }
        pos.y += 25;
        this.m_curCrown.setPosition(pos);
    }

    async setNextCrownPos(pos){
        if ( this.m_nextCrown == null ){
            let crownPrefab=await ResManagerPro.Instance.IE_GetAsset("prefabs","crown",cc.Prefab) as cc.Prefab;
            this.m_nextCrown = cc.instantiate(crownPrefab);
            this.m_nextCrown.addComponent(CrownControl);
            this.crownBuild.addChild(this.m_nextCrown);
        }
        pos.y += 25;
        this.m_nextCrown.setPosition(pos);
    }

    moveToNextMap(){
        var moveTo = cc.jumpBy(0.5,cc.v2(110*2,-110),110,1);
        var callFunc = cc.callFunc(function(){
            //this.crownBuild.setPosition(cc.v2(-320,310));
            //this.buildEndPoint();
        }.bind(this));

        this.crownBuild.runAction(cc.sequence(moveTo,callFunc));
    }

    touchStart(event){
        var pos = event.getLocation();
        let nodePos=this.m_moveCannonNode.convertToNodeSpaceAR(pos);
        this.m_selecetCannon = this.getCannonByPosition(nodePos);
        if( this.m_selecetCannon != null ){
            var cannonEntity:CannonEntity = this.m_selecetCannon.cannonEntity;
            if( cannonEntity != null){
                if( this.m_moveCannon != null ){
                    this.m_moveCannon.removeFromParent();
                    this.m_moveCannon = null;
                }
                this.m_moveCannon = cc.instantiate(cannonEntity.baseComponent.gameObject);
                this.m_moveCannonNode.addChild(this.m_moveCannon);
                this.m_moveCannon.getChildByName("range").active = true;
                this.showCannonHint(cannonEntity);
                this.setShowDestroy(true);
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
            var cannonEntity = cannon.cannonEntity as CannonEntity;
            if( cannonEntity != null){
                cannonEntity.baseComponent.gameObject.getChildByName("range").active = true;
            }else{
                this.hideCannonRange();
            }
        }
    }
    touchEnd(event){
        //this.setAllCannonOpacity();
        var pos = event.getLocation();
        let nodePos=this.m_moveCannonNode.convertToNodeSpaceAR(pos);
        var block = this.getCannonByPosition(nodePos);
        if(block != null){
            if( this.m_moveCannon != null ){
                this.changeCannon(this.m_selecetCannon,block);
            }
        }
        
        if( this.m_moveCannon != null ){
            this.m_moveCannon.removeFromParent();
            this.m_moveCannon = null;
            this.hideCannonHint();
        }
        
        this.hideCannonRange();
        this.setShowDestroy(false);

        var pos = event.getLocation();
        if( this.isInDestroy(pos)){
            // this.m_selecetCannon.cannonEntity.node.removeFromParent();
            // this.m_selecetCannon.cannonEntity.node.destroy();
            // this.m_selecetCannon.cannonEntity = null;
        }
    }
    touchCancel(event){
        //this.setAllCannonOpacity();
        if( this.m_moveCannon != null ){
            this.m_moveCannon.removeFromParent();
            this.m_moveCannon = null;
        }
                    
        this.hideCannonRange();
        this.setShowDestroy(false);

        var pos = event.getLocation();
        if( this.isInDestroy(pos)){
            // this.m_selecetCannon.cannonEntity.node.removeFromParent();
            // this.m_selecetCannon.cannonEntity.node.destroy();
            // this.m_selecetCannon.cannon = null;
        }
    }

    changeCannon(startItem,endItem){
        if( startItem.pos.x == endItem.pos.x && 
            startItem.pos.y == endItem.pos.y){
                return;
            }
        let startEntity:CannonEntity=startItem.cannonEntity;
        let endEntity:CannonEntity=endItem.cannonEntity;
        if( startEntity == null ){
            return;
        }
        //3.结束为有炮,需要合成.
        var playEffect = false;
        if( endEntity != null ){
            if( EntityUtils.getInstance().cannonCompare(startEntity.roleComponent,endEntity.roleComponent)){
                EntityUtils.getInstance().cannonLevelUp(startEntity.roleComponent,startEntity.baseComponent,startEntity.attackComponent);
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

    showCannonHint(cannon:CannonEntity){
        for (let i = 0; i < this.m_cannonList.length; i++) {
            let entity = this.m_cannonList[i].cannonEntity as CannonEntity;
            if( entity != null ){
                if( entity.roleComponent.level==cannon.roleComponent.level){
                    entity.baseComponent.gameObject.getChildByName("ui_mergeRemind").active = true;
                }
            }
            
        }
    }

    hideCannonHint(){
        for (let i = 0; i < this.m_cannonList.length; i++) {
            let entity = this.m_cannonList[i].cannonEntity as CannonEntity;
            if( entity != null ){
                entity.baseComponent.gameObject.getChildByName("ui_mergeRemind").active = false;
            }
        }
    }

    hideCannonRange(){
        for (let i = 0; i < this.m_cannonList.length; i++) {
            let cannonEntity = this.m_cannonList[i].cannonEntity as CannonEntity;
            if( cannonEntity != null ){
                cannonEntity.baseComponent.gameObject.getChildByName("range").active = false;
            }    
        }
    }

    setShowDestroy(bShow){
        this.m_destroyNode.active = bShow;        
    }

    isInDestroy(world_pos){
        var pos = this.m_destroyNode.convertToNodeSpaceAR(world_pos);
        if( pos.x < 50 && 
            pos.x > -50 && 
            pos.y < 50 && 
            pos.y > -50){
                return true;
            }

        return false;
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

    async showSucceed(){
        var checkPoint = DataManager.getInstance().getCurCheckPoint();
        PlayerDataManager.getInstance().addGold(checkPoint.succedGold);
        PlayerDataManager.getInstance().addDiamond(checkPoint.diamond);
        this.updateGameUI();

        if(DataManager.getInstance().isCurBossAttack()){
            let delayTime = 6;
            let view=await UIManagerPro.getInstance().showPrefab("MapUI");
            view.showSucceed(checkPoint.succedGold,checkPoint.diamond);


            this.scheduleOnce(function() {
                if(DataManager.getInstance().isCurBossAttack()){
                    UIManagerPro.getInstance().closePrefab("MapUI");
                }else{
                    UIManagerPro.getInstance().closePrefab("SmallSettlementUI");
                }

                this.updateGameUI();
                //g_game.playGame(isBoss);
            }, delayTime);
        }else{
            let delayTime = 2;
            let view=await UIManagerPro.getInstance().showPrefab("SmallSettlementUI");
            view.showSucceed(checkPoint.succedGold,checkPoint.diamond);


            this.scheduleOnce(function() {
                if(DataManager.getInstance().isCurBossAttack()){
                    UIManagerPro.getInstance().closePrefab("MapUI");
                }else{
                    UIManagerPro.getInstance().closePrefab("SmallSettlementUI");
                }

                this.updateGameUI();
                //g_game.playGame(isBoss);
            }, delayTime);
        }
    }

    async showFaild(){
        let view=await UIManagerPro.getInstance().showPrefab("SmallSettlementUI");
        if( view.active )return;

        var checkPoint = DataManager.getInstance().getCurCheckPoint();
        PlayerDataManager.getInstance().addGold(checkPoint.faildGold);
        this.updateGameUI();
        
        view.showFaild(checkPoint.faildGold);

        this.scheduleOnce(function() {
            DataManager.getInstance().previousCheckPoint();
            UIManagerPro.getInstance().closePrefab("SmallSettlementUI");
            this.updateGameUI();
            //g_game.playGame();
        }, 2);

    }

    update (dt) {
        for(let i=0;i<4;i++){
            this.updateSkill(dt,i);
        }

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

    refreshGoldDiamond(){
        var gold = PlayerDataManager.getInstance().getGold();
        var diamond = PlayerDataManager.getInstance().getDiamond();
        this.m_labGold.string = '' + gold;
        this.m_diamond.string = '' + diamond;
        //this.updateCheckPoint();
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

    registerTopBtn(){
        this.buttonAddClickEvent("top/glod/btGlod",this.clickBtnEvent,this);
        this.buttonAddClickEvent("top/glod/btDiamond",this.clickBtnEvent,this);
        this.buttonAddClickEvent("top/map",this.clickBtnEvent,this);
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
            
            let cannonEntity=await ECSManager.getInstance().createCannonEntity(index,16);
            this.m_cannonList[index].cannonEntity=cannonEntity;
        }
        else if("map<Button>"==btn.name){
            UIManagerPro.getInstance().showPrefab("MapUI");
        }
        else if("btGlod<Button>"==btn.name){
            PlayerDataManager.getInstance().addGold(100);
        }
        else if("btDiamond<Button>"==btn.name){
            PlayerDataManager.getInstance().addDiamond(100);
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
            this.onClickSkill(0);
        }
        else if("skill_coin1<Button>"==btn.name){
            this.onClickSkill(1);
        }
        else if("skill_coin2<Button>"==btn.name){
            this.onClickSkill(2);
        }
        else if("skill_coin3<Button>"==btn.name){
            this.onClickSkill(3);
        }

    }

    updateSkill(dt,i) {
        let skill=this.skillNodeArray[i];
        if( skill.m_timeData == 0 )return;
        
        if( skill.m_timeData > 0 ){
            skill.m_timeData -= dt;
        }
        if( skill.m_timeData < 0 ){
            skill.m_timeData = 0;
            skill.m_cd.node.active = false;
            skill.m_time.node.active = false;
            PlayerDataManager.getInstance().bufferState[skill.m_bufferType] = false;
                
            if( skill.m_bufferType == SkillBuffer.BUFFER_GUAIWUJIANSHU ){
                //g_monsterBuild.setAllSlow(false);
            }
            return;
        }
        skill.m_time.string = this.formatSeconds(skill.m_timeData);
        var per = skill.m_timeData/skill.m_maxTime;
        skill.m_cd.fillRange = per;
    }

    onClickSkill(i){
        let skill=this.skillNodeArray[i];
        if(skill.m_timeData > 0 )return;

        skill.m_cd.node.active = true;
        skill.m_time.node.active = true;

        skill.m_timeData = skill.m_maxTime;
        skill.m_time.string = this.formatSeconds(skill.m_timeData);

        PlayerDataManager.getInstance().bufferState[skill.m_bufferType] = true;

        if( skill.m_bufferType == SkillBuffer.BUFFER_GUAIWUJIANSHU ){
            //g_monsterBuild.setAllSlow(true);
        }
    }

    formatSeconds(value) {
        var theTime = Math.floor(value);// 秒
        var middle= 0;// 分

        if(theTime > 60) {
            middle= Math.floor(theTime/60);
            theTime = Math.floor(theTime%60);
        }

        var result = ""+theTime;
        
        if(middle > 0) 
        {
            result = ""+middle+":"+result;
        }
        else
        {
            result = "00:"+result;
        }

        return result;
    }

    createHpEffect(data){
        let worldPos=data.worldPos;
        let str=data.str;

        let canvas=cc.find("Canvas");
        let m_hpEffectItem=canvas.getChildByName("Game").getChildByName("HpEffectBuild").getChildByName("hpEffect");
        let HpEffectBuild=canvas.getChildByName("Game").getChildByName("HpEffectBuild");
        let nodePos=HpEffectBuild.convertToNodeSpaceAR(worldPos);
        var node = cc.instantiate(m_hpEffectItem);
        var label = node.getComponent(cc.Label);
        label.string = str;

        node.active = true;
        node.opacity = 255;
        node.setPosition(nodePos);
        HpEffectBuild.addChild(node);
        var left = util.randomNum(0,100) > 50;
        var moveList = [];
        moveList.push(cc.v2(0,0));
        var dir = left?1:-1;
        // if( left ){
        //     dir = 1;
        // }else{
        //     dir = -1;
        // }
        var x = util.randomNum(0,50);
        var y = util.randomNum(50,130);
        moveList.push(cc.v2(x*dir,y));

        x = util.randomNum(60,100);
        y = util.randomNum(10,40);
        moveList.push(cc.v2(x*dir,-y));

        var spline = cc.cardinalSplineBy(0.5,moveList,0);
        var seq = cc.sequence(
            cc.delayTime(0.3),
            cc.fadeTo(0.2,0),
            cc.callFunc(function(){
                 
            }.bind(this)));

        node.runAction(cc.spawn(spline,seq));
    }
}


