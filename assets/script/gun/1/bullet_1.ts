import { _decorator, Component, Node, Animation, Vec3, v2 } from 'cc';
import { BulletBase } from './bulletBase';
const { ccclass, property } = _decorator;

@ccclass('Bullet')
export class Bullet extends BulletBase {

    @property([Animation])
    m_anim: Animation[] = [];

    private m_widths: number[] = [];
    private m_heights: number[] = [];

    onLoad() {
        this.m_widths = [];
        this.m_heights = [];
        for (let i = 0; i < this.m_anim.length; i++) {
            this.m_widths[i] = this.m_anim[i].node.width;
            this.m_heights[i] = this.m_anim[i].node.height;
        }
    }

    start() {
        // Initialization code here
    }

    update(dt: number) {
        this.updateBullet();
    }

    updateBullet() {
        const bullet = this.node;
        if (bullet['isDead']) {
            return;
        }
        const target = bullet['_attackTarget'];
        const targetPos = target.getPosition();

        const bulletPos = bullet.convertToWorldSpaceAR(v2(0, 0));
        const worldTargetPos = target.convertToWorldSpaceAR(v2(0, 0));

        const targetH = target.height;
        worldTargetPos.y += targetH / 2;
        const angle = getAngle(bulletPos, worldTargetPos);
        this.node.angle = angle;

        const dis = getDistance(bulletPos, worldTargetPos);

        if (Math.abs(dis) > 130) {
            this.showEffect(1, Math.abs(dis));
        } else {
            this.showEffect(0, Math.abs(dis));
        }
    }

    showEffect(index: number, dis: number) {
        for (let i = 0; i < this.m_anim.length; i++) {
            this.m_anim[i].node.active = false;
        }
        this.m_anim[index].node.active = true;

        const pro = dis / this.m_widths[index];
        this.m_anim[index].node.width = this.m_widths[index] * pro;
        this.m_anim[index].node.height = this.m_heights[index] * pro;
    }
}

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

export default Bullet;
