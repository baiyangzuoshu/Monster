// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { UIManagerPro } from "../../FrameWork/manager/UIManagerPro";
import { UIControl } from "../../FrameWork/ui/UIControl";
import TaskDataManager from "../data/TaskDataManager";
import TaskItemControl from "./TaskItemControl";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TaskUIControl extends UIControl {
    m_item:Array<any> = [];
    m_selectId:number = 0;
    m_content:cc.Node=null;
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        super.onLoad();
        this.m_content=this.getChildByUrl("ui_win_inRect/scrollView/view/content");
        this.buttonAddClickEvent("ui_win_rect/colse",this.clickBtnEvent,this);

       
        this.updateData();
    }
    async updateData(){
        for (let i = 0; i < this.m_item.length; i++) {
            this.m_item[i].node.active = false;
        }
        var data = TaskDataManager.getInstance().getData();
        for (let i = 0; i < data.length; i++) {
            if(data[i].taskType != this.m_selectId){
                continue;
            }
            if(this.m_item[i] == null ){
                this.m_item[i] = await this.createItem(i);
            }
            this.m_item[i].node.active = true;
            this.m_item[i].updateItem();
        }
    }

    async createItem(taskID){
        let taskPrefab=await UIManagerPro.getInstance().createOnlyPrefab("TaskItem");
        var item = cc.instantiate(taskPrefab);
        this.m_content.addChild(item);
        item.active = true;
        let ts = item.addComponent(TaskItemControl);
        ts.setTaskID(taskID);
        return ts;
    }

    onChangeClick(tagert,data){
        this.m_selectId = parseInt(data);
        this.updateData();
    }

    clickBtnEvent(btn:cc.Button){
        if("colse<Button>"==btn.name){
            UIManagerPro.getInstance().closePrefab("TaskUI");
        }
    }

    start () {

    }

    // update (dt) {}
}


