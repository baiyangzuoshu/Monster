import { Label } from 'cc';
import { UIComponent } from '../../../Framework/Scripts/UI/UIComponent';
import { _decorator, Component, Node } from 'cc';
import { numberToString } from '../../../script/utlis';
import { v3 } from 'cc';
import { tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UISettlementUICtrl')
export class UISettlementUICtrl extends UIComponent {
    m_faildNode: Node = null;
    m_succeedNode: Node = null;
    m_labGold: Label = null;

    onLoad() {
        this.m_faildNode=this.ViewNode("ui_lose");
        this.m_succeedNode=this.ViewNode("ui_win");
        this.m_labGold=this.ViewComponent("lab",Label);
    }

    showSucceed(gold: number) {
        this.show();
        this.m_labGold.string = numberToString(gold);
        this.m_faildNode.active = false;
        this.m_succeedNode.active = true;
    }

    showFaild(gold: number) {
        this.show();
        this.m_labGold.string = numberToString(gold);
        this.m_faildNode.active = true;
        this.m_succeedNode.active = false;
    }

    show() {
        this.node.setPosition(v3(0, 980));
        tween(this.node)
            .to(0.3, { position: v3(0, 0) })
            .start();
    }

    hide() {
        this.node.setPosition(v3(0, 0));
        tween(this.node)
            .to(0.3, { position: v3(0, 980) })
            .start();
    }
}

