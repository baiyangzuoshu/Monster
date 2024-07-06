import { UIComponent } from '../../../../Framework/Scripts/UI/UIComponent';
import { DataManager } from '../../../../script/data/dataManager';
import { g_intensifyData } from '../../../../script/data/intensifyData';
import { Button } from 'cc';
import { Sprite } from 'cc';
import { Label } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { BundleName, UIEventName } from '../../Constants';
import { SpriteAtlas } from 'cc';
import { ResManager } from '../../../../Framework/Scripts/Managers/ResManager';
const { ccclass, property } = _decorator;

@ccclass('UITntensifyItem')
export class UITntensifyItem extends UIComponent {
    m_title: Label = null;
    m_icon: Sprite = null;
    m_lvLabel: Label = null;
    m_preLabel: Label = null;
    m_upLevelButton: Button = null;
    m_needDiamond: Label = null;

    private m_gameUIAtlas: SpriteAtlas = null;

    private m_ID: number = 0;

    onLoad() {
        this.m_title=this.ViewComponent("title",Label);
        this.m_icon=this.ViewComponent("ui_g_buildUpProb",Sprite);
        this.m_lvLabel=this.ViewComponent("lv",Label);
        this.m_preLabel=this.ViewComponent("value",Label);
        this.m_upLevelButton=this.ViewComponent("upLevel",Button);
        this.m_needDiamond=this.ViewComponent("upLevel/Background/Label",Label);
    }

    public async init(){
        this.m_gameUIAtlas=await ResManager.Instance.IE_GetAsset(BundleName.Atlas,"gameUI",SpriteAtlas) as SpriteAtlas;
    }

    updateItem() {
        this.m_upLevelButton.interactable = true;
        const data = g_intensifyData.getIntensifyDataByID(this.m_ID);
        if (data == null) return;

        const title = g_intensifyData.getTitle(this.m_ID);
        this.setTitle(title);

        const iconName = g_intensifyData.getIcon(this.m_ID);
        const frame = this.m_gameUIAtlas.getSpriteFrame(iconName);
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

        this.EmitEventListener(UIEventName.updateGameUI);

        this.updateItem();
    }
}

