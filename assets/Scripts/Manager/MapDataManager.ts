// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { ResManagerPro } from "../../FrameWork/manager/ResManagerPro";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MapDataManager extends cc.Component {
    private static _instance:MapDataManager=null
    private cannonList:Array<any>=null;
    private mapBlockData:Array<any>=null;
    private pathList:Array<any>=null;
    private startPos:Array<cc.Vec2>=[];
    private m_mapBlockItem:Array<any>=[];
    private blockMaps:cc.Node=null;

    public static getInstance():MapDataManager{
        return MapDataManager._instance
    }

    onLoad () {
        if(null===MapDataManager._instance){
            MapDataManager._instance=this
        }
        else{
            this.destroy()
            return
        }

        this.startPos = [];
        this.m_mapBlockItem = [];
        this.startPos.push(cc.v2(0,0));
        this.startPos.push(cc.v2(640,0));
        let canvas=cc.find("Canvas");
        this.blockMaps=canvas.getChildByName("Game").getChildByName("blockMaps");
    }

    getCurPahtList(){
        var index = 1;
        if(index >= this.pathList.length){
            index = this.pathList.length-1;
        }
        return this.pathList[index];
    }

    getCurBlockData(){
        var index = 1;
        if(index >= this.mapBlockData.length){
            index = this.mapBlockData.length-1;
        }
        return this.mapBlockData[index];
    }
    getCurCannonPoint(){
        return this.cannonList;
    }
    getBlockDataByIndex(index){
        if( this.mapBlockData[index] != null){
            return this.mapBlockData[index];
        }
        return null;
    }
    getPathDataByIndex(index){
        if(index >= this.pathList[index]!= null ){
            return this.pathList[index];
        }
        return null;
    }

    async loadData():Promise<void>{
        let data:cc.JsonAsset=await ResManagerPro.Instance.IE_GetAsset("data","mapData",cc.JsonAsset) as cc.JsonAsset
        let jsonData=data.json
        this.cannonList=jsonData._cannonList;
        this.mapBlockData=jsonData._mapBlockData;
        this.pathList=jsonData._pathList;
    }

    async buildBlockMap(index:number,blockMapData:Array<any>){
        if(this.m_mapBlockItem[index] == null ){
            this.m_mapBlockItem[index]=[];
        }
        
        for (let j = 0; j < 6; j++) {
            var y = j*106;
            if( this.m_mapBlockItem[index][j] == null ){
                this.m_mapBlockItem[index][j]=[]
            }

            for (let i = 0; i < 6; i++) {
                var x = i * 106;
                
                var block = null;
                if( this.m_mapBlockItem[index][j][i] == null ){
                    block = new cc.Node;
                    this.blockMaps.addChild(block);
                }else{
                    block = this.m_mapBlockItem[index][j][i].node;
                }
                block.x = x + 106/2;
                block.y = -y - 106/2;
                block.x += this.startPos[index].x;
                block.y += this.startPos[index].y;
                
                var com = block.addComponent(cc.Sprite) as cc.Sprite;

                this.m_mapBlockItem[index][j][i] = com;
                var name = ''+blockMapData[j][i];

                var blockAtlas = await ResManagerPro.Instance.IE_GetAsset("texture","block/block-1",cc.SpriteAtlas) as cc.SpriteAtlas
                com.spriteFrame = blockAtlas.getSpriteFrame(name)
            }
        }
    }
}
