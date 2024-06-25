import { _decorator, Component, Node, Sprite, Animation, Tween, tween, Vec2, v2, SpriteFrame } from 'cc';
import BulletBase from '../bulletBase';
import { getAngle } from '../../../script/utlis';
import { Collider2D } from 'cc';
import { Contact2DType } from 'cc';
import { MonsterItem } from '../../../script/msItem';
import { UITransform } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('bullet_3')
export class bullet_3 extends BulletBase {

    @property(Sprite)
    m_cannon: Sprite = null;

    @property(Node)
    m_effect: Node = null;

    private m_showHpEffect: boolean | null = null;

    onLoad() {
        this.isDead = false;
        let collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onCollisionEnter, this);
        }
    }

    onCollisionEnter(other: any, self: any) {
        if (!this.isDead) {
            if (other.node['_monsterID'] != this._attackTarget['_monsterID']) {
                return;
            }

            if (this.m_showHpEffect == null) {
                const js = other.node.parent.getComponent(MonsterItem);
                if (js != null) {
                    js.subHP(this.node['m_ATK']);
                }
                this.m_showHpEffect = true;
            }

            const anim = this.m_cannon.node.getComponent(Animation);
            if (anim != null) {
                this.isDead = true;
                anim.play('boom');
                tween(this.node)
                    .call(() => {
                        this.m_effect.active = false;
                    })
                    .delay(0.5)
                    .call(() => {
                        this.node.removeFromParent();
                        this.node.destroy();
                    })
                    .start();
            }
        }
    }

    start() {
        // Initialization code here
    }

    update(dt: number) {
        const bullet = this.node;
        if (this.isDead) return;

        if (this._attackTarget == null) return;

        const move = 500 * dt;

        const target = this._attackTarget;
        const targetH = target.getComponent(UITransform).height;
        const moveToPos = target.getPosition();
        moveToPos.y += targetH / 2;
        const angle = getAngle(bullet.getPosition(), moveToPos);

        const x = Math.cos(angle * (Math.PI / 180)) * move;
        const y = Math.sin(angle * (Math.PI / 180)) * move;

        bullet.angle = angle - 90;

        bullet.setPosition(bullet.position.x + x, bullet.position.y + y);
    }

    setFrame(frame: SpriteFrame) {
        this.m_cannon.spriteFrame = frame;
    }
}


