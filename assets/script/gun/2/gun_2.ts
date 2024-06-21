import { _decorator, Component, Node, Animation, NodePool, instantiate, v2, tween, Vec2 } from 'cc';
import GunBase from '../gunBase';
import { GameManager } from '../../../script/game';
import BulletManager from '../../../script/bulletBuild';
import { UITransform } from 'cc';
import { v3 } from 'cc';
import { Vec3 } from 'cc';
import { getAngle } from '../../../script/utlis';
import { bullet_2 } from './bullet_2';
const { ccclass, property } = _decorator;

@ccclass('gun_2')
export class gun_2 extends GunBase {

    @property(Node)
    m_bullet: Node = null;

    private m_bulletPool: NodePool;
    private m_effect: Animation;
    private m_effectEnd: boolean = false;
    private m_fireAction: any;
    private m_target: any;

    onLoad() {
        this.m_bulletPool = new NodePool();

        const effectNode = this.node.getChildByName('effect');
        if (effectNode) {
            this.m_effect = effectNode.getComponent(Animation);
            this.m_effect.node.active = false;
        }

        this.m_fireAction = tween(this.node)
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
            .union()
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
        bullet['isDead'] = false;
        bullet.active = true;
        bullet['_attackTarget'] = this.m_target;
        BulletManager.instance.node.addChild(bullet);
        let pos = this.node.getComponent(UITransform).convertToWorldSpaceAR(v3(0, 0));
        pos = BulletManager.instance.node.getComponent(UITransform).convertToNodeSpaceAR(pos);

        bullet.angle = getAngle(pos, this.m_target.getPosition());

        const js = bullet.getComponent(bullet_2);
        js.setATK(this.m_ATK);

        bullet.setPosition(pos);
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


