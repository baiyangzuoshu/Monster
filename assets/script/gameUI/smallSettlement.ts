import { _decorator, Component, Node, Label, v2, tween } from 'cc';
import { numberToString } from '../utlis';
import { v3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Settlement')
export class Settlement extends Component {

    @property(Node)
    m_faildNode: Node = null;

    @property(Node)
    m_succeedNode: Node = null;

    @property(Label)
    m_labGold: Label = null;

    start() {
        // Initialization code here
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

    // update(dt: number) {
    //     // Update code here
    // }
}
