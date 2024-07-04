import { _decorator, Component, Node, Prefab, instantiate, NodePool, Vec3, tween, Tween } from 'cc';
import { BUFFER_QUANPINGGONGJI } from './define';
import { getDistance } from './utlis';
import { GameManager } from '../Game/Scripts/Manager/GameManager';

import { g_GlobalData } from './data/data';
import { SkillManager } from './gameUI/skillBuffer';
import { MonsterItem } from './msItem';
import { GUI } from '../Game/Scripts/Constants';
import { UIManager } from '../Framework/Scripts/Managers/UIManager';
const { ccclass, property } = _decorator;

@ccclass('MonsterBuild')
export class MonsterBuild extends Component {

    @property(Prefab)
    m_msItemPrefab: Prefab = null;

    private m_currentLevel: number = 0;
    private m_monsterIndex: number = 0;
    private enemyPool: NodePool = new NodePool();
    private static _instance: MonsterBuild = null;

    public static get instance(): MonsterBuild {
        return this._instance;
    }

    onLoad() {
        MonsterBuild._instance = this;

        this.schedule(() => {
            this.sortMonsterList();
        }, 0.5);

        GameManager.instance.playGame();
    }

    start() {
        // Initialization code here
    }

    setGameEndSpeed() {
        for (let i = 0; i < this.node.children.length; i++) {
            const msItem = this.node.children[i].getComponent(MonsterItem);
            if (msItem.isDead()) continue;
            if (!msItem.m_diamond.active) {
                let speed = msItem.getSpeed();
                speed += g_GlobalData.gameEndMonsterSpeed;
                msItem.setSlow(false);
                msItem.setSpeed(speed);
            }
        }
    }

    setAllSlow(bSlow: boolean) {
        for (let i = 0; i < this.node.children.length; i++) {
            const msItem = this.node.children[i].getComponent(MonsterItem);
            if (msItem.isDead()) continue;
            if (!msItem.m_diamond.active) {
                msItem.setSlow(bSlow);
            }
        }
    }

    begin() {
        if (g_GlobalData.isCurBossAttack()) {
            UIManager.Instance.IE_ShowUIView(GUI.UIBoss);
            //return;
        }
        this.beginCreate();
    }

    beginCreate() {
        let index = 0;
        const list = GameManager.instance.getCurPahtList();
        const levelData = g_GlobalData.getCurMonsterData();
        g_GlobalData.setCurMonsterCount(levelData.length);

        let seq = tween(this.node);
        
        for (let i = 0; i < levelData.length; i++) {
            const offset = Math.random();
            seq = seq.delay(0.2 + offset).call(() => {
                if (index >= levelData.length) {
                    return;
                }
                const speed = levelData[index].speed;
                const node = this.createMonsterByData(levelData[index], list);
                const js = node.getComponent(MonsterItem);
                js.go(speed);
                if (SkillManager.instance.bufferState[BUFFER_QUANPINGGONGJI]) {
                    js.setSlow(true);
                }
                index++;
            });
        }
        seq.start();
    }

    destroyMonster() {
        while (this.node.children.length) {
            const node = this.node.children[0];
            node.removeFromParent();
            node.destroy();
        }
    }

    createTest() {
        const list = GameManager.instance.getCurPahtList();
        const type = randomNum(0, 2);
        const counts = [10, 15, 18];
        const index = randomNum(0, counts[type]);

        const hp = 1000000;
        const gold = 1000;
        const node = this.createMonster(type, index, list, hp, gold);
        const js = node.getComponent(MonsterItem);
        js.go(100);
        g_GlobalData.addCurMonsterCount();
    }

    createMonsterByData(data: any, list: any) {
        const type = data.type;
        const id = data.id;
        const hp = data.hp;
        const gold = data.gold;
        return this.createMonster(type, id, list, hp, gold);
    }

    createMonster(type: number, index: number, list: any, hp: number, gold: number = 0) {
        let enemy: Node;
        if (this.enemyPool.size() > 0) {
            enemy = this.enemyPool.get();
        } else {
            enemy = instantiate(this.m_msItemPrefab);
        }
     
        this.node.addChild(enemy);
        const js = enemy.getComponent(MonsterItem);
        js.setImage(type, index);
        js.setPath(list);
        js.setID(this.m_monsterIndex);
        js.setMaxHP(hp);
        js.setDeadGold(gold);
        this.m_monsterIndex++;
        return enemy;
    }

    killMonster(node: Node) {
        this.enemyPool.put(node);
    }

    sortMonsterList() {
        if (this.node.children.length < 2) {
            return;
        }

        this.node.children.sort((a, b) => {
            if (a.position.y - b.position.y > 0.001) {
                return -1;
            } else if (a.position.y === b.position.y) {
                return 0;
            }
            return 1;
        });

        for (let i = 0; i < this.node.children.length; i++) {
            this.node.children[i].setSiblingIndex(i);
        }
    }

    calcNearDistance(cannon: Node) {
        let minDis = 9999;
        let minMonster:Node = null;
        let curDis = 230;
        if (SkillManager.instance.bufferState[BUFFER_QUANPINGGONGJI]) {
            curDis *= 10;
        }
        for (let i = 0; i < this.node.children.length; i++) {
            if (this.node.children[i].getComponent(MonsterItem).isDead()) continue;
            const dis = getDistance(this.node.children[i].getPosition(), cannon.getPosition());
            if (dis < curDis && dis < Math.abs(minDis)) {
                minDis = dis;
                minMonster = this.node.children[i];
            }
        }
        return minMonster;
    }
}

function randomNum(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
