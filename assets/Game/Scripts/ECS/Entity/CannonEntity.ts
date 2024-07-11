import { AttackComponent } from "../Component/AttackComponent";
import { GunComponent } from "../Component/GunComponent";
import { BaseEntity } from "./BaseEntity";

export class CannonEntity extends BaseEntity {
    public gunComponent:GunComponent=new GunComponent();
    public attackComponent:AttackComponent=new AttackComponent();
}

