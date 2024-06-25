import { _decorator, Component, Node, Animation, NodePool, instantiate, v2, tween, Tween } from 'cc';
import GunBase from '../gunBase';
import { Vec3 } from 'cc';
import { GameManager } from '../../../script/game';
import BulletManager from '../../../script/bulletBuild';
import { UITransform } from 'cc';
import { v3 } from 'cc';
import { getAngle } from '../../../script/utlis';
import { bullet_4 } from './bullet_4';
const { ccclass, property } = _decorator;

@ccclass('gun_4')
export class gun_4 extends GunBase {

    @property(Node)
    m_bullet: Node = null;

    private m_bulletPool: NodePool = new NodePool();
    private m_effect: Animation = null;
    private m_effectEnd: boolean = false;
    private m_target: any;
    private m_fireTween: Tween<Node> | null = null;

    onLoad() {
        const effectNode = this.node.getChildByName('effect');
        if (effectNode) {
            this.m_effect = effectNode.getComponent(Animation);
            this.m_effect.node.active = false;
        }

        this.createFireAction();
    }

    start() {
        // Initialization code here
    }

    createFireAction() {
        this.m_fireTween = tween(this.node)
            .call(() => {
                if (!GameManager.instance.isGameStart()) {
                    this.endFire();
                    return;
                }
                if (!this.m_effectEnd) {
                    // this.m_effect.node.active = true;
                    // this.m_effect.play('fire');
                }
            })
            .delay(0.25)
            .call(() => {
                this.createBullet();
            })
            .delay(0.25)
            .call(() => {
                if (this.m_effectEnd) {
                    this.m_fire = false;
                    if (this.m_endCallBack != null) {
                        this.m_endCallBack(this.m_type);
                    }
                }
            })
            .repeatForever();
    }

    fire(target: any) {
        this.m_fire = true;
        if (this.m_effect != null) {
            this.m_effectEnd = false;
            this.m_fireTween?.start();
        }
        this.m_target = target;
    }

    endFire() {
        if (this.m_effect != null) {
            this.m_effectEnd = true;
            this.m_fireTween?.stop();
        }
    }

    createBullet() {
        const bullet = instantiate(this.m_bullet);
        bullet.active = true;
        BulletManager.instance.node.addChild(bullet);

        let pos = this.node.getComponent(UITransform).convertToWorldSpaceAR(v3(0, 0));
        pos = BulletManager.instance.node.getComponent(UITransform).convertToNodeSpaceAR(pos);

        bullet.angle = getAngle(pos, this.m_target.getPosition());

        bullet.setPosition(pos);

        const js = bullet.getComponent(bullet_4);
        js.setATK(this.m_ATK);
        js.isDead = false;
        js._attackTarget = this.m_target;
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

