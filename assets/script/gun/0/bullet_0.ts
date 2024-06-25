import { _decorator, Component, Node, Vec2, Vec3 } from 'cc';
import BulletBase from '../bulletBase';
import { UITransform } from 'cc';
import { getAngle, getDistance } from '../../../script/utlis';
const { ccclass, property } = _decorator;

@ccclass('bullet_0')
export class bullet_0 extends BulletBase {

    @property(Node)
    m_bullet: Node = null;

    onLoad() {
        // Initialization code here
    }

    start() {
        // Initialization code here
    }

    update(dt: number) {
        this.updateBullet();
    }

    updateBullet() {
        const bullet = this.node;
        if (this.isDead || this._attackTarget == null) {
            return;
        }

        const target = this._attackTarget;
        const targetPos = target.getPosition();

        const bulletPos = bullet.getComponent(UITransform).convertToWorldSpaceAR(new Vec3(0, 0, 0));
        const worldTargetPos = target.getComponent(UITransform).convertToWorldSpaceAR(new Vec3(0, 0, 0));

        const targetH = target.getComponent(UITransform).height;
        worldTargetPos.y += targetH / 2;
        const angle = getAngle(bulletPos, worldTargetPos);
        this.node.angle = angle;

        const dis = getDistance(bulletPos, worldTargetPos);
        this.showEffect(Math.abs(dis));
    }

    showEffect(dis: number) {
        if (dis < 90) {
            dis = 90;
        }

        this.m_bullet.getComponent(UITransform).width = dis;
    }
}


