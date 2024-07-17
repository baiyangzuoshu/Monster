import { SceneManager } from '../../../Framework/Scripts/Managers/SceneManager';
import { UIManager } from '../../../Framework/Scripts/Managers/UIManager';
import { _decorator, Component, Node } from 'cc';
import { ttSDK } from '../SDK/ttSDK';
const { ccclass, property } = _decorator;

@ccclass('loginScene')
export class loginScene extends Component {
    start() {
        ttSDK.checkUpdate();
    }

    async clickLogin() {
        SceneManager.Instance.EnterScene("main");
    
        await UIManager.Instance.IE_ShowUIView("UIGame");
    }
}


