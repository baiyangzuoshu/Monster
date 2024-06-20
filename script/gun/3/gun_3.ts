import { _decorator, Component, Node, instantiate, v2, sequence, callFunc, scaleTo, repeatForever, Sprite } from 'cc';
import { GunBase } from './gunBase';
const { ccclass, property } = _decorator;

@ccclass('Gun')
export class Gun extends GunBase {

    @property(Node)
    m_bullet: Node = null;

    private m_effectEnd: boolean = false;
    private m_fire: boolean = false;
    private m_fireAction: any;
    private m_target: any;

    onLoad() {
        this.m_effectEnd = false;
        this.m_fire = false;

        const seq = sequence(
            callFunc(() => {
                if (!g_game.isGameStart()) {
                    this.endFire();
                    return;
                }
            }),
            scaleTo(0.25, 1.2, 0.8),
            callFunc(() => {
                if (!g_game.isGameStart()) {
                    this.endFire();
                    return;
                }
                this.createBullet();
            }),
            scaleTo(0.1, 1, 1),
            callFunc(() => {
                if (this.m_effectEnd) {
                    this.node.stopAction(this.m_fireAction);
                    this.m_fire = false;
                    if (this.m_endCallBack != null) {
                        this.m_endCallBack(this.m_type);
                    }
                }
            }),
        );
        this.m_fireAction = repeatForever(seq);
    }

    start() {
        // Initialization code here
    }

    fire(target: any) {
        this.m_target = target;

        this.m_effectEnd = false;
        this.m_fire = true;
        this.node.runAction(this.m_fireAction);
    }

    endFire() {
        this.m_effectEnd = true;
    }

    createBullet() {
        const bullet = instantiate(this.m_bullet);
        const js = bullet.getComponent('bullet_3');

        js.setFrame(this.node.getComponent(Sprite).spriteFrame);

        bullet['isDead'] = false;
        bullet.active = true;
        bullet['_attackTarget'] = this.m_target;
        g_bulletBuild.node.addChild(bullet);

        let pos = this.node.convertToWorldSpaceAR(v2(0, 0));
        pos = g_bulletBuild.node.convertToNodeSpaceAR(pos);

        bullet.angle = getAngle(pos, this.m_target.getPosition()) - 90;
        bullet.setPosition(pos);

        js.setATK(this.m_ATK);
    }

    update(dt: number) {
        // Update code here
    }

    isFire(): boolean {
        return this.m_fire;
    }

    setFireEndCallBack(call: Function, type: number) {
        this.m_type = type;
        this.m_endCallBack = call;
    }
}

export default Gun;

function getAngle(startPos: Vec2, endPos: Vec2): number {
    const dx = endPos.x - startPos.x;
    const dy = endPos.y - startPos.y;
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
    return angle;
}
