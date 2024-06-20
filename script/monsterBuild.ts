import { _decorator, Component, Node, Prefab, instantiate, NodePool, director, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MonsterBuild')
export class MonsterBuild extends Component {

    @property(Prefab)
    m_msItemPrefab: Prefab = null;

    private m_currentLevel: number = 0;
    private m_monsterIndex: number = 0;
    private enemyPool: NodePool = new NodePool();

    onLoad() {
        window['g_monsterBuild'] = this;

        this.schedule(() => {
            this.sortMonsterList();
        }, 0.5);

        g_game.playGame();
    }

    start() {

    }

    // 设置所有怪物结束时的移动速度，加快速度
    setGameEndSpeed() {
        for (let i = 0; i < this.node.children.length; i++) {
            const msItem = this.node.children[i].getComponent('msItem');
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
            const msItem = this.node.children[i].getComponent('msItem');
            if (msItem.isDead()) continue;
            if (!msItem.m_diamond.active) {
                msItem.setSlow(bSlow);
            }
        }
    }

    begin() {
        if (g_GlobalData.isCurBossAttack()) {
            g_gameUI.playBossViewAnim(this.beginCreate.bind(this));
            return;
        }
        this.beginCreate();
    }

    beginCreate() {
        let index = 0;
        const list = g_game.getCurPahtList();
        const levelData = g_GlobalData.getCurMonsterData();
        g_GlobalData.setCurMonsterCount(levelData.length);
        const actionList = [];
        for (let i = 0; i < levelData.length; i++) {
            const offset = Math.random();
            const seq = cc.sequence(
                cc.delayTime(0.2 + offset),
                cc.callFunc(() => {
                    if (index >= levelData.length) {
                        return;
                    }
                    const speed = levelData[index].speed;
                    const node = this.createMonsterByData(levelData[index], list);
                    const js = node.getComponent('msItem');
                    js.go(speed);
                    if (g_bufferState[BUFFER_GUAIWUJIANSHU]) {
                        js.setSlow(true);
                    }
                    index++;
                })
            );
            actionList.push(seq);
        }
        const seqList = cc.sequence(...actionList);
        this.node.runAction(seqList);
    }

    destroyMonster() {
        while (this.node.children.length) {
            const node = this.node.children[0];
            node.removeFromParent();
            node.destroy();
        }
    }

    createTest() {
        const list = g_game.getCurPahtList();
        const type = randomNum(0, 2);
        const counts = [10, 15, 18];
        const index = randomNum(0, counts[type]);

        const hp = 1000000;
        const gold = 1000;
        const node = this.createMonster(type, index, list, hp, gold);
        const js = node.getComponent('msItem');
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

    // type 0: 小怪物 1: 中型怪物 2: boss
    // index: 怪物图片名
    // 起始点
    createMonster(type: number, index: number, list: any, hp: number, gold: number = 0) {
        let enemy: Node;
        if (this.enemyPool.size() > 0) {
            enemy = this.enemyPool.get();
        } else {
            enemy = instantiate(this.m_msItemPrefab);
        }
        enemy['isDead'] = false;
        this.node.addChild(enemy);
        const js = enemy.getComponent('msItem');
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
            if (a.y - b.y > 0.001) {
                return -1;
            } else if (a.y === b.y) {
                return 0;
            }
            return 1;
        });

        for (let i = 0; i < this.node.children.length; i++) {
            this.node.children[i].zIndex = i;
        }
    }

    calcNearDistance(cannon: Node) {
        let minDis = 9999;
        let minMonster = null;
        let curDis = 230;
        if (g_bufferState[BUFFER_QUANPINGGONGJI]) {
            curDis *= 10;
        }
        for (let i = 0; i < this.node.children.length; i++) {
            if (this.node.children[i]['isDead']) continue;
            const dis = getDistance(this.node.children[i].getPosition(), cannon.getPosition());
            if (dis < curDis && dis < Math.abs(minDis)) {
                minDis = dis;
                minMonster = this.node.children[i];
            }
        }
        return minMonster;
    }
});
