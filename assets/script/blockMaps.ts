import { _decorator, Component, Node, SpriteAtlas, Sprite, Vec2, v2, director, tween } from 'cc';
import { v3 } from 'cc';
import { CrownManager } from './crownBuild';
import { PhysicsSystem2D } from 'cc';
import { EPhysics2DDrawFlags } from 'cc';
import { GameManager } from '../Game/Scripts/Manager/GameManager';
const { ccclass, property } = _decorator;

@ccclass('BlockManager')
export class BlockManager extends Component {

    @property([SpriteAtlas])
    m_imageAtlas: SpriteAtlas[] = [];

    @property([Sprite])
    m_imageBG: Sprite[] = [];

    private static _instance: BlockManager = null;
    private startPos: Vec2[] = [];
    private m_mapBlockItem: Sprite[][][] = [];

    public static get instance(): BlockManager {
        return this._instance;
    }

    onLoad() {
        BlockManager._instance = this;
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

        const blockMapData = GameManager.instance.getCurBlockData();
        this.buildBlockMap(0, blockMapData);
    }

    start() {
        // Initialization code here
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
                    this.node.addChild(block);
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
                const frame = this.m_imageAtlas[0].getSpriteFrame(name);
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

export default BlockManager;
