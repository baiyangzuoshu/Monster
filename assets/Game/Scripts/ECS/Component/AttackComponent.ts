import { _decorator, Component, Node, Prefab, instantiate, NodePool, Vec3, tween, Tween } from 'cc';

export class AttackComponent {
    public m_attackTarget:Node|null=null;
    public m_bFire:boolean=false;
    public m_fireTime:number=0;
}


