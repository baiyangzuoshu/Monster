import { UITransform } from 'cc';
import { UIComponent } from '../../../Framework/Scripts/UI/UIComponent';
import { _decorator, Component, Node } from 'cc';
import { getAngle } from '../../../script/utlis';
const { ccclass, property } = _decorator;

@ccclass('Bullet')
export class Bullet extends UIComponent {
    private _attackTarget:Node=null;

    public setTarget(target) {
        this._attackTarget = target;
    }

    update(dt: number) {
        
    }
}


