import { _decorator, Component, Node, Animation, NodePool, instantiate, v2, Tween, tween } from 'cc';
import GunBase from '../gunBase';
import { Vec3 } from 'cc';
import { GameManager } from '../../../script/game';
import { v3 } from 'cc';
import BulletManager from '../../../script/bulletBuild';
import { UITransform } from 'cc';
import { getAngle } from '../../../script/utlis';
import { bullet_6 } from './bullet_6';
const { ccclass, property } = _decorator;

@ccclass('gun_6')
export class gun_6 extends GunBase {

    @property(Node)
    m_bullet: Node = null;

    private m_bulletPool: NodePool = new NodePool();
    private m_effect: Animation = null;
    private m_effectEnd: boolean = false;
    private m_fireAction: Tween<Node> = null;
    private m_target: any;

    onLoad() {
        const effectNode = this.node.getChildByName('effect');
        if (effectNode) {
            this.m_effect = effectNode.getComponent(Animation);
            this.m_effect.on(Animation.EventType.FINISHED, this.onEffectEnd, this);
        }

        this.m_fireAction = tween(this.node)
            .call(() => {
                if (!GameManager.instance.isGameStart()) {
                    this.endFire();
                    return;
                }
                if (!this.m_effectEnd) {
                    this.m_effect.node.active = true;
                    this.m_effect.play('fire');
                }
            })
            .to(0.25, { position: v3(0, -15) })
            .call(() => {
                this.createBullet();
            })
            .to(0.25, { position: v3(0, 0) })
            .call(() => {
                if (this.m_effectEnd) {
                    this.m_fireAction.stop();
                    this.m_fire = false;
                    if (this.m_endCallBack != null) {
                        this.m_endCallBack(this.m_type);
                    }
                }
            })
            .repeatForever();
    }

    start() {
        // Initialization code here
    }

    fire(target: any) {
        this.m_fire = true;
        if (this.m_effect != null) {
            this.m_effectEnd = false;
            this.m_fireAction.start();
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
        bullet.active = true;
        BulletManager.instance.node.addChild(bullet);

        let pos = this.node.getComponent(UITransform).convertToWorldSpaceAR(v3(0, 0));
        pos = BulletManager.instance.node.getComponent(UITransform).convertToNodeSpaceAR(pos);

        bullet.angle = getAngle(pos, this.m_target.getPosition());

        const js = bullet.getComponent(bullet_6);
        js.setATK(this.m_ATK);
        js.isDead = false;
        js._attackTarget = this.m_target;

        bullet.setPosition(pos);

    }

    update(dt: number) {
        // Update code here
    }

    private onEffectEnd() {
        this.m_effect.node.active = false;
    }
}

