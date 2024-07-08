import { _decorator, Component, Node } from 'cc';
import { PlayerModel } from './Model/PlayerModel';
const { ccclass, property } = _decorator;

export interface IModel{
    
}

export enum ModelName{
    Player='Player',
}

@ccclass('DataManager')
export class DataManager extends Component {
    private static _instance:DataManager=null;

    public static get instance(){
        return this._instance;
    }

    private models:Map<ModelName,IModel>=new Map();

    onLoad() {
        if(DataManager._instance){
            this.destroy();
            return;
        }

        DataManager._instance=this;    
    }

    public Init(){
        DataManager.instance.registerModel(ModelName.Player,PlayerModel);
    }

    public registerModel(key:ModelName,modelClass:new()=>IModel){
        let model=new modelClass();
        this.models.set(key,model);
    }

    public getModel(key:ModelName):IModel{
        return this.models.get(key);
    }
}


