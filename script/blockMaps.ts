import { _decorator, Component, Node, SpriteAtlas, Sprite, Vec2, v2, moveBy, callFunc, sequence } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BlockMap')
export class BlockMap extends Component {

    @property([SpriteAtlas])
    m_imageAtlas: SpriteAtlas[] = [];

    @property([Sprite])
    m_imageBG: Sprite[] = [];

    private startPos: Vec2[] = [];
    private m_mapBlockItem: Sprite[][][] = [];

    onLoad() {
        window['g_blockMap'] = this;
        cc.director.getCollisionManager().enabled = true;

        this.startPos.push(v2(0, 0));
        this.startPos.push(v2(640, 0));

        const blockMapData = g_game.getCurBlockData();
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
                block.setPosition(x + 106 / 2 + this.startPos[index].x, -y - 106 / 2 + this.startPos[index].y);

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
        const moveTo = moveBy(0.5, v2(-640, 0));
        const callFuncAction = callFunc(() => {
            this.node.setPosition(v2(-320, 310));
            this.buildBlockMap(0, data);
        });

        this.node.runAction(sequence(moveTo, callFuncAction));
        g_crown.moveToNextMap();
    }
}

export default BlockMap;
