import { _decorator, Component, JsonAsset, v2, Vec2 } from 'cc';
import { dataManager } from './dataManager';
const { ccclass, property } = _decorator;

@ccclass('Game')
export class Game extends Component {

    @property(JsonAsset)
    m_mapData: JsonAsset = null;

    private m_gameStart: boolean = false;

    onLoad() {
        // @ts-ignore
        window.g_game = this;
        this.m_gameStart = false;

        // @ts-ignore
        window.g_dataManager = dataManager();
        g_dataManager.load();
    }

    start() {
    }

    isGameStart() {
        return this.m_gameStart;
    }

    jumpNextMap(curData: any, nextData: any) {
        const data = this.getBlockDataByIndex(nextData.map.blockData);
        // @ts-ignore
        g_blockMap.buildBlockNextMap(data);
        // @ts-ignore
        g_blockMap.moveToNextMap(data);

        const pathData = this.getPathDataByIndex(nextData.map.blockData);
        if (pathData != null) {
            const endPos = pathData[pathData.length - 1];
            const calcPos = v2(endPos.x * 106 + 106 / 2, -endPos.y * 106 - 106 / 2);
            // @ts-ignore
            g_crown.setNextCrownPos(v2(calcPos.x + 640, calcPos.y));
        }
        // @ts-ignore
        g_cannonBuild.jumpNextMap();
        this.scheduleOnce(() => {
            this.playGame(false);
        }, 0.7);
    }

    playGame(isWinBoss: boolean = false) {
        let curData: any;
        let nextData: any;
        let isJumpMap = false;
        if (isWinBoss) {
            // @ts-ignore
            curData = g_GlobalData.getCurData();
            // @ts-ignore
            nextData = g_GlobalData.nextCheckPoint();
            isJumpMap = curData.map.blockData !== nextData.map.blockData;
        }

        this.m_gameStart = true;
        // @ts-ignore
        g_monsterBuild.destroyMonster();
        // @ts-ignore
        g_cannonBuild.clearAllCannonTarget();

        if (isJumpMap) {
            this.jumpNextMap(curData, nextData);
        } else {
            this.scheduleOnce(() => {
                // @ts-ignore
                g_monsterBuild.begin();
                // @ts-ignore
                g_crown.show();
            }, 0.5);
        }
    }

    stopGame() {
        this.m_gameStart = false;
    }

    getCurPahtList() {
        let index = g_GlobalData.getCurBlockDataID();
        if (index >= this.m_mapData.json._pathList.length) {
            index = this.m_mapData.json._pathList.length - 1;
        }
        return this.m_mapData.json._pathList[index];
    }

    getCurBlockData() {
        let index = g_GlobalData.getCurBlockDataID();
        if (index >= this.m_mapData.json._mapBlockData.length) {
            index = this.m_mapData.json._mapBlockData.length - 1;
        }
        return this.m_mapData.json._mapBlockData[index];
    }

    getCurCannonPoint() {
        return this.m_mapData.json._cannonList;
    }

    getBlockDataByIndex(index: number) {
        if (this.m_mapData.json._mapBlockData[index] != null) {
            return this.m_mapData.json._mapBlockData[index];
        }
        return null;
    }

    getPathDataByIndex(index: number) {
        if (index >= this.m_mapData.json._pathList[index] != null) {
            return this.m_mapData.json._pathList[index];
        }
        return null;
    }
}
