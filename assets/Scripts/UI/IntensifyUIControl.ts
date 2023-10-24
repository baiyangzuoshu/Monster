// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { UIManagerPro } from "../../FrameWork/manager/UIManagerPro";
import { UIControl } from "../../FrameWork/ui/UIControl";
import IntensifyDataManager from "../data/IntensifyDataManager";
import IntensifyItemControl from "./IntensifyItemControl";

const {ccclass, property} = cc._decorator;

@ccclass
export default class IntensifyUIControl extends UIControl {
    private m_item:Array<any>=[];
    private m_content:cc.Node=null;
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        super.onLoad();

        this.updateData();
        this.m_content=this.getChildByUrl("ui_win_inRect/scrollView/view/content");
        this.buttonAddClickEvent("ui_win_rect/colse",this.clickBtnEvent,this);
    }

    async updateData(){
        for (let i = 0; i < this.m_item.length; i++) {
            this.m_item[i].node.active = false;
        }

        var data = IntensifyDataManager.getInstance().getData();
        for (let i = 0; i < data.length; i++) {
            if(this.m_item[i] == null){
                this.m_item[i] = await this.createItem(i);
            }
            this.m_item[i].node.active = true;
            this.m_item[i].setID(i);
            this.m_item[i].updateItem();
        }
    }
    
    async createItem(ID){
        var itemPrefab = await UIManagerPro.getInstance().createOnlyPrefab("IntensifyItem");
        let item=cc.instantiate(itemPrefab);
        this.m_content.addChild(item);
        item.active = true;
        let ts = item.addComponent(IntensifyItemControl);
        ts.setID(ID);
        return ts;
    }

    clickBtnEvent(btn:cc.Button){
        if("colse<Button>"==btn.name){
            UIManagerPro.getInstance().closePrefab("IntensifyUI");
        }
    }

    start () {

    }

    // update (dt) {}
}
