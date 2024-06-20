import { _decorator, Component, Node, ScrollView, Label, instantiate, v2, sequence, scaleTo, spawn, moveBy, delayTime, callFunc } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MapView')
export class MapView extends Component {

    @property(ScrollView)
    m_scrollView: ScrollView = null;

    @property(Node)
    m_onNode: Node = null;

    @property(Node)
    m_pointNode: Node = null;

    @property(Node)
    m_point: Node = null;

    @property(Node)
    m_curPoint: Node = null;

    @property(Node)
    m_bossView: Node = null;

    @property(Node)
    m_bg: Node = null;

    @property(Label)
    m_labGold: Label = null;

    @property(Label)
    m_labDiamond: Label = null;

    private m_pointData: Array<{ x: number, y: number }> = [];
    private m_curtPos: { x: number, y: number } = { x: 0, y: 0 };

    onLoad() {
        this.m_pointNode.zIndex = 1000;
    }

    updatePoint() {
        while (this.m_pointNode.children.length) {
            const point = this.m_pointNode.children[0];
            point.removeFromParent();
            point.destroy();
        }
        for (let i = 0; i < this.m_pointData.length; i++) {
            const pos = this.m_pointData[i];
            const node = instantiate(this.m_point);
            this.m_pointNode.addChild(node);
            node.active = true;
            node.setPosition(pos.x, pos.y);
        }
        const node = instantiate(this.m_curPoint);
        this.m_pointNode.addChild(node);
        node.active = true;
        node.setPosition(this.m_curtPos.x, this.m_curtPos.y);
        this.curPointRunAction(node);
    }

    curPointRunAction(node: Node) {
        const seq = sequence(
            scaleTo(0.1, 1.2, 0.8),
            spawn(
                moveBy(0.2, v2(0, 30)),
                scaleTo(0.2, 1, 1),
            ),
            spawn(
                moveBy(0.2, v2(0, -30)),
                scaleTo(0.2, 1.2, 0.8),
            ),
            scaleTo(0.1, 1, 1),
        );

        node.runAction(seq.repeatForever());
    }

    start() {
        // Initialization code here
    }

    onClickDel() {
        this.m_pointData.pop();
        this.updatePoint();
    }

    onOut() {
        const obj = [];
        for (let i = 0; i < this.m_pointData.length; i++) {
            const pos = this.m_pointData[i];
            obj.push({ x: Math.floor(pos.x), y: Math.floor(pos.y) });
        }
        console.log(JSON.stringify(obj));
    }

    show() {
        this.m_bg.active = true;
        this.m_bossView.active = false;
        this.node.active = true;

        this.m_pointData = [];
        const checkPoint = g_dataManager.getCheckPoint();
        this.m_curtPos = g_GlobalData.checkPointNodePos[0];

        if (checkPoint.big > 1) {
            for (let i = 0; i < checkPoint.big; i++) {
                const pos = g_GlobalData.checkPointNodePos[i];
                this.m_pointData.push(pos);
            }
        }
        this.m_curtPos = g_GlobalData.checkPointNodePos[checkPoint.big];
        this.updatePoint();

        let value = this.m_curtPos.x - 640 / 2;
        if (value < 0) {
            value = 0;
        }
        const pre = value / this.m_onNode.width;
        this.m_scrollView.scrollTo(pre);
    }

    hide() {
        this.node.active = false;
    }

    onClickBG() {
        this.hide();
    }

    showBossView() {
        this.show();
        this.m_bossView.active = true;
        this.m_bg.active = false;
    }

    hideBossView() {
        this.hide();
        this.m_bossView.active = false;
    }

    goldFlyEnd(gold: number) {
        g_dataManager.addGold(gold);
        g_gameUI.updateGameUI();
    }

    diamondFlyEnd(diamond: number) {
        g_dataManager.addDiamond(diamond);
        g_gameUI.updateGameUI();
    }

    showSucceed(gold: number, diamond: number) {
        this.m_labGold.string = '' + numberToString(gold);
        this.m_labDiamond.string = '' + numberToString(diamond);

        this.showBossView();
        const count = 50;
        const createFly = () => {
            if (gold > 0) {
                const addGold = Math.floor(gold / count);
                g_coinFly.createCoinToTip(this.m_labGold.node, this.goldFlyEnd.bind(this), addGold);
            }
            if (diamond > 0) {
                const addDiamond = Math.floor(diamond / count);
                g_diamondFly.createDiamondToTip(this.m_labDiamond.node, this.diamondFlyEnd.bind(this), addDiamond);
            }
        }
        const actionList = [];
        actionList.push(delayTime(1));
        for (let i = 0; i < count; i++) {
            actionList.push(delayTime(0.01));
            actionList.push(callFunc(createFly.bind(this)));
        }
        actionList.push(callFunc(() => {
            g_dataManager.setGold(gold);
            g_dataManager.setDiamond(diamond);
            g_gameUI.updateGameUI();
        }));
        this.node.runAction(sequence(...actionList));
    }
}
