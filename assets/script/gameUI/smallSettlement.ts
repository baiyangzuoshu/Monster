import { _decorator, Component, Node, Label, v2, moveTo, runAction } from 'cc';
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
        const moveToAction = moveTo(0.3, v2(0, 0));
        this.node.setPosition(v2(0, 980));
        this.node.runAction(moveToAction);
    }

    hide() {
        const moveToAction = moveTo(0.3, v2(0, 980));
        this.node.setPosition(v2(0, 0));
        this.node.runAction(moveToAction);
    }

    // update(dt: number) {
    //     // Update code here
    // }
}
