import { _decorator, Component, Node, Sprite, Label } from 'cc';
import { MonsterBuild } from '../monsterBuild';
import { BUFFER_GUAIWUJIANSHU } from '../define';
const { ccclass, property } = _decorator;

@ccclass('SkillManager')
export class SkillManager extends Component {

    @property(Node)
    m_lock: Node = null;

    @property(Sprite)
    m_cd: Sprite = null;

    @property(Label)
    m_time: Label = null;

    @property(Number)
    m_bufferType: number = 0;

    private static _instance: SkillManager;
    private m_timeData: number = 0;
    private m_maxTime: number = 60;

    public bufferState=[];

    static get instance() {
        return this._instance;
    }

    onLoad() {
        if (SkillManager._instance) {
            this.destroy();
            return;
        }
        SkillManager._instance = this;
        this.bufferState = [];
    }

    start() {
        this.m_lock.active = false;
        this.m_cd.node.active = false;
        this.m_time.node.active = false;
        this.m_timeData = 0;
        this.m_maxTime = 60;
    }

    onClickSkill() {
        if (this.m_timeData > 0) return;

        this.m_cd.node.active = true;
        this.m_time.node.active = true;

        this.m_timeData = this.m_maxTime;
        this.m_time.string = this.formatSeconds(this.m_timeData);

        this.bufferState[this.m_bufferType] = true;

        if (this.m_bufferType === BUFFER_GUAIWUJIANSHU) {
            MonsterBuild.instance.setAllSlow(true);
        }
    }

    update(dt: number) {
        if (this.m_timeData === 0) return;

        this.m_timeData -= dt;
        if (this.m_timeData <= 0) {
            this.resetSkill();
        } else {
            this.m_time.string = this.formatSeconds(this.m_timeData);
            this.m_cd.fillRange = this.m_timeData / this.m_maxTime;
        }
    }

    private resetSkill() {
        this.m_timeData = 0;
        this.m_cd.node.active = false;
        this.m_time.node.active = false;
        this.bufferState[this.m_bufferType] = false;

        if (this.m_bufferType === BUFFER_GUAIWUJIANSHU) {
            MonsterBuild.instance.setAllSlow(false);
        }
    }

    private formatSeconds(value: number): string {
        const theTime = Math.floor(value); // 秒
        const minutes = Math.floor(theTime / 60); // 分
        const seconds = theTime % 60; // 剩余的秒

        const minutesStr = minutes > 9 ? minutes.toString() : '0' + minutes;
        const secondsStr = seconds > 9 ? seconds.toString() : '0' + seconds;

        return `${minutesStr}:${secondsStr}`;
    }
}
