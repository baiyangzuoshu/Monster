import { _decorator, Component, Node, Animation, Vec2, tween, v3 } from 'cc';
import BulletBase from '../bulletBase';
import { getAngle } from '../../../script/utlis';
const { ccclass, property } = _decorator;

@ccclass('bullet_6')
export class bullet_6 extends BulletBase {

    private m_showHpEffect: boolean | null = null;
    private isDead: boolean = false;

    start() {
        // Initialization code here
    }

    onCollisionEnter(other: any, self: any) {
        if (!this.isDead) {
            if (other.node['_monsterID'] != this.node['_attackTarget']['_monsterID']) {
                return;
            }
            if (this.m_showHpEffect == null) {
                const js = other.node.parent.getComponent('msItem');
                if (js != null) {
                    js.subHP(this.node['m_ATK']);
                }
                this.m_showHpEffect = true;
            }

            const anim = this.node.getComponent(Animation);
            if (anim != null) {
                this.isDead = true;
                anim.play('boom');
                tween(this.node)
                    .delay(0.5)
                    .call(() => {
                        this.node.removeFromParent();
                        this.node.destroy();
                    })
                    .start();
            }
        }
    }

    update(dt: number) {
        const bullet = this.node;
        if (this.isDead) {
            return;
        }
        if (bullet['_attackTarget'] == null) return;

        const move = 500 * dt;

        const target = bullet['_attackTarget'];
        const targetH = target.height;
        const moveToPos = target.getPosition();
        moveToPos.y += targetH / 2;
        const angle = getAngle(bullet.getPosition(), moveToPos);

        const x = Math.cos(angle * (Math.PI / 180)) * move;
        const y = Math.sin(angle * (Math.PI / 180)) * move;

        bullet.setPosition(bullet.position.x + x, bullet.position.y + y);
    }
}

