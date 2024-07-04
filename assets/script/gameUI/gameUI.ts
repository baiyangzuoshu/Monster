import { _decorator, Component, Node, Prefab, instantiate, SpriteAtlas } from 'cc';
import { GameManager } from '../../Game/Scripts/Manager/GameManager';

import { g_GlobalData } from '../data/data';
import { DataManager } from '../data/dataManager';
import { TopUIManager } from './topUI';
import { BottomUIManager } from './bottom';
import { BossViewManager } from './bossView';
import { Settlement } from './smallSettlement';
import { MapView } from './mapView';
import { UIManager } from '../../Framework/Scripts/Managers/UIManager';
import { GUI } from '../../Game/Scripts/Constants';
import { UISettlementUICtrl } from '../../Game/Scripts/UIControllers/UISettlementUICtrl';
const { ccclass, property } = _decorator;

@ccclass('GameUIManager')
export class GameUIManager extends Component {

    @property(Prefab)
    m_mapViewPrefab: Prefab = null;

    @property(Node)
    m_coinFlyNode: Node = null;

    @property(SpriteAtlas)
    m_gameUIAtlas: SpriteAtlas = null;

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

    createBossSettlement() {
        this.showMapView();
        return this.m_mapView;
    }

    async showSucceed() {
        const checkPoint = g_GlobalData.getCurCheckPoint();
        DataManager.addGold(checkPoint.succedGold);
        DataManager.addDiamond(checkPoint.diamond);
        this.updateGameUI();


        let view;
        let delayTime = 0;
        if (g_GlobalData.isCurBossAttack()) {
            delayTime = 6;
            view = this.createBossSettlement();
            view.showSucceed(checkPoint.succedGold, checkPoint.diamond);
        } else {
            delayTime = 2;
            view=await UIManager.Instance.IE_ShowUIView(GUI.UISettlement);
            view.showSucceed(checkPoint.succedGold, checkPoint.diamond);
        }

        this.scheduleOnce(() => {
            let isBoss = false;
            if (g_GlobalData.isCurBossAttack()) {
                const view = this.createBossSettlement();
                view.hideBossView();
                isBoss = true;
            } else {
                view.node.destroy();
            }

            this.updateGameUI();
            GameManager.instance.playGame(isBoss);
        }, delayTime);
    }

    async showFaild() {
        const view =await UIManager.Instance.IE_ShowUIView(GUI.UISettlement) as UISettlementUICtrl;

        const checkPoint = g_GlobalData.getCurCheckPoint();
        DataManager.addGold(checkPoint.faildGold);
        this.updateGameUI();

        view.showFaild(checkPoint.faildGold);

        this.scheduleOnce(() => {
            g_GlobalData.previousCheckPoint();
            view.node.destroy();

            this.updateGameUI();
            GameManager.instance.playGame();
        }, 2);
    }

    showMapView() {
        if (this.m_mapView == null) {
            this.m_mapView = instantiate(this.m_mapViewPrefab);
            this.node.addChild(this.m_mapView);
            this.m_mapView = this.m_mapView.getComponent(MapView);
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
