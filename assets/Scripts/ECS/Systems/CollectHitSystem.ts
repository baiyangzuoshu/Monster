import { UnitState } from "../../Enum"
import AttackComponent from "../Components/AttackComponent"
import BaseComponent from "../Components/BaseComponent"
import RoleComponent from "../Components/RoleComponent"
import ShapeComponent from "../Components/ShapeComponent"
import TransformComponent from "../Components/TransformComponent"
import UnitComponent from "../Components/UnitComponent"
import AttackSystem from "./AttackSystem"

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

    onUpdate(atk:number,hitPos:cc.Vec2,bulletRoleComponent:RoleComponent,bulletShapeComponent:ShapeComponent,bulletTransformComponent:TransformComponent,bulletUnitComponent:UnitComponent,
        monsterUnitComponent:UnitComponent,monsterBaseComponent:BaseComponent,monsterAttackComponent:AttackComponent) {
        
        let x=bulletTransformComponent.x-0
        let y=bulletTransformComponent.y-bulletShapeComponent.height/2

        let rect=new cc.Rect(x,y,bulletShapeComponent.width,bulletShapeComponent.height);
        if(rect.contains(hitPos)){
            AttackSystem.getInstance().attackStartAction(atk,bulletUnitComponent,monsterUnitComponent,monsterBaseComponent,monsterAttackComponent);
            return true;
        }

        return false;
    }
}
