import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

import { UIComponent } from '../../../Framework/Scripts/UI/UIComponent';
import { ResManager } from '../../../Framework/Scripts/Managers/ResManager';
import { Prefab } from 'cc';
import { BundleName, GUI } from '../Constants';
import { instantiate } from 'cc';
import { IntensifyItem } from '../../../script/gameUI/intensifyItem';
import { g_intensifyData } from '../../../script/data/intensifyData';
import { UIManager } from '../../../Framework/Scripts/Managers/UIManager';
import { UI } from 'cc';
import { UITntensifyItem } from './item/UITntensifyItem';

@ccclass('UIIntensifyUICtrl')
export class UIIntensifyUICtrl extends UIComponent {
    private m_item: UITntensifyItem[] = [];
    private m_selectId: number = 0;
    private m_content:Node=null;

    onLoad() {
        this.m_item = [];
        this.m_selectId = 0;
        this.m_content=this.ViewNode("ui_win_inRect/scrollView/view/content");
        this.AddButtonListener("ui_win_rect/btnClose",this,()=>{
            UIManager.Instance.DestroyUIView(GUI.UIIntensify);
        });
        this.updateData();
    }

    async updateData() {
        for (let i = 0; i < this.m_item.length; i++) {
            this.m_item[i].node.active = false;
        }

        const data = g_intensifyData.getData();
        for (let i = 0; i < data.length; i++) {
            if (this.m_item[i] == null) {
                this.m_item[i] = await this.createItem(i);
            }
            this.m_item[i].node.active = true;
            this.m_item[i].setID(i);
            this.m_item[i].updateItem();
        }
    }

    async createItem(taskID: number) :Promise<UITntensifyItem>{
        let itemPrefab=await ResManager.Instance.IE_GetAsset(BundleName.Prefabs,"intensifyItem",Prefab) as Prefab;
        let item = instantiate(itemPrefab);
        this.m_content.addChild(item);
        item.active = true;
        
        let ts = item.addComponent(UITntensifyItem);
        await ts.init();

        ts.setID(taskID);
        return ts;
    }

    onChangeClick(target: Node, data: string) {
        this.m_selectId = parseInt(data);
        this.updateData();
    }
}
