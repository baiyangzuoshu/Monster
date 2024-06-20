import { _decorator, Component, Node, Sprite, Animation, Vec2, v2, sequence, callFunc, delayTime } from 'cc';
import { BulletBase } from './bulletBase';
const { ccclass, property } = _decorator;

@ccclass('Bullet')
export class Bullet extends BulletBase {

    @property(Sprite)
    m_cannon: Sprite = null;

    @property(Node)
    m_effect: Node = null;

    private isDead: boolean = false;
    private m_showHpEffect: boolean | null = null;

    onLoad() {
        this.isDead = false;
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

            const anim = this.m_cannon.node.getComponent(Animation);
            if (anim != null) {
                this.isDead = true;
                anim.play('boom');
                const seq = sequence(
                    callFunc(() => {
                        this.m_effect.active = false;
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

    start() {
        // Initialization code here
    }

    update(dt: number) {
        const bullet = this.node;
        if (this.isDead) return;

        if (bullet['_attackTarget'] == null) return;

        const move = 500 * dt;

        const target = bullet['_attackTarget'];
        const targetH = target.height;
        const moveToPos = target.getPosition();
        moveToPos.y += targetH / 2;
        const angle = getAngle(bullet.getPosition(), moveToPos);

        const x = Math.cos(angle * (Math.PI / 180)) * move;
        const y = Math.sin(angle * (Math.PI / 180)) * move;

        bullet.angle = angle - 90;

        bullet.x += x;
        bullet.y += y;
    }

    setFrame(frame: SpriteFrame) {
        this.m_cannon.spriteFrame = frame;
    }
}

export default Bullet;

function getAngle(startPos: Vec2, endPos: Vec2): number {
    const dx = endPos.x - startPos.x;
    const dy = endPos.y - startPos.y;
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
    return angle;
}
