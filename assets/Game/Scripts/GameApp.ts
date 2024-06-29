import { Component, Node, TextAsset, find } from 'cc';
import { SceneManager } from '../../Framework/Scripts/Managers/SceneManager';
import { TimerManager } from '../../Framework/Scripts/Managers/TimerManager';
import { UIManager } from '../../Framework/Scripts/Managers/UIManager';


export class GameApp extends Component {
    public static Instance: GameApp = null;

    protected onLoad(): void {
        if(GameApp.Instance !== null) {
            this.destroy();
            return;
        }

        GameApp.Instance = this;
    }

    public Init(): void {

    }

    public async EnterGame() {
        console.log("EnterGame #######");
        SceneManager.Instance.IE_RunScene("main");
        
        UIManager.Instance.IE_ShowUIView("UIGame");
    }
}


