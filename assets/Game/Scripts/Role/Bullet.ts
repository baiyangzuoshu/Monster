import { UITransform } from 'cc';
import { UIComponent } from '../../../Framework/Scripts/UI/UIComponent';
import { _decorator, Component, Node } from 'cc';
import { getAngle } from '../../../script/utlis';
import { Size } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Bullet')
export class Bullet extends UIComponent {
    public getSize():Size {
        return this.node.getComponent(UITransform).contentSize;
    }
}


