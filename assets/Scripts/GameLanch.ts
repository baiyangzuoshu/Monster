// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { EventManager } from "../FrameWork/manager/EventManager";
import { ExcelManager } from "../FrameWork/manager/ExcelManager";
import { ResManager } from "../FrameWork/manager/ResManager";
import { ResManagerPro } from "../FrameWork/manager/ResManagerPro";
import { UIManager } from "../FrameWork/manager/UIManager";
import { UIManagerPro } from "../FrameWork/manager/UIManagerPro";
import DataManager from "./data/DataManager";
import IntensifyDataManager from "./data/IntensifyDataManager";
import TaskDataManager from "./data/TaskDataManager";
import ECSFactory from "./ECS/ECSFactory";
import ECSManager from "./ECS/ECSManager";
import EntityUtils from "./ECS/EntityUtils";
import AISystem from "./ECS/Systems/AISystem";
import AnimateSystem from "./ECS/Systems/AnimateSystem";
import AttackSystem from "./ECS/Systems/AttackSystem";
import CollectHitSystem from "./ECS/Systems/CollectHitSystem";
import NavSystem from "./ECS/Systems/NavSystem";
import GameApp from "./GameApp";
import MapDataManager from "./Manager/MapDataManager";
import PlayerDataManager from "./Manager/PlayerDataManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameLanch extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
         //框架
         this.addComponent(ExcelManager)
         this.addComponent(EventManager)
         this.addComponent(UIManagerPro)
         this.addComponent(ResManagerPro)
         //游戏
         this.addComponent(GameApp)

         this.addComponent(AnimateSystem)
         this.addComponent(EntityUtils)
         this.addComponent(NavSystem)
         this.addComponent(PlayerDataManager).load();
         this.addComponent(DataManager)
         this.addComponent(MapDataManager)
         this.addComponent(ECSFactory)
         this.addComponent(ECSManager)
         this.addComponent(IntensifyDataManager);
         this.addComponent(TaskDataManager);
         this.addComponent(AISystem);
         this.addComponent(CollectHitSystem);
         this.addComponent(AttackSystem);
    }

    start () {
        GameApp.getInstance().startGame()
    }

    // update (dt) {}
}
