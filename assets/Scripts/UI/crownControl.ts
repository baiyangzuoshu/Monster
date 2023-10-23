// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { UIControl } from "../../FrameWork/ui/UIControl";

const {ccclass, property} = cc._decorator;

@ccclass
export default class CrownControl extends UIControl {
    m_crown:cc.Node=null;
    m_diamond:cc.Node=null;
    m_light:cc.Node=null;
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        super.onLoad();

        this.m_crown=this.getChildByUrl("map_zhongdian_3");
        this.m_diamond=this.getChildByUrl("map_zhongdian_1");
        this.m_light=this.getChildByUrl("map_zhongdian_2");

        this.moveUpDown(this.m_crown,5);
        this.moveUpDown(this.m_diamond,-5);
        this.moveUpDown(this.m_light,-5);

        this.m_light.setScale(cc.v2(0.6,0.6));
        var scaleTo = cc.scaleTo(0.5,1.2,1.2)
        var fade = cc.fadeTo(0.5,100);
        var sp = cc.spawn(scaleTo,fade);

        var seq2 = cc.sequence(sp,cc.callFunc(function(){
            this.m_light.setScale(cc.v2(0.6,0.6));
            this.m_light.opacity = 255;
        }.bind(this)));

        this.m_light.runAction(cc.repeatForever(seq2));
    }

    moveUpDown(node,offset){
        var pos = node.getPosition();
        var moveUp = cc.moveTo(1,cc.v2(pos.x,pos.y+offset));
        var moveDown = cc.moveTo(1,cc.v2(pos.x,pos.y-offset));
        node.runAction(cc.repeatForever(cc.sequence(moveUp,moveDown)));
    }
}
