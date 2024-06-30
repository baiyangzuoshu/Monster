import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

import { UIComponent } from '../../../Framework/Scripts/UI/UIComponent';
import { PhysicsSystem2D } from 'cc';
import { EPhysics2DDrawFlags } from 'cc';
import { v2 } from 'cc';
import { SpriteAtlas } from 'cc';
import { Vec2 } from 'cc';
import { Sprite } from 'cc';
import { GameManager } from '../Manager/GameManager';
import { BundleName } from '../Constants';
import { ResManager } from '../../../Framework/Scripts/Managers/ResManager';
import { tween } from 'cc';
import { v3 } from 'cc';
import { CrownManager } from '../../../script/crownBuild';

@ccclass('UIGameUICtrl')
export class UIGameUICtrl extends UIComponent {
    private m_imageAtlas: SpriteAtlas = null;

    private startPos: Vec2[] = [];
    private m_mapBlockItem: Sprite[][][] = [];


    private blockMaps:Node=null;

    protected onLoad(): void {
        this.blockMaps=this.ViewNode("blockMaps");
    }
    
    start(): void {
        //
        PhysicsSystem2D.instance.enable = true;

        PhysicsSystem2D.instance.debugDrawFlags = EPhysics2DDrawFlags.Aabb |
        EPhysics2DDrawFlags.Pair |
        EPhysics2DDrawFlags.CenterOfMass |
        EPhysics2DDrawFlags.Joint |
        EPhysics2DDrawFlags.Shape;

        PhysicsSystem2D.instance.debugDrawFlags = EPhysics2DDrawFlags.None;
        //end
        this.startPos.push(v2(0, 0));
        this.startPos.push(v2(640, 0));

        this.Init();
    }

    async Init() {
        this.m_imageAtlas=await ResManager.Instance.IE_GetAsset(BundleName.Atlas,"block-1",SpriteAtlas) as SpriteAtlas;
        console.log("block-1 atlas loaded!",this.m_imageAtlas);

        const blockMapData = GameManager.instance.getCurBlockData();
        this.buildBlockMap(0, blockMapData);
    }

    buildBlockNextMap(blockMapData: number[][]) {
        if (blockMapData == null) {
            return;
        }
        this.buildBlockMap(1, blockMapData);
    }

    buildBlockMap(index: number, blockMapData: number[][]) {
        if (this.m_mapBlockItem[index] == null) {
            this.m_mapBlockItem[index] = [];
        }

        for (let j = 0; j < 6; j++) {
            const y = j * 106;
            if (this.m_mapBlockItem[index][j] == null) {
                this.m_mapBlockItem[index][j] = [];
            }
            for (let i = 0; i < 6; i++) {
                const x = i * 106;
                let block: Node;
                if (this.m_mapBlockItem[index][j][i] == null) {
                    block = new Node();
                    this.blockMaps.addChild(block);
                } else {
                    block = this.m_mapBlockItem[index][j][i].node;
                }
                const startX=x + 106 / 2 + this.startPos[index].x;
                const startY=-y - 106 / 2 + this.startPos[index].y
                block.setPosition(startX, startY);

                const com = block.getComponent(Sprite) || block.addComponent(Sprite);
                com['_selfIndex'] = v2(i, j);

                this.m_mapBlockItem[index][j][i] = com;
                const name = '' + blockMapData[j][i];
                const frame = this.m_imageAtlas.getSpriteFrame(name);
                com.spriteFrame = frame;
            }
        }
    }

    moveToNextMap(data: number[][]) {
        tween(this.node)
            .by(0.5, { position: v3(-640, 0) })
            .call(() => {
                this.node.setPosition(v3(-320, 310));
                this.buildBlockMap(0, data);
            })
            .start();
        
        
        CrownManager.instance.moveToNextMap();
    }
}
