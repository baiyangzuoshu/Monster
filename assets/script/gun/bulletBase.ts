import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BulletBase')
export class BulletBase extends Component {
    public m_ATK: number = 0;
    public _attackTarget: Node = null;
    public isDead: boolean = false;
    ctor() {
        this.m_ATK = 0;
    }

    start() {
        // Initialization code here
    }

    setATK(ATK: number) {
        this.m_ATK = ATK;
    }

    // update(dt: number) {
    //     // Update code here
    // }
}

export default BulletBase;
