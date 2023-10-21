// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { UIControl } from "../../FrameWork/ui/UIControl";
import TaskDataManager from "../data/TaskDataManager";
import PlayerDataManager from "../Manager/PlayerDataManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TaskItemControl extends UIControl {
    m_title:cc.Label=null;
    m_curLabel:cc.Label=null;
    m_progressBar:cc.ProgressBar=null;
    m_awardLabl:cc.Label=null;
    m_getButton:cc.Button=null;
    m_awardCoin:cc.Node=null;
    m_awardDiamond:cc.Node=null;
    m_taskID:number=0;
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        super.onLoad();
        this.m_title=this.getChildByUrl("item/title").getComponent(cc.Label);
        this.m_curLabel=this.getChildByUrl("item/curLabel").getComponent(cc.Label);
        this.m_progressBar=this.getChildByUrl("item/progressBar").getComponent(cc.ProgressBar);
        this.m_awardLabl=this.getChildByUrl("item/ui_win_numbg_rect/award").getComponent(cc.Label);
        this.m_getButton=this.getChildByUrl("item/get").getComponent(cc.Button);
        this.m_awardCoin=this.getChildByUrl("item/ui_win_numbg_rect/ui_coin");
        this.m_awardDiamond=this.getChildByUrl("item/ui_win_numbg_rect/ui_diamond");

        this.buttonAddClickEvent("item/get",this.onClickGet,this);
    }

    setTaskID(taskID){
        this.m_taskID = taskID;
    }

    updateItem(){
        this.m_getButton.interactable = false;
        var data = TaskDataManager.getInstance().getData();
        var taskData=TaskDataManager.getInstance().getTaskDataByID(this.m_taskID);
        if( this.m_taskID >= data.length ){
            return;
        }
        var curTaskData = PlayerDataManager.getInstance().getTaskByID(this.m_taskID);
        var title = TaskDataManager.getInstance().getTitle(this.m_taskID,curTaskData.maxIndex);
        this.m_title.string = title;

        var maxCount = TaskDataManager.getInstance().getMaxCount(this.m_taskID,curTaskData.maxIndex);
        
        if( curTaskData.curCount >= maxCount){
            curTaskData.curCount = maxCount;
            this.m_getButton.interactable = true;
        }

        var curLabel = ''+ curTaskData.curCount + '/'+maxCount;
        this.m_curLabel.string = curLabel;
        var pre = curTaskData.curCount/maxCount;
        this.m_progressBar.progress = pre;

        if( taskData.taskType == 0 ){
            this.m_awardCoin.active = true;
            this.m_awardDiamond.active = false;
        }else{
            this.m_awardCoin.active = false;
            this.m_awardDiamond.active = true;
        }

        this.m_awardLabl.string=TaskDataManager.getInstance().getAward(this.m_taskID,curTaskData.maxIndex);
    }

    goldFlyEnd(gold){
        PlayerDataManager.getInstance().addGold(gold);
        //g_gameUI.updateGameUI();
    }

    diamondFlyEnd(diamond){
        PlayerDataManager.getInstance().addDiamond(diamond);
        //g_gameUI.updateGameUI();
    }
    
    onClickGet(){
        
        var curTaskData = PlayerDataManager.getInstance().getTaskByID(this.m_taskID);
        var award =TaskDataManager.getInstance().getAward(this.m_taskID,curTaskData.maxIndex);
        var taskData=TaskDataManager.getInstance().getTaskDataByID(this.m_taskID);
        var count = 50;
        var createFly = function(){
            if( taskData.taskType == 0 ){
                var value = Math.floor(award/count) ;
                //g_coinFly.createCoinToTip(this.m_awardCoin,this.goldFlyEnd.bind(this),value,g_gameUI.m_coinFlyNode);
            }
            if( taskData.taskType == 1 ){
                var value = Math.floor(award/count) ;
                //g_diamondFly.createDiamondToTip(this.m_awardCoin,this.diamondFlyEnd.bind(this),value,g_gameUI.m_coinFlyNode);
            }
        }
        var actionList=[]
        // actionList.push(cc.delayTime(1));
        if( award < count ){
            count = award;
        }
        for (let i = 0; i < count; i++) {
            actionList.push(cc.delayTime(0.01));
            actionList.push(cc.callFunc(createFly.bind(this)));
        }
        actionList.push(cc.callFunc(function(){
            if( taskData.taskType == 0 ){
                PlayerDataManager.getInstance().setGold(award);
            }else{
                PlayerDataManager.getInstance().setDiamond(award);
            }
            //g_gameUI.updateGameUI();
        }.bind(this)))
        this.node.runAction(cc.sequence(actionList));

        PlayerDataManager.getInstance().nextTask(this.m_taskID);
        this.updateItem();
    }
}
