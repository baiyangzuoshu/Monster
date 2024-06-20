import { _decorator, Component, Node, Sprite, Label, Integer } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Skill')
export class Skill extends Component {

    @property(Node)
    m_lock: Node = null;

    @property(Sprite)
    m_cd: Sprite = null;

    @property(Label)
    m_time: Label = null;

    @property(Integer)
    m_bufferType: number = 0;

    private m_timeData: number = 0;
    private m_maxTime: number = 60;

    onLoad() {
        this.m_lock.active = false;
        this.m_cd.node.active = false;
        this.m_time.node.active = false;

        this.m_timeData = 0;
        this.m_maxTime = 60;
        window['g_bufferState'] = [];
    }

    start() {
        // Initialization code here
    }

    onClickSkill() {
        if (this.m_timeData > 0) return;

        this.m_cd.node.active = true;
        this.m_time.node.active = true;

        this.m_timeData = this.m_maxTime;
        this.m_time.string = this.formatSeconds(this.m_timeData);

        window['g_bufferState'][this.m_bufferType] = true;

        if (this.m_bufferType === BUFFER_GUAIWUJIANSHU) {
            g_monsterBuild.setAllSlow(true);
        }
    }

    update(dt: number) {
        if (this.m_timeData === 0) return;

        if (this.m_timeData > 0) {
            this.m_timeData -= dt;
        }
        if (this.m_timeData < 0) {
            this.m_timeData = 0;
            this.m_cd.node.active = false;
            this.m_time.node.active = false;
            window['g_bufferState'][this.m_bufferType] = false;

            if (this.m_bufferType === BUFFER_GUAIWUJIANSHU) {
                g_monsterBuild.setAllSlow(false);
            }
            return;
        }
        this.m_time.string = this.formatSeconds(this.m_timeData);
        const per = this.m_timeData / this.m_maxTime;
        this.m_cd.fillRange = per;
    }

    formatSeconds(value: number): string {
        let theTime = parseInt(value.toString()); // 秒
        let middle = 0; // 分

        if (theTime > 60) {
            middle = parseInt((theTime / 60).toString());
            theTime = parseInt((theTime % 60).toString());
        }
        let result = "" + parseInt(theTime.toString());
        if (middle > 0) {
            result = "" + parseInt(middle.toString()) + ":" + result;
        } else {
            result = "00:" + result;
        }

        return result;
    }
}
