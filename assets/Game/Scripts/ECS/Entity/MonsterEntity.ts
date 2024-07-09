import { NaviComponent } from "../Component/NaviComponent";
import { RoleComponent } from "../Component/RoleComponent";
import { TransformComponent } from "../Component/TransformComponent";
import { BaseEntity } from "./BaseEntity";

export class MonsterEntity extends BaseEntity {
    public navCompnent:NaviComponent=new NaviComponent();
    public transformComponent:TransformComponent=new TransformComponent();
    public roleComponent:RoleComponent=new RoleComponent();
}

