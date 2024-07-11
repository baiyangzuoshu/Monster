import { AttackComponent } from "../Component/AttackComponent";
import { CollisionComponent } from "../Component/CollisionComponent";
import { TransformComponent } from "../Component/TransformComponent";
import { BaseEntity } from "./BaseEntity";

export class BulletEntity extends BaseEntity {
    public transformComponent:TransformComponent=new TransformComponent();
    public attackComponent:AttackComponent=new AttackComponent();
    public collisionComponent:CollisionComponent=new CollisionComponent();
}


