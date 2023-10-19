// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { UIControl } from "../../FrameWork/ui/UIControl";
import ECSManager from "../ECS/ECSManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameUIControl extends UIControl {

    onLoad () {
        super.onLoad();

        this.buttonAddClickEvent("bottom/make/make",this.clickBtnEvent,this);
        this.buttonAddClickEvent("bottom/make/autoMake",this.clickBtnEvent,this);
        this.buttonAddClickEvent("bottom/intensify",this.clickBtnEvent,this);
        this.buttonAddClickEvent("bottom/shop",this.clickBtnEvent,this);
        this.buttonAddClickEvent("bottom/destroy",this.clickBtnEvent,this);
        this.buttonAddClickEvent("bottom/cannon",this.clickBtnEvent,this);
        this.buttonAddClickEvent("bottom/task/bt",this.clickBtnEvent,this);
        this.buttonAddClickEvent("bottom/buffer/skill_coin0",this.clickBtnEvent,this);
        this.buttonAddClickEvent("bottom/buffer/skill_coin1",this.clickBtnEvent,this);
        this.buttonAddClickEvent("bottom/buffer/skill_coin2",this.clickBtnEvent,this);
        this.buttonAddClickEvent("bottom/buffer/skill_coin3",this.clickBtnEvent,this);
    }

    async clickBtnEvent(btn:cc.Button){
        console.log("clickBtnEvent",btn.name);
        if("make<Button>"==btn.name){
            await ECSManager.getInstance().createCannonEntity(0,1);
        }
        else if("autoMake<Button>"==btn.name){

        }
        else if("intensify<Button>"==btn.name){

        }
        else if("shop<Button>"==btn.name){

        }
        else if("destroy<Button>"==btn.name){

        }
        else if("cannon<Button>"==btn.name){

        }
        else if("bt<Button>"==btn.name){

        }
        else if("skill_coin0<Button>"==btn.name){

        }
        else if("skill_coin1<Button>"==btn.name){

        }
        else if("skill_coin2<Button>"==btn.name){

        }
        else if("skill_coin3<Button>"==btn.name){
            
        }

    }

    start () {

    }

    // update (dt) {}
}
