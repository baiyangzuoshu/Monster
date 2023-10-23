// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { UIControl } from "../../FrameWork/ui/UIControl";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SmallSettlementUIControl extends UIControl {

    m_faildNode:cc.Node=null;
    m_succeedNode:cc.Node=null;
    m_labGold:cc.Label=null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        super.onLoad();
        this.m_faildNode=this.getChildByUrl("ui_lose");
        this.m_succeedNode=this.getChildByUrl("ui_win");
        this.m_labGold=this.getChildByUrl("lab").getComponent(cc.Label);
    }

    showSucceed(gold:number){
        this.show();
        this.m_labGold.string = gold.toString();
        this.m_faildNode.active = false;
        this.m_succeedNode.active = true;
    }

    showFaild(gold:number){
        this.show();
        this.m_labGold.string = gold.toString();
        this.m_faildNode.active = true;
        this.m_succeedNode.active = false;
    }

    show(){
        var moveTo = cc.moveTo(0.3,cc.v2(0,0))
        this.node.setPosition(cc.v2(0,980))
        this.node.runAction(moveTo);
    }

    hide(){
        var moveTo = cc.moveTo(0.3,cc.v2(0,980))
        this.node.setPosition(cc.v2(0,0))
        this.node.runAction(moveTo);
    }
}
