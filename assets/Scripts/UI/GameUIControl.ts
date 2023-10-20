// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { UIControl } from "../../FrameWork/ui/UIControl";
import IntensifyDataManager from "../data/IntensifyDataManager";
import ECSManager from "../ECS/ECSManager";
import { Intensify } from "../Enum";
import MapDataManager from "../Manager/MapDataManager";
import PlayerDataManager from "../Manager/PlayerDataManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameUIControl extends UIControl {
    private m_canMakeCount:number = 10;
    private m_maxMakeCount:number = 10;
    private m_hammerAction = false;
    private m_waterAction = false;
    private m_water:cc.Node = null;
    private m_hammer:cc.Node = null;
    private m_makeNumberLabel:cc.Label = null;
    private m_cannonList = [];

    onLoad () {
        super.onLoad();
        this.m_water=this.getChildByUrl("bottom/make/ui_build_water");
        this.m_hammer=this.getChildByUrl("bottom/make/ui_build_hammer");
        this.m_makeNumberLabel=this.getChildByUrl("bottom/make/num").getComponent(cc.Label);

        this.updateGameUI();

        this.registerBottomBtn();
    }

    start () {
        var _cannonList = MapDataManager.getInstance().getCurCannonPoint();
        for (let i = 0; i < _cannonList.length; i++) {
            this.m_cannonList[i] = this.createCannonData();
            this.m_cannonList[i].pos = _cannonList[i];
        }
    }

    createCannonData(){
        var obj:any= {};
        obj.pos = cc.v2(0,0);
        obj.cannon = null;
        return obj;
    }

    getCanMakeIndex(){
        for (let i = 0; i < this.m_cannonList.length; i++) {
            if(this.m_cannonList[i].cannon == null ){
                return i;
            }
        }
        return null;
    }

    addMakeNumber(){
        this.m_canMakeCount++;
        if( this.m_canMakeCount > this.m_maxMakeCount ){
            this.m_canMakeCount = this.m_maxMakeCount;
        }
        this.updateMakeCount();
    }

    subMakeNumber(){
        this.m_canMakeCount--;
        if( this.m_canMakeCount < 0 ){
            this.m_canMakeCount = 0;
        }
        if( !this.m_waterAction ){
            this.m_water.height = 0;
        }
        this.updateMakeCount();
    }

    updateMakeCount(){
        this.m_makeNumberLabel.string = '' + this.m_canMakeCount + '/' + this.m_maxMakeCount;
    }

    update (dt) {
        if( this.m_canMakeCount < this.m_maxMakeCount){
            this.m_water.height += dt*50;
            this.m_waterAction = true;
            if ( this.m_water.height >= 133 ){
                this.addMakeNumber();
                if( this.m_canMakeCount == this.m_maxMakeCount){
                    this.m_water.height = 133;
                    this.m_waterAction = false;
                }else{
                    this.m_water.height = 0;
                }
            }
        }
    }

    updateGameUI(){
        if( !this.m_waterAction ){
            this.m_water.height = 0;
        }
        
        var lv = PlayerDataManager.getInstance().getInternsifLevel(Intensify.INTENSIFY_KUORONG);
        this.m_maxMakeCount = IntensifyDataManager.getInstance().getValue(Intensify.INTENSIFY_KUORONG,lv);
        this.updateMakeCount();
    }

    registerBottomBtn(){
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
            var index = this.getCanMakeIndex();
            if( index == null ){
                return;
            }
            if( this.m_canMakeCount == 0){
                return;
            }
            if(!this.m_hammerAction ){
                var  rot1 = cc.rotateTo(0.2,-90);
                var rot2 = cc.rotateTo(0.2,0);
                var callFunc = cc.callFunc(function(){
                    this.m_hammerAction = false;
                }.bind(this));
                var seq = cc.sequence(rot1,rot2,callFunc);
                this.m_hammer.runAction(seq);

                this.m_hammerAction = true;
            }
            
            this.subMakeNumber();
            
            let cannonEntity=await ECSManager.getInstance().createCannonEntity(index,22);
            this.m_cannonList[index].cannon=cannonEntity;
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

}


