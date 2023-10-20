import AnimateComponent from "../Components/AnimateComponent";
import BaseComponent from "../Components/BaseComponent";
import NavComponent from "../Components/NavComponent";
import RoleComponent from "../Components/RoleComponent";
import ShapeComponent from "../Components/ShapeComponent";
import TransformComponent from "../Components/TransformComponent";
import UnitComponent from "../Components/UnitComponent";

export default class MonsterEntity  {
    public baseComponent:BaseComponent=new BaseComponent();
    public transformComponent:TransformComponent=new TransformComponent();
    public navComponent:NavComponent=new NavComponent();
    public unitComponent:UnitComponent=new UnitComponent();
    public roleComponent:RoleComponent=new RoleComponent();
    public animateComponent:AnimateComponent=new AnimateComponent();
    public shapeComponent:ShapeComponent=new ShapeComponent();
}
