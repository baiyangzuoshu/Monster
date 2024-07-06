import { UIManager } from '../../../Framework/Scripts/Managers/UIManager';
import { UIComponent } from '../../../Framework/Scripts/UI/UIComponent';
import { CoinFlyManager } from '../../../script/coinFly';
import { g_GlobalData } from '../../../script/data/data';
import { DataManager } from '../../../script/data/dataManager';
import DiamondFlyManager from '../../../script/diamondFly';
import { numberToString } from '../../../script/utlis';
import { Label } from 'cc';
import { Vec3 } from 'cc';
import { UITransform } from 'cc';
import { v3 } from 'cc';
import { tween } from 'cc';
import { instantiate } from 'cc';
import { ScrollView } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { GUI, UIEventName } from '../Constants';
const { ccclass, property } = _decorator;

@ccclass('UIMapUICtrl')
export class UIMapUICtrl extends UIComponent {
    m_scrollView: ScrollView = null;
    m_onNode: Node = null;
    m_pointNode: Node = null;
    m_point: Node = null;
    m_curPoint: Node = null;
    m_bossView: Node = null;
    m_bg: Node = null;
    m_labGold: Label = null;
    m_labDiamond: Label = null;

    private m_pointData: Array<{ x: number, y: number }> = [];
    private m_curtPos: { x: number, y: number } = { x: 0, y: 0 };

    onLoad() {
        this.m_scrollView=this.ViewComponent("map",ScrollView);
        this.m_onNode=this.ViewNode("map/view/content");
        this.m_pointNode=this.ViewNode("map/view/content/map_0");
        this.m_point=this.ViewNode("map/view/ui_map_img_2");
        this.m_curPoint=this.ViewNode("map/view/ui_map_location");
        this.m_bossView=this.ViewNode("bossNode");
        this.m_bg=this.ViewNode("bg");
        this.m_labGold=this.ViewComponent("bossNode/gold/lab_gold",Label);
        this.m_labDiamond=this.ViewComponent("bossNode/diamond/lab_diamond",Label);
        this.AddButtonListener("bg",this,this.onClickBG);

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
        UIManager.Instance.DestroyUIView(GUI.UIMap);
        UIManager.Instance.DestroyUIView(GUI.UISettlement);
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

        this.EmitEventListener(UIEventName.updateGameUI);
    }

    diamondFlyEnd(diamond: number) {
        DataManager.addDiamond(diamond);
        this.EmitEventListener(UIEventName.updateGameUI);

    }

    showSucceed(gold: number, diamond: number) {
        console.log("showSucceed");
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
                this.EmitEventListener(UIEventName.updateGameUI);

            }
        }, 10);
    }
}

