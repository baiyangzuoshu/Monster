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
import { Prefab } from 'cc';
import { instantiate } from 'cc';
import { Vec3 } from 'cc';

@ccclass('UIGameUICtrl')
export class UIGameUICtrl extends UIComponent {
    private m_imageAtlas: SpriteAtlas = null;

    private startPos: Vec2[] = [];
    private m_mapBlockItem: Sprite[][][] = [];


    private blockMaps:Node=null;
    private m_curCrown: Node = null;
    private m_nextCrown: Node = null;
    private m_crown: Prefab = null;
    private crownBuild:Node=null;
    
    protected onLoad(): void {
        this.blockMaps=this.ViewNode("blockMaps");
        this.crownBuild=this.ViewNode("crownBuild");
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

        const blockMapData = GameManager.instance.getCurBlockData();
        this.buildBlockMap(0, blockMapData);
        //
        this.m_crown=await ResManager.Instance.IE_GetAsset(BundleName.Prefabs,"crown",Prefab) as Prefab;
        this.buildEndPoint();
    }
    //
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
    //crown
    buildEndPoint() {
        const list = GameManager.instance.getCurPahtList();
        const lastPos = list[list.length - 1];

        const pos = new Vec2(0, 0);
        pos.x = lastPos.x * 106 + 106 / 2;
        pos.y = -lastPos.y * 106 - 106 / 2;

        if (this.m_curCrown == null) {
            this.m_curCrown = instantiate(this.m_crown);
            this.crownBuild.addChild(this.m_curCrown);
        }
        pos.y += 25;
        this.m_curCrown.setPosition(new Vec3(pos.x, pos.y, 0));
    }

    showCrownBuild() {
        this.crownBuild.active = true;
    }

    hideCrownBuild() {
        this.crownBuild.active = false;
    }

    setNextCrownPos(pos: Vec2) {
        if (this.m_nextCrown == null) {
            this.m_nextCrown = instantiate(this.m_crown);
            this.crownBuild.addChild(this.m_nextCrown);
        }
        pos.y += 25;
        this.m_nextCrown.setPosition(new Vec3(pos.x, pos.y, 0));
    }

    crownBuildmoveToNextMap() {
        const moveTo = { position: new Vec3(-640, 0, 0) };
        const callFunc = () => {
            this.crownBuild.setPosition(new Vec3(-320, 310, 0));
            this.buildEndPoint();
        };

        tween(this.crownBuild)
            .by(0.5, moveTo)
            .call(callFunc)
            .start();
    }
    //
}
