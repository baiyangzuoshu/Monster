import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

import { UIComponent } from '../../../Framework/Scripts/UI/UIComponent';
import { TaskItem } from '../../../script/gameUI/taskItem';
import { g_taskData } from '../../../script/data/taskData';
import { ResManager } from '../../../Framework/Scripts/Managers/ResManager';
import { Prefab } from 'cc';
import { BundleName, GUI } from '../Constants';
import { instantiate } from 'cc';
import { UIManager } from '../../../Framework/Scripts/Managers/UIManager';
import { UITaskItem } from './item/UITaskItem';

@ccclass('UITaskUICtrl')
export class UITaskUICtrl extends UIComponent {
    private m_item: UITaskItem[] = [];
    private m_selectId: number = 0;
    private m_content:Node=null;

    onLoad() {
        this.m_item = [];
        this.m_selectId = 0;
        this.m_content=this.ViewNode("ui_win_inRect/scrollView/view/content");
        this.AddButtonListener("ui_win_rect/btnClose",this,()=>{
            UIManager.Instance.DestroyUIView(GUI.UITask);
        });
        this.updateData();
    }

    async updateData() {
        for (let i = 0; i < this.m_item.length; i++) {
            this.m_item[i].node.active = false;
        }

        const data = g_taskData.getData();
        for (let i = 0; i < data.length; i++) {
            if (data[i].taskType != this.m_selectId) {
                continue;
            }
            if (this.m_item[i] == null) {
                this.m_item[i] = await this.createItem(i);
            }
            this.m_item[i].node.active = true;
            this.m_item[i].updateItem();
        }
    }

    async createItem(taskID: number) :Promise<UITaskItem>{
        let itemPrefab=await ResManager.Instance.IE_GetAsset(BundleName.Prefabs,"taskItem",Prefab) as Prefab;
        let item = instantiate(itemPrefab);
        this.m_content.addChild(item);
        item.active = true;
        
        let ts = item.addComponent(UITaskItem);
        ts.setTaskID(taskID);
        return ts;
    }

    onChangeClick(target: Node, data: string) {
        this.m_selectId = parseInt(data);
        this.updateData();
    }
}
