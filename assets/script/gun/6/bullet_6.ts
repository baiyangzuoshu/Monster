import { _decorator, Component, Node, Animation, Vec2, tween, v3 } from 'cc';
import BulletBase from '../bulletBase';
import { getAngle } from '../../../script/utlis';
import { UITransform } from 'cc';
import { Collider2D } from 'cc';
import { Contact2DType } from 'cc';
import { MonsterItem } from '../../../script/msItem';
const { ccclass, property } = _decorator;

@ccclass('bullet_6')
export class bullet_6 extends BulletBase {

    private m_showHpEffect: boolean  = false;
    private isDead: boolean = false;

    start() {
        // Initialization code here
        // 注册单个碰撞体的回调函数
        let collider = this.getComponent(Collider2D);
        if (collider) {
            collider.on(Contact2DType.BEGIN_CONTACT, this.onCollisionEnter, this);
        }
    }

    onCollisionEnter(self: Collider2D, other: Collider2D) {
        if (!this.isDead) {
            if (other.node['_monsterID'] != this.node['_attackTarget']['_monsterID']) {
                return;
            }
            if (this.m_showHpEffect == false) {
                const js = other.node.parent.getComponent(MonsterItem);
                if (js != null) {
                    js.subHP(this.m_ATK);
                }
                else{
                    console.log("ts not found");
                }
                this.m_showHpEffect = true;
            }

            const anim = this.node.getComponent(Animation);
            if (anim != null) {
                this.isDead = true;
                anim.play('boom');
                tween(this.node)
                    .delay(0.5)
                    .destroySelf()
                    .start();
            }
        }
    }

    update(dt: number) {
        const bullet = this.node;
        if (this.isDead) {
            return;
        }
        const target = bullet['_attackTarget'];
        if (target == null) return;

        const move = 500 * dt;

        const targetH = target.getComponent(UITransform).height;
        const moveToPos = target.getPosition();
        moveToPos.y += targetH / 2;
        const angle = getAngle(bullet.getPosition(), moveToPos);

        const x = Math.cos(angle * (Math.PI / 180)) * move;
        const y = Math.sin(angle * (Math.PI / 180)) * move;

        bullet.setPosition(bullet.position.x + x, bullet.position.y + y);
    }
}


