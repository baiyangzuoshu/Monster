import { SkillManager } from "../../../../script/gameUI/skillBuffer";
import { getAngle, getDistance } from "../../../../script/utlis";
import { BUFFER_QUANPINGGONGJI } from "../../../../script/define";
import { CannonEntity } from "../Entity/CannonEntity";
import { _decorator, Component, Node, Prefab, instantiate, NodePool, Vec3, tween, Tween } from 'cc';
import { v3 } from "cc";
import { Cannon } from "../../Role/Cannon";

export class AttackSystem  {
    public static cannonAttackUpdate(cannonEntity:CannonEntity,dt: number) {
        const cannonNode=cannonEntity.baseCompnent.gameObject;
        const cannonTS=cannonNode.getComponent(Cannon);

        if (cannonEntity.attackComponent.m_attackTarget != null) {
            const dis = getDistance(cannonEntity.attackComponent.m_attackTarget.getPosition(), v3(cannonNode.getPosition().x, cannonNode.getPosition().y));
            let curDis = 230;
            if (SkillManager.instance.bufferState[BUFFER_QUANPINGGONGJI]) {
                curDis *= 10;
            }
            if (Math.abs(dis) > curDis) {
                cannonEntity.attackComponent.m_attackTarget=null;
                return;
            }
            const start = cannonNode.getPosition();
            const end = cannonEntity.attackComponent.m_attackTarget.getPosition();
            let angle = getAngle(v3(start.x,start.y), end);
            angle += 360;
            angle -= 90;
            if (cannonEntity.attackComponent.m_bFire) {
                cannonTS.setRot(angle);
            } else {
                let moveAngle = 300 * dt;
                if (cannonTS.m_gunNode.angle > angle || angle - cannonTS.m_gunNode.angle > 180) {
                    moveAngle = -moveAngle;
                }
                cannonTS.m_gunNode.angle += moveAngle;
                if (cannonTS.m_gunNode.angle < 0) cannonTS.m_gunNode.angle += 360;
                if (Math.abs(cannonTS.m_gunNode.angle - angle) < Math.abs(moveAngle)) {
                    cannonEntity.attackComponent.m_bFire = true;
                    cannonTS.beginFire();
                    cannonTS.setRot(angle);
                }
            }
        }
    }
}


