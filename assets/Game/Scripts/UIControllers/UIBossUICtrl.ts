import { Label } from 'cc';
import { UIComponent } from '../../../Framework/Scripts/UI/UIComponent';
import { _decorator, Animation, Node } from 'cc';
import { Sprite } from 'cc';
import { SpriteAtlas } from 'cc';
import { DataManager } from '../../../script/data/dataManager';
import { g_GlobalData } from '../../../script/data/data';
import { ResManager } from '../../../Framework/Scripts/Managers/ResManager';
import { BundleName } from '../Constants';
const { ccclass, property } = _decorator;

@ccclass('UIBossUICtrl')
export class UIBossUICtrl extends UIComponent {
    m_labLevel: Label = null;
    m_bossName: Label = null;
    m_bossSprite: Sprite = null;
    m_bossAtlas: SpriteAtlas = null;

    private m_anim: Animation = null;
    private m_callBack: Function | null = null;

    onLoad() {
        this.init();
        this.m_anim = this.node.getComponent(Animation);
    }

    async init() {
        this.m_labLevel=this.ViewComponent("ui_boss_p2/checkPoint",Label)
        this.m_bossName=this.ViewComponent("ui_boss_p2/name",Label)
        this.m_bossSprite=this.ViewComponent("0",Sprite);
        this.m_bossAtlas=await ResManager.Instance.IE_GetAsset(BundleName.Atlas,"monster_2",SpriteAtlas) as SpriteAtlas;

        this.play();
    }

    play() {
        // 设置关卡
        const checkPoint = DataManager.getCheckPoint();
        this.m_labLevel.string = `${checkPoint.big + 1}-${checkPoint.small + 1}`;

        let id = 0;
        const monster = g_GlobalData.getCurMonsterData();
        for (let i = 0; i < monster.length; i++) {
            if (monster[i].type === 2) {
                id = monster[i].id;
                break;
            }
        }

        const name = g_GlobalData.getBossNameByID(id);
        this.m_bossName.string = name;

        const frame = this.m_bossAtlas.getSpriteFrame(id.toString());
        this.m_bossSprite.spriteFrame = frame;

        this.m_anim.play('bossView');
    }

    end() {

        this.destroy();
    }
}

