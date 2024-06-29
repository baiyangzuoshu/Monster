import { ResManager } from '../../../Framework/Scripts/Managers/ResManager';
import { _decorator, Component, JsonAsset, v2, Vec2 } from 'cc';
import { BundleName } from '../Constants';
import { DataManager } from '../../../script/data/dataManager';
import BlockManager from '../../../script/blockMaps';
import { CrownManager } from '../../../script/crownBuild';
import { CannonManager } from '../../../script/cannonBuild';
import { g_GlobalData } from '../../../script/data/data';
import { MonsterBuild } from '../../../script/monsterBuild';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    private static _instance: GameManager = null;

    m_mapData: JsonAsset = null;

    private m_gameStart: boolean = false;

    static get instance(): GameManager {
        if (!GameManager._instance) {
            GameManager._instance = new GameManager();
        }
        return GameManager._instance;
    }

    onLoad() {
        GameManager._instance = this;
        this.m_gameStart = false;
        DataManager.load();
    }

    async Init() {
        // Initialization code
        this.m_mapData=await ResManager.Instance.IE_GetAsset(BundleName.Datas,"mapData",JsonAsset) as JsonAsset;
    }

    isGameStart() {
        return this.m_gameStart;
    }

    jumpNextMap(curData: any, nextData: any) {
        const data = this.getBlockDataByIndex(nextData.map.blockData);
        BlockManager.instance.buildBlockNextMap(data);
        BlockManager.instance.moveToNextMap(data);

        const pathData = this.getPathDataByIndex(nextData.map.blockData);
        if (pathData != null) {
            const endPos = pathData[pathData.length - 1];
            const calcPos = v2(endPos.x * 106 + 106 / 2, -endPos.y * 106 - 106 / 2);
            CrownManager.instance.setNextCrownPos(v2(calcPos.x + 640, calcPos.y));
        }
        CannonManager.instance.jumpNextMap();
        this.scheduleOnce(() => {
            this.playGame(false);
        }, 0.7);
    }

    playGame(isWinBoss: boolean = false) {
        let curData: any;
        let nextData: any;
        let isJumpMap = false;
        if (isWinBoss) {
            curData = g_GlobalData.getCurData();
            nextData = g_GlobalData.nextCheckPoint();
            isJumpMap = curData.map.blockData !== nextData.map.blockData;
        }

        this.m_gameStart = true;
        MonsterBuild.instance.destroyMonster();
        CannonManager.instance.clearAllCannonTarget();

        if (isJumpMap) {
            this.jumpNextMap(curData, nextData);
        } else {
            this.scheduleOnce(() => {
                MonsterBuild.instance.begin();
                CrownManager.instance.show();
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
