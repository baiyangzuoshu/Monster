// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { ResManager } from "../FrameWork/manager/ResManager";
import { ResManagerPro } from "../FrameWork/manager/ResManagerPro";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameApp extends cc.Component {
    private static _instance:GameApp=null
    private canvas:cc.Node=null
    private progressBar:cc.ProgressBar=null
    private Loading:cc.Node=null
    // LIFE-CYCLE CALLBACKS:

    public static getInstance():GameApp{
        return GameApp._instance
    }

    public enterGame():void{
        
    }

    public async startGame(){
        await ResManagerPro.Instance.IE_LoadBundleAndAllAssets("data",cc.JsonAsset);
        this.progressBar.progress=0.3;
        await ResManagerPro.Instance.IE_LoadBundleAndAllAssets("texture",cc.SpriteFrame);
        this.progressBar.progress=0.5;
        await ResManagerPro.Instance.IE_LoadBundleAndAllAssets("Sounds",cc.AudioClip);
        this.progressBar.progress=0.8;
        await ResManagerPro.Instance.IE_LoadBundleAndAllAssets("prefabs",cc.Prefab);
        this.progressBar.progress=1;
        this.Loading.active=false;
    }

    onLoad () {
        if(null===GameApp._instance){
            GameApp._instance=this
        }
        else{
            this.destroy()
            return
        }

        this.canvas=cc.find("Canvas")
        this.Loading=this.canvas.getChildByName("Loading");
        this.progressBar=this.Loading.getChildByName("myProgressBar").getComponent(cc.ProgressBar)
        this.progressBar.progress=0
    }

    start () {

    }

    // update (dt) {}
}
