// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { EventManager } from "../FrameWork/manager/EventManager";
import { ExcelManager } from "../FrameWork/manager/ExcelManager";
import FGUIManager from "../FrameWork/manager/FGUIManager";
import { ResManager } from "../FrameWork/manager/ResManager";
import { UIManager } from "../FrameWork/manager/UIManager";
import NetEventManager from "../FrameWork/net/NetEventManager";
import NetWebsocketManager from "../FrameWork/net/NetWebsocketManager";
import GameApp from "./GameApp";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameLanch extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
         //框架
         this.addComponent(FGUIManager)
         this.addComponent(ExcelManager)
         //this.addComponent(NetWebsocketManager)
         this.addComponent(EventManager)
         this.addComponent(ResManager)
         this.addComponent(UIManager)
         //this.addComponent(NetEventManager)
         //游戏
         this.addComponent(GameApp)
    }

    start () {
        GameApp.getInstance().startGame()
    }

    // update (dt) {}
}
