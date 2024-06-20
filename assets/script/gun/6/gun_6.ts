import { _decorator, Component, Node, Animation, NodePool, instantiate, v2, sequence, callFunc, moveTo, repeatForever } from 'cc';
import { GunBase } from './gunBase';
const { ccclass, property } = _decorator;

@ccclass('Gun')
export class Gun extends GunBase {

    @property(Node)
    m_bullet: Node = null;

    private m_bulletPool: NodePool = new NodePool();
    private m_effect: Animation = null;
    private m_effectEnd: boolean = false;
    private m_fire: boolean = false;
    private m_fireAction: any;
    private m_target: any;

    onLoad() {
        const effectNode = this.node.getChildByName('effect');
        if (effectNode) {
            this.m_effect = effectNode.getComponent(Animation);
            this.m_effect.on('finished', this.onEffectEnd, this);
        }

        const seq = sequence(
            callFunc(() => {
                if (!g_game.isGameStart()) {
                    this.endFire();
                    return;
                }
                if (!this.m_effectEnd) {
                    this.m_effect.node.active = true;
                    this.m_effect.play('fire');
                }
            }),
            moveTo(0.25, v2(0, -15)),
            callFunc(() => {
                this.createBullet();
            }),
            moveTo(0.25, v2(0, 0)),
            callFunc(() => {
                if (this.m_effectEnd) {
                    this.node.stopAction(this.m_fireAction);
                    this.m_fire = false;
                    if (this.m_endCallBack != null) {
                        this.m_endCallBack(this.m_type);
                    }
                }
            })
        );
        this.m_fireAction = repeatForever(seq);
    }

    start() {
        // Initialization code here
    }

    fire(target: any) {
        this.m_fire = true;
        if (this.m_effect != null) {
            this.m_effectEnd = false;
            this.node.runAction(this.m_fireAction);
        }
        this.m_target = target;
    }

    endFire() {
        if (this.m_effect != null) {
            this.m_effectEnd = true;
        }
    }

    createBullet() {
        const bullet = instantiate(this.m_bullet);
        bullet['isDead'] = false;
        bullet.active = true;
        bullet['_attackTarget'] = this.m_target;
        g_bulletBuild.node.addChild(bullet);

        let pos = this.node.convertToWorldSpaceAR(v2(0, 0));
        pos = g_bulletBuild.node.convertToNodeSpaceAR(pos);

        bullet.angle = getAngle(pos, this.m_target.getPosition());

        const js = bullet.getComponent('bullet_6');
        js.setATK(this.m_ATK);

        bullet.setPosition(pos);
    }

    update(dt: number) {
        // Update code here
    }

    private onEffectEnd() {
        this.m_effect.node.active = false;
    }
}

export default Gun;

function getAngle(startPos: Vec2, endPos: Vec2): number {
    const dx = endPos.x - startPos.x;
    const dy = endPos.y - startPos.y;
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
    return angle;
}
