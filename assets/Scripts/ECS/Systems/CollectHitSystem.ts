import ShapeComponent from "../Components/ShapeComponent"
import TransformComponent from "../Components/TransformComponent"
import UnitComponent from "../Components/UnitComponent"

export default class CollectHitSystem extends cc.Component {

    private static _instance:CollectHitSystem=null
    public static getInstance():CollectHitSystem{
        return CollectHitSystem._instance
    }

    onLoad () {
        if(null===CollectHitSystem._instance){
            CollectHitSystem._instance=this
        }
        else{
            this.destroy()
            return
        }
    }

    onUpdate (dt:number,hitPos:cc.Vec2,shapeComponent:ShapeComponent,transformComponent:TransformComponent,unitComponent:UnitComponent) {
        if(unitComponent.isDead){
            return;
        }

        let rect=new cc.Rect(transformComponent.x-shapeComponent.width/2,transformComponent.y-shapeComponent.height/2,shapeComponent.width,shapeComponent.height);
        if(rect.contains(hitPos)){
            return true;
        }

        return false;
    }
}
