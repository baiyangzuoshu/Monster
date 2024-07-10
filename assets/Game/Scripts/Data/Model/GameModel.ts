import { _decorator, Component, Node } from 'cc';
import { IModel } from '../DataModelManager';
const { ccclass, property } = _decorator;

export enum GameState{
    None,
    Playering,
    Pause,
    End,
}

export class GameModel implements IModel {
    private _state:GameState=GameState.None;

    public get state(){
        return this._state;
    }

    public set state(value:GameState){
        this._state=value;
    }
}


