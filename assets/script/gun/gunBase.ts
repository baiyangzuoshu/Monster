import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GunBase')
export class GunBase extends Component {
    public m_fire: boolean = false;
    public m_type: number = 0;
    public m_endCallBack: Function | null = null;
    public m_ATK: number = 0;

    ctor() {
        this.m_fire = false;
        this.m_type = 0;
        this.m_endCallBack = null;
        this.m_ATK = 0;
    }

    start() {
        // Initialization code here
    }

    isFire(): boolean {
        return this.m_fire;
    }

    setFireEndCallBack(call: Function, type: number) {
        this.m_type = type;
        this.m_endCallBack = call;
    }

    setATK(ATK: number) {
        this.m_ATK = ATK;
    }

    fire(target: any) {
        
    }

    endFire() {
        
    }

    // update(dt: number) {
    //     // Update code here
    // }
}

export default GunBase;
