import { _decorator, Component, Node, Animation, instantiate, callFunc, delayTime, sequence, repeatForever, v2 } from 'cc';
import { GunBase } from './gunBase';
const { ccclass, property } = _decorator;

@ccclass('Gun')
export class Gun extends GunBase {

    @property(Node)
    m_bulletNode: Node = null;

    private m_bullet: Node = null;
    private m_effect: Animation = null;
    private m_fireAction: any = null;
    private m_target: any = null;
    private m_effectEnd: boolean = false;

    onLoad() {
        this.m_fire = false;
        this.m_bullet = instantiate(this.m_bulletNode);
        g_bulletBuild.node.addChild(this.m_bullet);

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
                    this.showBullet();
                    this.m_effect.play('fire');

                    const js = this.m_target.getComponent('msItem');
                    if (js != null) {
                        js.subHP(this.m_ATK);
                    }
                }
            }),
            delayTime(0.25),
            callFunc(() => {
                this.hideBullet();
            }),
            delayTime(0.5),
            callFunc(() => {
                if (this.m_effectEnd) {
                    this.hideBullet();
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
        this.m_effectEnd = false;
        this.node.runAction(this.m_fireAction);

        this.m_target = target;
        this.m_bullet['_attackTarget'] = this.m_target;
    }

    endFire() {
        this.m_effectEnd = true;
    }

    showBullet() {
        this.m_bullet.active = true;

        const world_pos = this.node.convertToWorldSpaceAR(v2(0, 0));
        const pos = g_bulletBuild.node.convertToNodeSpaceAR(world_pos);
        this.m_bullet.setPosition(pos);

        const js = this.m_bullet.getComponent('bullet_0');
        js.setATK(this.m_ATK);
        js.updateBullet();
    }

    hideBullet() {
        this.m_bullet.active = false;
    }

    onEffectEnd() {
        this.m_effect.node.active = false;
    }

    // update(dt: number) {
    //     // Update code here
    // }
}

export default Gun;
