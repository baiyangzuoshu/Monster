import { _decorator, Component, Label, Sprite, SpriteAtlas, Animation, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BossView')
export class BossView extends Component {

    @property(Label)
    m_labLevel: Label = null;

    @property(Label)
    m_bossName: Label = null;

    @property(Sprite)
    m_bossSprite: Sprite = null;

    @property(SpriteAtlas)
    m_bossAtlas: SpriteAtlas = null;

    private m_anim: Animation = null;
    private m_callBack: Function | null = null;

    onLoad() {
        window['g_bossView'] = this;
        this.m_anim = this.node.getComponent(Animation);
        // this.m_anim.on('finished', this.end, this);
    }

    start() {
        // Initialization code here
    }

    play(callFunc: Function) {
        // 设置关卡
        const checkPoint = g_dataManager.getCheckPoint();
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

        this.node.active = true;
        this.m_anim.play('bossView');
        this.m_callBack = callFunc;
    }

    end() {
        this.node.active = false;

        if (this.m_callBack) {
            this.m_callBack();
        }
    }

    // update(deltaTime: number) {
    //     // Update code here
    // }
}
