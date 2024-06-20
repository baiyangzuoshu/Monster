import { _decorator, Component, Node, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TopUI')
export class TopUI extends Component {

    @property(Label)
    m_labGold: Label = null;

    @property(Label)
    m_diamond: Label = null;

    @property(Label)
    m_labCheckPoint: Label = null;

    onLoad() {
        window['g_topUI'] = this;
    }

    start() {
        this.updateGameUI();
    }

    updateGameUI() {
        const gold = g_dataManager.getGold();
        const diamond = g_dataManager.getDiamond();
        this.m_labGold.string = numberToString(gold);
        this.m_diamond.string = numberToString(diamond);
        this.updateCheckPoint();
    }

    updateCheckPoint() {
        const checkPoint = g_dataManager.getCheckPoint();
        const data = g_GlobalData.getData(checkPoint.big, checkPoint.small);
        this.m_labCheckPoint.string = '关卡';
        this.m_labCheckPoint.string += `${checkPoint.big + 1}-`;
        this.m_labCheckPoint.string += `${checkPoint.small + 1}`;
        if (!data.haveData) {
            this.m_labCheckPoint.string += '*';
        }
    }

    onClickMap() {
        g_gameUI.changeMapViewActive();
    }

    // update(dt: number) {
    //     // Update code here
    // }
}
