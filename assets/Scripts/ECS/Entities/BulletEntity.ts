import AnimateComponent from "../Components/AnimateComponent";
import BaseComponent from "../Components/BaseComponent";
import RoleComponent from "../Components/RoleComponent";
import ShapeComponent from "../Components/ShapeComponent";
import TransformComponent from "../Components/TransformComponent";
import UnitComponent from "../Components/UnitComponent";

export default class BulletEntity{
    public roleComponent:RoleComponent=new RoleComponent();
    public unitComponent:UnitComponent=new UnitComponent();
    public transformComponent:TransformComponent=new TransformComponent();
    public baseComponent:BaseComponent=new BaseComponent();
    public shapeComponent:ShapeComponent=new ShapeComponent();
    public animateComponent:AnimateComponent=new AnimateComponent();
}
