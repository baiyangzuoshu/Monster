import { _decorator, Component, Node, Animation, Vec2, v2, sequence, delayTime, callFunc } from 'cc';
import { BulletBase } from './bulletBase';
const { ccclass, property } = _decorator;

@ccclass('Bullet')
export class Bullet extends BulletBase {

    private m_showHpEffect: boolean | null = null;

    start() {
        // Initialization code here
    }

    onCollisionEnter(other: any, self: any) {
        if (!this.node['isDead']) {
            if (this.node['_attackTarget'] == null) {
                return;
            }
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
                this.node['isDead'] = true;
                anim.play('boom');
                const seq = sequence(
                    delayTime(0.01),
                    callFunc(() => {
                        this.node.setScale(v2(1, 1));
                    }),
                    delayTime(0.5),
                    callFunc(() => {
                        this.node.removeFromParent();
                        this.node.destroy();
                    })
                );
                this.node.runAction(seq);
            }
        }
    }

    update(dt: number) {
        const bullet = this.node;
        if (bullet['isDead']) {
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

        this.node.angle = angle;

        bullet.setPosition(bullet.position.x + x, bullet.position.y + y);
    }
}

export default Bullet;

function getAngle(startPos: Vec2, endPos: Vec2): number {
    const dx = endPos.x - startPos.x;
    const dy = endPos.y - startPos.y;
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
    return angle;
}
