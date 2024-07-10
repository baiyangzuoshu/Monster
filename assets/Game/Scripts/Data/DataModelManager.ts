import { _decorator, Component, Node } from 'cc';
import { PlayerModel } from './Model/PlayerModel';
import { GameModel } from './Model/GameModel';
const { ccclass, property } = _decorator;

export interface IModel{
    
}

export enum ModelName{
    Player='Player',
    Game='Game',
}

@ccclass('DataModelManager')
export class DataModelManager extends Component {
    private static _instance:DataModelManager=null;

    public static get instance(){
        return this._instance;
    }

    private models:Map<ModelName,IModel>=new Map();

    onLoad() {
        if(DataModelManager._instance){
            this.destroy();
            return;
        }

        DataModelManager._instance=this;    
    }

    public Init(){
        DataModelManager.instance.registerModel(ModelName.Player,PlayerModel);
        DataModelManager.instance.registerModel(ModelName.Game,GameModel);
    }

    public registerModel(key:ModelName,modelClass:new()=>IModel){
        let model=new modelClass();
        this.models.set(key,model);
    }

    public getModel(key:ModelName):IModel{
        return this.models.get(key);
    }
}


