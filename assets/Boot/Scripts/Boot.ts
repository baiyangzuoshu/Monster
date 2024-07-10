import { _decorator, Component, director, Node } from 'cc';
import { GameApp } from '../../Game/Scripts/GameApp';
import { SceneManager } from '../../Framework/Scripts/Managers/SceneManager';
import { ResManager } from '../../Framework/Scripts/Managers/ResManager';
import { Debug } from '../../Framework/Scripts/Managers/Debug';
import { EventManager } from '../../Framework/Scripts/Managers/EventManager';
import { TimerManager } from '../../Framework/Scripts/Managers/TimerManager';
import { SoundManager } from '../../Framework/Scripts/Managers/SoundManager';
import { ExcelManager } from '../../Framework/Scripts/Managers/ExcelManager';
import { PoolManager } from '../../Framework/Scripts/Managers/PoolManager';
import { WsNetMgr } from '../../Framework/Scripts/Managers/WsNetMgr';
import { UIManager } from '../../Framework/Scripts/Managers/UIManager';
import { GameManager } from '../../Game/Scripts/Manager/GameManager';
import { ECSWorld } from '../../Game/Scripts/ECS/ECSWorld';
import { DataManager } from '../../Game/Scripts/Data/DataManager';
import { ProgressBar } from 'cc';
import { BundleName } from '../../Game/Scripts/Constants';
import { SpriteAtlas } from 'cc';
import { JsonAsset } from 'cc';
import { Prefab } from 'cc';


const { ccclass, property } = _decorator;

@ccclass('Boot')
export class Boot extends Component {
    
    public static Instance: Boot = null!;

    @property
    public isDebug: boolean = false;

    @property
    public useWebSocket: boolean = false;
    @property(ProgressBar)
    public progressBar:ProgressBar=null;

    protected onLoad(): void {
        if(Boot.Instance === null) {
            Boot.Instance = this;
        }
        else {
            this.destroy();
            return;
        }

        this.progressBar.progress = 0;
        this.node.addComponent(ResManager).Init();

        director.addPersistRootNode(this.node); // 不随场景切换而删除的节点
        this.StartUp();
    }

    private async StartUp() {
        await this.CheckHotUpdate();
        await this.InitFramework();
    }

    private async CheckHotUpdate() {
        this.progressBar.progress = 0.2;
        await ResManager.Instance.IE_LoadBundleAndAllAssets(BundleName.Datas,JsonAsset);
        
        this.progressBar.progress = 0.5;
        await ResManager.Instance.IE_LoadBundleAndAllAssets(BundleName.Atlas,SpriteAtlas);

        this.progressBar.progress = 0.65;
        await ResManager.Instance.IE_LoadBundleAndAllAssets(BundleName.GUI,Prefab);

        this.progressBar.progress = 0.8;
        await ResManager.Instance.IE_LoadBundleAndAllAssets(BundleName.Prefabs,Prefab);

        this.progressBar.progress = 1;

        this.progressBar.node.active = false;
    }

    
    private async InitFramework() {
        //
        
        this.node.addComponent(EventManager).Init();
        this.node.addComponent(UIManager).Init();
        this.node.addComponent(TimerManager).Init();
        this.node.addComponent(SoundManager).Init("Musics", "Sounds");
        this.node.addComponent(ExcelManager).Init();
        this.node.addComponent(PoolManager).Init();
        if(this.useWebSocket) {
            this.node.addComponent(WsNetMgr).Init();
        }
        this.node.addComponent(SceneManager).Init();
        // 初始化我们的日志管理模块
        if(this.isDebug) {
            await this.node.addComponent(Debug).Init();
        }
        // end
        //
        this.node.addComponent(DataManager).Init();
        await this.node.addComponent(GameManager).Init();
        this.node.addComponent(ECSWorld);
        //
        // 进入游戏
        this.node.addComponent(GameApp).Init();
        GameApp.Instance.EnterGame();
        // end
    }
}


