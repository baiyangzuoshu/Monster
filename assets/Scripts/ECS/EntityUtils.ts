// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import BaseComponent from "./Components/BaseComponent";

const {ccclass, property} = cc._decorator;

@ccclass
export default class EntityUtils extends cc.Component {

    private static _instance:EntityUtils=null
    public static getInstance():EntityUtils{
        return EntityUtils._instance
    }

    onLoad () {
        if(null===EntityUtils._instance){
            EntityUtils._instance=this
        }
        else{
            this.destroy()
            return
        }
    }

    updateMonsterDirection(start:cc.Vec3,end:cc.Vec3,baseComponent:BaseComponent){
        if( end.x > start.x){
            baseComponent.gameObject.getChildByName("item").getChildByName("scale").getChildByName("right").active=true;
            baseComponent.gameObject.getChildByName("item").getChildByName("scale").getChildByName("left").active=false;
        }else if( end.x < start.x){
            baseComponent.gameObject.getChildByName("item").getChildByName("scale").getChildByName("right").active=false;
            baseComponent.gameObject.getChildByName("item").getChildByName("scale").getChildByName("left").active=true;
        }
    }
}
