import { _decorator, Component, Node, Animation, instantiate, v3, tween, Vec3, CCObject } from 'cc';
import GunBase from '../gunBase';
import { GameManager } from '../../../script/game';
import BulletManager from '../../../script/bulletBuild';
import { getAngle } from '../../../script/utlis';
import { Tween } from 'cc';
import { bullet_0 } from './bullet_0';

const { ccclass, property } = _decorator;

@ccclass('gun_0')
export class gun_0 extends GunBase {

    @property(Node)
    m_bullet: Node = null;

    private m_effect: Animation = null;
    private m_effectEnd: boolean = false;
    private m_fireAction: Tween<Node> = null;
    private m_target: any = null;

    onLoad() {
        this.m_fire = false;

        this.m_effect = this.node.getChildByName('effect')?.getComponent(Animation) || null;

        if (this.m_effect) {
            this.m_effect.on(Animation.EventType.FINISHED, this.onEffectEnd, this);
        }

        const seq = tween(this.node)
            .call(() => {
                if (!GameManager.instance.isGameStart()) {
                    this.endFire();
                    return;
                }
                if (!this.m_effectEnd && this.m_effect) {
                    this.m_effect.node.active = true;
                    this.m_effect.play('fire');
                }
            })
            .by(0.25, { position: new Vec3(0, -15, 0) })
            .call(() => {
                this.createBullet();
            })
            .by(0.25, { position: new Vec3(0, 15, 0) })
            .call(() => {
                if (this.m_effectEnd) {
                    this.m_fire = false;
                    if (this.m_endCallBack != null) {
                        this.m_endCallBack(this.m_type);
                    }
                }
            });

        this.m_fireAction = seq.repeatForever().start();
    }

    start() {
        // Initialization code here
    }

    fire(target: any) {
        this.m_fire = true;
        this.m_effectEnd = false;
        if (this.m_effect) {
            this.m_fireAction.start();
        }
        this.m_target = target;
    }

    endFire() {
        if (this.m_effect) {
            this.m_effectEnd = true;
        }
    }

    createBullet() {
        const bullet = instantiate(this.m_bullet);
        bullet.active = true;
        BulletManager.instance.node.addChild(bullet);
        
        const pos = this.node.getWorldPosition();
        bullet.setWorldPosition(pos);
        
        bullet.angle = getAngle(pos, this.m_target.getWorldPosition());
        
        const js = bullet.getComponent(bullet_0);
        js.setATK(this.m_ATK);
        js.isDead=false;
        js._attackTarget=this.m_target;

        bullet.setWorldPosition(pos);
    }

    hideBullet() {
        this.m_bullet.active = false;
    }

    onEffectEnd() {
        if (this.m_effect) {
            this.m_effect.node.active = false;
        }
    }
}
