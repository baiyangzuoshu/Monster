import { _decorator, Component, Label, Sprite, Button } from 'cc';
import { g_intensifyData } from '../data/intensifyData';
import { GameUIManager } from './gameUI';
import { DataManager } from '../data/dataManager';
const { ccclass, property } = _decorator;

@ccclass('IntensifyItem')
export class IntensifyItem extends Component {

    @property(Label)
    m_title: Label = null;

    @property(Sprite)
    m_icon: Sprite = null;

    @property(Label)
    m_lvLabel: Label = null;

    @property(Label)
    m_preLabel: Label = null;

    @property(Button)
    m_upLevelButton: Button = null;

    @property(Label)
    m_needDiamond: Label = null;

    private m_ID: number = 0;

    start() {
        // Initialization code here
    }

    updateItem() {
        this.m_upLevelButton.interactable = true;
        const data = g_intensifyData.getIntensifyDataByID(this.m_ID);
        if (data == null) return;

        const title = g_intensifyData.getTitle(this.m_ID);
        this.setTitle(title);

        const iconName = g_intensifyData.getIcon(this.m_ID);
        const frame = GameUIManager.instance.m_gameUIAtlas.getSpriteFrame(iconName);
        this.m_icon.spriteFrame = frame;

        let lv = DataManager.getInternsifLevel(this.m_ID);
        if (lv >= data.value.length) {
            lv = data.value.length - 1;
            this.m_upLevelButton.interactable = false;
        }

        const needDiamond = g_intensifyData.getDiamond(this.m_ID, lv);
        const haveDiamond = DataManager.getDiamond();
        if (haveDiamond < needDiamond) {
            this.m_upLevelButton.interactable = false;
        }
        this.m_needDiamond.string = '' + needDiamond;
        this.m_lvLabel.string = 'Lv.' + (lv + 1);

        const curLv = g_intensifyData.getValue(this.m_ID, lv);
        const nextLv = g_intensifyData.getValue(this.m_ID, lv + 1);

        const showPer = data.showPer;
        let showPerString = '';
        if (showPer) {
            showPerString = '%';
        }

        if (nextLv == null) {
            this.m_preLabel.string = '' + curLv + showPerString + ' - MAX';
        } else {
            this.m_preLabel.string = '' + curLv + showPerString + ' - ' + nextLv + showPerString;
        }
    }

    public setID(ID: number) {
        this.m_ID = ID;
    }

    setTitle(str: string) {
        this.m_title.string = str;
    }

    onClickUp() {
        const data = g_intensifyData.getIntensifyDataByID(this.m_ID);
        if (data == null) return;

        let lv = DataManager.getInternsifLevel(this.m_ID);
        if (lv >= data.value.length) {
            lv = data.value.length - 1;
            this.m_upLevelButton.interactable = false;
            return;
        }

        const needDiamond = g_intensifyData.getDiamond(this.m_ID, lv);
        const haveDiamond = DataManager.getDiamond();
        if (haveDiamond < needDiamond) {
            this.m_upLevelButton.interactable = false;
            return;
        }

        DataManager.subDiamond(needDiamond);
        DataManager.addInternsifLevel(this.m_ID);

        GameUIManager.instance.updateGameUI();
        this.updateItem();
    }

    // update(dt: number) {
    //     // Update code here
    // }
}
