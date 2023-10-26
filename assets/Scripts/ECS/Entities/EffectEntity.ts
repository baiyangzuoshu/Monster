import AnimateComponent from "../Components/AnimateComponent";
import BaseComponent from "../Components/BaseComponent";
import TransformComponent from "../Components/TransformComponent";
import UnitComponent from "../Components/UnitComponent";

export default class EffectEntity {
    public baseComponent:BaseComponent=new BaseComponent();
    public animateComponent:AnimateComponent=new AnimateComponent();
    public transformComponent:TransformComponent=new TransformComponent();
    public unitComponent:UnitComponent=new UnitComponent();
    
}
