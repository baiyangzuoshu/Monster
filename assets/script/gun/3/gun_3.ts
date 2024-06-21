import { _decorator, Component, Node, instantiate, v2, Sprite, Vec2, tween, Tween, TweenSystem } from 'cc';
import GunBase from '../gunBase';
import { v3 } from 'cc';
import { GameManager } from '../../../script/game';
import BulletManager from '../../../script/bulletBuild';
import { UITransform } from 'cc';
import { Vec3 } from 'cc';
import { bullet_3 } from './bullet_3';
import { getAngle } from '../../../script/utlis';
const { ccclass, property } = _decorator;

@ccclass('gun_3')
export class gun_3 extends GunBase {

    @property(Node)
    m_bullet: Node = null;

    private m_effectEnd: boolean = false;
    
    private m_target: any;
   
    

    onLoad() {
        this.m_effectEnd = false;
        this.m_fire = false;
    }

    start() {
        // Initialization code here
    }

    fire(target: any) {
        this.m_target = target;
        this.m_effectEnd = false;
        this.m_fire = true;
        this.runFireAction();
    }

    endFire() {
        this.m_effectEnd = true;
    }

    createBullet() {
        const bullet = instantiate(this.m_bullet);
        const js = bullet.getComponent(bullet_3);

        js.setFrame(this.node.getComponent(Sprite).spriteFrame);

        bullet['isDead'] = false;
        bullet.active = true;
        bullet['_attackTarget'] = this.m_target;
        BulletManager.instance.node.addChild(bullet);

        let pos = this.node.getComponent(UITransform).convertToWorldSpaceAR(v3(0, 0));
        pos = BulletManager.instance.node.getComponent(UITransform).convertToNodeSpaceAR(pos);

        bullet.angle = getAngle(pos, this.m_target.getPosition()) - 90;
        bullet.setPosition(pos);

        js.setATK(this.m_ATK);
    }

    runFireAction() {
        TweenSystem.instance.ActionManager.removeAllActionsFromTarget(this.node);
        tween(this.node)
            .call(() => {
                if (!GameManager.instance.isGameStart()) {
                    this.endFire();
                    return;
                }
            })
            .to(0.25, { scale: v3(1.2, 0.8) })
            .call(() => {
                if (!GameManager.instance.isGameStart()) {
                    this.endFire();
                    return;
                }
                this.createBullet();
            })
            .to(0.1, { scale: v3(1, 1) })
            .call(() => {
                if (this.m_effectEnd) {
                    TweenSystem.instance.ActionManager.removeAllActionsFromTarget(this.node);
                    this.m_fire = false;
                    if (this.m_endCallBack != null) {
                        this.m_endCallBack(this.m_type);
                    }
                }
            })
            .union()
            .repeatForever()
            .start();
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


