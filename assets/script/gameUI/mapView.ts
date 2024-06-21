import { _decorator, Component, Node, ScrollView, Label, instantiate, v2, Vec3, Vec2, tween, Tween, UITransform } from 'cc';
import { CoinFlyManager } from '../coinFly';
import { DataManager } from '../data/dataManager';
import { numberToString } from '../utlis';
import DiamondFlyManager from '../diamondFly';
import { GameUIManager } from './gameUI';
import { g_GlobalData } from '../data/data';
import { v3 } from 'cc';
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
        this.m_pointNode.setSiblingIndex(1000);
    }

    updatePoint() {
        this.m_pointNode.removeAllChildren();

        for (let i = 0; i < this.m_pointData.length; i++) {
            const pos = this.m_pointData[i];
            const node = instantiate(this.m_point);
            this.m_pointNode.addChild(node);
            node.active = true;
            node.setPosition(new Vec3(pos.x, pos.y, 0));
        }

        const node = instantiate(this.m_curPoint);
        this.m_pointNode.addChild(node);
        node.active = true;
        node.setPosition(new Vec3(this.m_curtPos.x, this.m_curtPos.y, 0));
        this.curPointRunAction(node);
    }

    curPointRunAction(node: Node) {
        const action = tween(node)
            .sequence(
                tween().to(0.1, { scale: new Vec3(1.2, 0.8, 1) }),
                tween().parallel(
                    tween().by(0.2, { position: v3(0, 30, 0) }),
                    tween().to(0.2, { scale: new Vec3(1, 1, 1) })
                ),
                tween().parallel(
                    tween().by(0.2, { position: v3(0, -30, 0) }),
                    tween().to(0.2, { scale: new Vec3(1.2, 0.8, 1) })
                ),
                tween().to(0.1, { scale: new Vec3(1, 1, 1) })
            )
            .repeatForever();
        action.start();
    }

    start() {
        // Initialization code here
    }

    onClickDel() {
        this.m_pointData.pop();
        this.updatePoint();
    }

    onOut() {
        const obj = this.m_pointData.map(pos => ({ x: Math.floor(pos.x), y: Math.floor(pos.y) }));
        console.log(JSON.stringify(obj));
    }

    show() {
        this.m_bg.active = true;
        this.m_bossView.active = false;
        this.node.active = true;

        this.m_pointData = [];
        const checkPoint = DataManager.getCheckPoint();
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
        const pre = value / this.m_onNode.getComponent(UITransform).width;
        this.m_scrollView.scrollToPercentHorizontal(pre, 1, false);
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
        DataManager.addGold(gold);
        GameUIManager.instance.updateGameUI();
    }

    diamondFlyEnd(diamond: number) {
        DataManager.addDiamond(diamond);
        GameUIManager.instance.updateGameUI();
    }

    showSucceed(gold: number, diamond: number) {
        this.m_labGold.string = '' + numberToString(gold);
        this.m_labDiamond.string = '' + numberToString(diamond);

        this.showBossView();
        const count = 50;
        const createFly = () => {
            if (gold > 0) {
                const addGold = Math.floor(gold / count);
                CoinFlyManager.instance.createCoinToTip(this.m_labGold.node, this.goldFlyEnd.bind(this), addGold);
            }
            if (diamond > 0) {
                const addDiamond = Math.floor(diamond / count);
                DiamondFlyManager.instance.createDiamondToTip(this.m_labDiamond.node, this.diamondFlyEnd.bind(this), addDiamond);
            }
        };

        let i = 0;
        const flyInterval = setInterval(() => {
            if (i < count) {
                createFly();
                i++;
            } else {
                clearInterval(flyInterval);
                DataManager.setGold(gold);
                DataManager.setDiamond(diamond);
                GameUIManager.instance.updateGameUI();
            }
        }, 10);
    }
}
