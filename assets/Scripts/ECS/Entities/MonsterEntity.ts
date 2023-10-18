import BaseComponent from "../Components/BaseComponent";
import NavComponent from "../Components/NavComponent";
import TransformComponent from "../Components/TransformComponent";
import UnitComponent from "../Components/UnitComponent";

export default class MonsterEntity  {
    public baseComponent:BaseComponent=new BaseComponent();
    public transformComponent:TransformComponent=new TransformComponent();
    public navComponent:NavComponent=new NavComponent();
    public unitComponent:UnitComponent=new UnitComponent();
}
