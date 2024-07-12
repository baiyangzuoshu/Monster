import { ResManager } from '../../../Framework/Scripts/Managers/ResManager';
import { ProgressBar } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { BundleName } from '../Constants';
import { JsonAsset } from 'cc';
import { SceneAsset } from 'cc';
import { SpriteAtlas } from 'cc';
import { Prefab } from 'cc';
import { SceneManager } from '../../../Framework/Scripts/Managers/SceneManager';
import { UIManager } from '../../../Framework/Scripts/Managers/UIManager';
const { ccclass, property } = _decorator;

@ccclass('startScene')
export class startScene extends Component {
    @property(ProgressBar)
    public progressBar: ProgressBar = null;

    async start() {
        this.progressBar.progress = 0.2;
        await ResManager.Instance.IE_LoadBundleAndAllAssets(BundleName.GUI,Prefab);
        
        this.progressBar.progress = 0.5;
        await ResManager.Instance.IE_LoadBundleAndAllAssets(BundleName.Atlas,SpriteAtlas);

        this.progressBar.progress = 0.65;
        
        await ResManager.Instance.IE_LoadBundleAndAllAssets(BundleName.Datas,JsonAsset);
        this.progressBar.progress = 0.8;
        await ResManager.Instance.IE_LoadBundleAndAllAssets(BundleName.Prefabs,Prefab);

        this.progressBar.progress = 1;

        this.progressBar.node.active = false;

        SceneManager.Instance.EnterScene("main");
    
        await UIManager.Instance.IE_ShowUIView("UIGame");
    }

    update(deltaTime: number) {
        
    }
}


