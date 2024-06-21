import { _decorator, Component, Node, Animation, Vec3 } from 'cc';
import BulletBase from '../bulletBase';
import { UITransform } from 'cc';
import { getAngle, getDistance } from '../../../script/utlis';
const { ccclass, property } = _decorator;

@ccclass('bullet_1')
export class bullet_1 extends BulletBase {

    @property([Animation])
    m_anim: Animation[] = [];

    private m_widths: number[] = [];
    private m_heights: number[] = [];

    onLoad() {
        this.m_widths = [];
        this.m_heights = [];
        for (let i = 0; i < this.m_anim.length; i++) {
            this.m_widths[i] = this.m_anim[i].node.getComponent(UITransform).width;
            this.m_heights[i] = this.m_anim[i].node.getComponent(UITransform).height;
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
        const targetPos = target.getWorldPosition();

        const bulletPos = bullet.getWorldPosition();
        const worldTargetPos = target.getWorldPosition();

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
        this.m_anim[index].node.setScale(pro, pro, 1);
    }
}

