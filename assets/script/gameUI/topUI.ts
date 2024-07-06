import { _decorator, Component, Node, Label } from 'cc';
import { g_GlobalData } from '../data/data';
import { DataManager } from '../data/dataManager';
import { numberToString } from '../utlis';
import { EventManager } from '../../Framework/Scripts/Managers/EventManager';
import { UIEventName } from '../../Game/Scripts/Constants';
const { ccclass, property } = _decorator;

@ccclass('TopUIManager')
export class TopUIManager extends Component {

    @property(Label)
    m_labGold: Label = null;

    @property(Label)
    m_diamond: Label = null;

    @property(Label)
    m_labCheckPoint: Label = null;

    private static _instance: TopUIManager;

    static get instance() {
        return this._instance;
    }

    onLoad() {
        if (TopUIManager._instance) {
            this.destroy();
            return;
        }
        TopUIManager._instance = this;
        // @ts-ignore
        
    }

    start() {
        this.updateGameUI();
    }

    updateGameUI() {
        const gold = DataManager.getGold();
        const diamond = DataManager.getDiamond();
        this.m_labGold.string = numberToString(gold);
        this.m_diamond.string = numberToString(diamond);
        this.updateCheckPoint();
    }

    updateCheckPoint() {
        const checkPoint = DataManager.getCheckPoint();
        const data = g_GlobalData.getData(checkPoint.big, checkPoint.small);
        this.m_labCheckPoint.string = '关卡';
        this.m_labCheckPoint.string += `${checkPoint.big + 1}-`;
        this.m_labCheckPoint.string += `${checkPoint.small + 1}`;
        if (!data.haveData) {
            this.m_labCheckPoint.string += '*';
        }
    }

    onClickMap() {
        EventManager.Instance.Emit(UIEventName.changeMapViewActive)
    }

    // update(dt: number) {
    //     // Update code here
    // }
}
