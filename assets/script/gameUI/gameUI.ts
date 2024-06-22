import { _decorator, Component, Node, Prefab, instantiate, SpriteAtlas } from 'cc';
import { GameManager } from '../game';
import { g_GlobalData } from '../data/data';
import { DataManager } from '../data/dataManager';
import { TopUIManager } from './topUI';
import { BottomUIManager } from './bottom';
import { BossViewManager } from './bossView';
import { Settlement } from './smallSettlement';
const { ccclass, property } = _decorator;

@ccclass('GameUIManager')
export class GameUIManager extends Component {

    @property(Prefab)
    m_smallSettlementPrefab: Prefab = null;

    @property(Prefab)
    m_bossViewPrefab: Prefab = null;

    @property(Prefab)
    m_mapViewPrefab: Prefab = null;

    @property(Node)
    m_coinFlyNode: Node = null;

    @property(SpriteAtlas)
    m_gameUIAtlas: SpriteAtlas = null;

    private m_smallSettlement: any = null;
    private m_bossView: BossViewManager = null;
    private m_mapView: any = null;

    private static _instance: GameUIManager;

    static get instance() {
        return this._instance;
    }

    onLoad() {
        if (GameUIManager._instance) {
            this.destroy();
            return;
        }
        GameUIManager._instance = this;
    
        this.m_coinFlyNode.setSiblingIndex(1000);
    }

    start() {
        // Initialization code here
    }

    updateGameUI() {
        BottomUIManager.instance.updateGameUI();
        TopUIManager.instance.updateGameUI();
    }

    createSmallSettlement() {
        if (this.m_smallSettlement == null) {
            this.m_smallSettlement = instantiate(this.m_smallSettlementPrefab);
            this.node.addChild(this.m_smallSettlement);
            this.m_smallSettlement = this.m_smallSettlement.getComponent(Settlement);
        }
        return this.m_smallSettlement;
    }

    createBossSettlement() {
        this.showMapView();
        return this.m_mapView;
    }

    showSucceed() {
        let view;
        let delayTime = 0;
        if (g_GlobalData.isCurBossAttack()) {
            delayTime = 6;
            view = this.createBossSettlement();
        } else {
            delayTime = 2;
            view = this.createSmallSettlement();
        }

        const checkPoint = g_GlobalData.getCurCheckPoint();
        DataManager.addGold(checkPoint.succedGold);
        DataManager.addDiamond(checkPoint.diamond);
        this.updateGameUI();
        view.showSucceed(checkPoint.succedGold, checkPoint.diamond);

        this.scheduleOnce(() => {
            let isBoss = false;
            if (g_GlobalData.isCurBossAttack()) {
                const view = this.createBossSettlement();
                view.hideBossView();
                isBoss = true;
            } else {
                this.hideSmallSettlement();
            }

            this.updateGameUI();
            GameManager.instance.playGame(isBoss);
        }, delayTime);
    }

    showFaild() {
        const view = this.createSmallSettlement();
        //if (view.node.active) return;

        const checkPoint = g_GlobalData.getCurCheckPoint();
        DataManager.addGold(checkPoint.faildGold);
        this.updateGameUI();

        view.showFaild(checkPoint.faildGold);

        this.scheduleOnce(() => {
            g_GlobalData.previousCheckPoint();
            this.hideSmallSettlement();
            this.updateGameUI();
            GameManager.instance.playGame();
        }, 2);
    }

    hideSmallSettlement() {
        const view = this.createSmallSettlement();
        view.hide();
    }

    playBossViewAnim(callFunc: Function) {
        if (this.m_bossView == null) {
            let bossNode = instantiate(this.m_bossViewPrefab);
            this.node.addChild(bossNode);
            this.m_bossView = bossNode.getComponent(BossViewManager);
        }
        this.m_bossView.play(callFunc);
    }

    showMapView() {
        if (this.m_mapView == null) {
            this.m_mapView = instantiate(this.m_mapViewPrefab);
            this.node.addChild(this.m_mapView);
            this.m_mapView = this.m_mapView.getComponent('mapView');
        }
        this.m_mapView.show();
    }

    hideMapView() {
        this.m_mapView.hide();
    }

    changeMapViewActive() {
        if (this.m_mapView == null) {
            this.showMapView();
            return;
        }
        if (this.m_mapView.node.active) {
            this.hideMapView();
        } else {
            this.showMapView();
        }
    }
}
