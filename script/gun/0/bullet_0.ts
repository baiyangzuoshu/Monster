import { _decorator, Component, Node, Vec2, Vec3 } from 'cc';
import { BulletBase } from './bulletBase';
const { ccclass, property } = _decorator;

@ccclass('Bullet')
export class Bullet extends BulletBase {

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
        if (bullet['isDead'] || bullet['_attackTarget'] == null) {
            return;
        }

        const target = bullet['_attackTarget'];
        const targetPos = target.getPosition();

        const bulletPos = bullet.convertToWorldSpaceAR(new Vec3(0, 0, 0));
        const worldTargetPos = target.convertToWorldSpaceAR(new Vec3(0, 0, 0));

        const targetH = target.height;
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

        this.m_bullet.width = dis;
    }
}

export default Bullet;

function getAngle(startPos: Vec3, endPos: Vec3): number {
    const dx = endPos.x - startPos.x;
    const dy = endPos.y - startPos.y;
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
    return angle;
}

function getDistance(startPos: Vec3, endPos: Vec3): number {
    const dx = endPos.x - startPos.x;
    const dy = endPos.y - startPos.y;
    return Math.sqrt(dx * dx + dy * dy);
}
