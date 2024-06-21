import { _decorator, Component, Node, Animation, instantiate,Vec3, Tween, tween, Vec2 } from 'cc';
import GunBase from '../gunBase';
import { GameManager } from '../../../script/game';
import BulletManager from '../../../script/bulletBuild';
import { UITransform } from 'cc';
import { bullet_1 } from './bullet_1';
const { ccclass, property } = _decorator;

@ccclass('gun_1')
export class gun_1 extends GunBase {

    @property(Node)
    m_bulletNode: Node = null;

    @property(Node)
    m_boomEffect: Node = null;

    private m_bullet: Node = null;
    private m_effect: Animation = null;
    private m_fireAction: Tween<Node> = null;
    private m_target: any = null;
    private m_effectEnd: boolean = false;

    onLoad() {
        this.m_fire = false;
        this.m_bullet = instantiate(this.m_bulletNode);
        BulletManager.instance.node.addChild(this.m_bullet);

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
                    this.showBullet();
                    this.createBoomEffect(this.m_target);
                    this.m_effect.play('fire');

                    const js = this.m_target.getComponent('msItem');
                    if (js != null) {
                        js.subHP(this.m_ATK);
                    }
                }
            })
            .to(0.25, { position: new Vec3(0, -15, 0) })
            .call(() => {
                this.hideBullet();
            })
            .to(0.25, { position: new Vec3(0, 0, 0) })
            .call(() => {
                if (this.m_effectEnd) {
                    //this.node.stopAllActions();
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
        this.m_effectEnd = false;
        if (this.m_effect != null) {
            this.m_fireAction.start();
        }
        this.m_target = target;
        this.m_bullet['_attackTarget'] = this.m_target;
    }

    endFire() {
        this.m_effectEnd = true;
    }

    showBullet() {
        this.m_bullet.active = true;
        this.m_effect.node.active = true;

        const world_pos = this.node.getWorldPosition();
        const pos = BulletManager.instance.node.getComponent(UITransform).convertToNodeSpaceAR(world_pos);
        this.m_bullet.setPosition(pos);

        const js = this.m_bullet.getComponent(bullet_1);
        js.setATK(this.m_ATK);
        js.updateBullet();
    }

    hideBullet() {
        this.m_bullet.active = false;
        this.m_effect.node.active = false;
    }

    createBoomEffect(target: Node) {
        const boom = instantiate(this.m_boomEffect);
        target.addChild(boom);
        boom.active = true;
        const boomAnim = boom.getComponent(Animation);
        boomAnim.play('boom');
        boomAnim.on(Animation.EventType.FINISHED, () => {
            boom.removeFromParent();
        });
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

    private onEffectEnd() {
        this.m_effect.node.active = false;
    }
}
