// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { EventManager } from "../../FrameWork/manager/EventManager";
import { GameStateType } from "../Enum";
import { GameUI } from "../EventName";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PlayerDataManager extends cc.Component {

    private static _instance:PlayerDataManager=null
    public static getInstance():PlayerDataManager{
        return PlayerDataManager._instance
    }

    onLoad () {
        if(null===PlayerDataManager._instance){
            PlayerDataManager._instance=this
        }
        else{
            this.destroy()
            return
        }
    }

    private userData:any = null;
    private gameState:GameStateType=GameStateType.None;
    public  bufferState=[];
    
    set gameStateType(value:GameStateType){
        this.gameState=value
    }
    get gameStateType():GameStateType{
        return this.gameState
    }

    save(){
        var str = JSON.stringify(this.userData);
        cc.sys.localStorage.setItem('userData',str );
    }
    load(){
        var str = cc.sys.localStorage.getItem('userData');
        if( str == null || str == '' ){
            this.userData = {}
            return;
        }
        this.userData = JSON.parse(str);
    }
    del(){
        cc.sys.localStorage.removeItem('userData');
    }

    getGold(){
        if( this.userData.gold == null ){
            this.userData.gold = 0;
        }
        return this.userData.gold;
    }
    setGold(gold){
        this.userData.gold = gold;
        this.save();
    }
    subGold(subNum){
        if( this.userData.gold == null ){
            this.userData.gold = 0;
        }
        this.userData.gold -= subNum;
        this.save();

        EventManager.getInstance().emit(GameUI.refreshGoldDiamond);
    }
    addGold(addNum){
        if( this.userData.gold == null ){
            this.userData.gold = 0;
        }
        this.userData.gold += addNum;
        this.save();
    
        EventManager.getInstance().emit(GameUI.refreshGoldDiamond);
    }
    getDiamond(){
        if( this.userData.diamond == null ){
            this.userData.diamond = 30;
        }
        return this.userData.diamond;
    }
    setDiamond(diamond){
        this.userData.diamond = diamond;
        this.save();
    }
    subDiamond(subNum){
        if( this.userData.diamond == null ){
            this.userData.diamond = 0;
        }
        this.userData.diamond -= subNum;
        this.save();

        EventManager.getInstance().emit(GameUI.refreshGoldDiamond);
    }
    addDiamond(addNum){
        if( this.userData.diamond == null ){
            this.userData.diamond = 0;
        }
        this.userData.diamond += addNum;
        this.save();

        EventManager.getInstance().emit(GameUI.refreshGoldDiamond);
    }
    //大关卡
    getBigCheckPointCount(){

        if( this.userData.bigCheckPointCount == null ){
            this.userData.bigCheckPointCount = 0;
        }
        return this.userData.bigCheckPointCount;
    }
    setBigCheckPointCount(big){
        this.userData.bigCheckPointCount = big;
    }
    addBigCheckPointCount(){
        if( this.userData.bigCheckPointCount == null ){
            this.userData.bigCheckPointCount = 0;
        }
        this.save();
        return this.userData.bigCheckPointCount++;
    }
    subBigCheckPointCount(){

        if( this.userData.bigCheckPointCount == null ){
            this.userData.bigCheckPointCount = 0;
        }
        if(this.userData.bigCheckPointCount == 0 ){
            return 0;
        }
        this.save();
        return this.userData.bigCheckPointCount--;
    }

    //小关卡
    getSmallCheckPointCount(){

        if( this.userData.smallCheckPointCount == null ){
            this.userData.smallCheckPointCount = 0;
        }
        return this.userData.smallCheckPointCount;
    }
    setSmallCheckPointCount(small){
        this.userData.smallCheckPointCount = small;
    }
    addSmallCheckPointCount(){
        if( this.userData.smallCheckPointCount == null ){
            this.userData.smallCheckPointCount = 0;
        }
        this.save();
        return this.userData.smallCheckPointCount++;
    }
    subSmallCheckPointCount(){
        if( this.userData.smallCheckPointCount == null ){
            this.userData.smallCheckPointCount = 0;
        }
        if(this.userData.smallCheckPointCount == 0 ){
            return 0;
        }
        this.save();
        return this.userData.bigCheckPointCount--;
    }
    getCheckPoint(){
        var checkPoint :any= {}
        checkPoint.big = this.getBigCheckPointCount();
        checkPoint.small = this.getSmallCheckPointCount();
        // checkPoint.big = 10;
        return checkPoint;
    }
    getTaskByID=function(taskID){
        if(this.userData.taskData == null){
            this.userData.taskData = []
        }
        if( this.userData.taskData[taskID] == null ){
            this.userData.taskData[taskID]={}
        }
        if( this.userData.taskData[taskID].curCount == null){
            this.userData.taskData[taskID].curCount = 0;
        }
        
        if( this.userData.taskData[taskID].maxIndex == null){
            this.userData.taskData[taskID].maxIndex = 0;
        }
        return this.userData.taskData[taskID];
    }
    addTaskCount(taskID){
        var item = this.getTaskByID(taskID);
        if( item == null ){
            return false;
        }
        this.userData.taskData[taskID].curCount++;
        this.save();
        return this.userData.taskData[taskID].curCount;
    }
    nextTask(taskID){
        var item = this.getTaskByID(taskID);
        if( item == null ){
            return false;
        }
        this.userData.taskData[taskID].curCount = 0;
        this.userData.taskData[taskID].maxIndex++;
        this.save();
        return this.userData.taskData[taskID].curCount;

    }
    //强化
    getInternsifLevel=function(ID){
        if(this.userData.internsifLevel == null){
            this.userData.internsifLevel = [];
        }
        if(this.userData.internsifLevel[ID] == null){
            this.userData.internsifLevel[ID] = 0;
        }

        
        return this.userData.internsifLevel[ID];
    }
    addInternsifLevel(ID){
        if(this.userData.internsifLevel == null){
            this.userData.internsifLevel = [];
        }
        if(this.userData.internsifLevel[ID] == null){
            this.userData.internsifLevel[ID] = 0;
        }

        this.userData.internsifLevel[ID]++;
        this.save();
        return this.userData.internsifLevel[ID];
    }
}
