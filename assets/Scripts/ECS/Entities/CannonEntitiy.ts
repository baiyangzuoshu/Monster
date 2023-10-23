import AttackComponent from "../Components/AttackComponent";
import BaseComponent from "../Components/BaseComponent";
import RoleComponent from "../Components/RoleComponent";
import TransformComponent from "../Components/TransformComponent";
import UnitComponent from "../Components/UnitComponent";

export default class CannonEntitiy{
    public baseComponent:BaseComponent=new BaseComponent();
    public transformComponent:TransformComponent=new TransformComponent();
    public roleComponent:RoleComponent=new RoleComponent();
    public unitComponent:UnitComponent=new UnitComponent();
    public attackComponent:AttackComponent=new AttackComponent();
}
