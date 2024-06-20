import { _decorator, Component, SpriteAtlas, Node, Sprite, Vec3, ProgressBar, v2, v3, CircleCollider, Label, instantiate } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MonsterItem')
export class MonsterItem extends Component {

    @property([SpriteAtlas])
    m_monsterTexture: SpriteAtlas[] = [];

    @property([Node])
    m_itemSprite: Node[] = [];

    @property(Node)
    m_itemNode: Node = null;

    @property(Node)
    m_scaleItem: Node = null;

    @property(ProgressBar)
    m_HpBar: ProgressBar = null;

    @property(Node)
    m_diamond: Node = null;

    @property(Node)
    m_slow: Node = null;

    private m_curMoveIndex: number = 0;
    private m_speed: number = 0;
    private m_defaultSpeed: number = 0;
    private m_Hp: number = 0;
    private m_maxHp: number = 0;
    private m_deadGold: number = 0;
    private _pathPos: Vec3[] = [];
    private m_moveAction: any = null;
    private m_type: number = 0;
    private m_index: number = 0;

    onLoad() {
        this.m_curMoveIndex = 0;
        this.node['isDead'] = false;
    }

    start() {

    }

    isDead(): boolean {
        return this.node['isDead'];
    }

    setImage(type: number, index: number) {
        if (type < 0 || type >= this.m_monsterTexture.length) {
            return;
        }
        const frame = this.m_monsterTexture[type].getSpriteFrame('' + index);
        if (!frame) {
            console.log('setImage:', type, ' index:', index);
            return;
        }
        this.m_type = type;
        this.m_index = index;
        let width: number;
        let height: number;
        for (let i = 0; i < this.m_itemSprite.length; i++) {
            const sprite = this.m_itemSprite[i].getComponent(Sprite);
            sprite.spriteFrame = frame;
            width = sprite.node.width;
            height = sprite.node.height;
        }

        this.updateCollider(width, height);
        this.updateHpSize(width, height);
    }

    updateDir(start: Vec3, end: Vec3) {
        if (end.x > start.x) {
            this.m_itemSprite[0].active = true;
            this.m_itemSprite[1].active = false;
        } else if (end.x < start.x) {
            this.m_itemSprite[0].active = false;
            this.m_itemSprite[1].active = true;
        }
    }

    setPath(pathList: Vec3[]) {
        this._pathPos = [];
        for (let i = 0; i < pathList.length; i++) {
            const x = pathList[i].x * 106 + 106 / 2;
            const y = -pathList[i].y * 106 - 106 / 2 - 35;
            this._pathPos.push(v3(x, y));
        }
        this.node.setPosition(this._pathPos[0]);

        this.updateDir(this._pathPos[0], this._pathPos[1]);
    }

    stopMoveAction() {
        if (!this.m_moveAction) return;
        this.node.stopAction(this.m_moveAction);
    }

    nextMove() {
        this.stopMoveAction();

        const start = this.node.getPosition();
        const end = this._pathPos[this.m_curMoveIndex + 1];
        if (end) {
            this.updateDir(start, end);
        }

        const dis = start.subtract(end).length();
        const time = dis / this.m_speed;
        const moveTo = cc.moveTo(time, end);
        const callFunc = cc.callFunc(() => {
            this.m_curMoveIndex++;
            if (this.m_curMoveIndex === this._pathPos.length - 1) {
                if (g_game.isGameStart()) {
                    this.m_diamond.active = true;
                    g_game.stopGame();
                    g_crown.hide();
                    g_monsterBuild.setGameEndSpeed();
                }
                this.gameEndAction();
            } else {
                this.nextMove();
            }
        });
        this.m_moveAction = cc.sequence(moveTo, callFunc);
        this.node.runAction(this.m_moveAction);
    }

    moveAction() {
        this.nextMove();
    }

    gameEndAction() {
        const list = g_game.getCurPahtList();
        const lastPos = list[0];

        const pos = v3(lastPos.x * 106 + 106 / 2, -lastPos.y * 106 - 106 / 2);
        const curPos = this.node.getPosition();
        const startPos = v3((pos.x - curPos.x) / 2 + curPos.x, curPos.y + 150);
        const moveTo1 = cc.moveTo(0.2, startPos);
        const moveTo2 = cc.moveTo(0.4, pos);
        const callFunc = cc.callFunc(() => {
            this.m_diamond.active = false;
            this.node.opacity = 0;
            this.node['isDead'] = true;
            g_GlobalData.subCurMonsterCount();
            if (g_GlobalData.getCurMonsterCount() <= 0) {
                g_gameUI.showFaild();
            }
        });

        this.node.setScale(v3(1, 1));
        const seq = cc.sequence(moveTo1, moveTo2, callFunc);
        const seqScale1 = cc.scaleTo(0.1, 1.2, 0.8);
        const seqScale2 = cc.scaleTo(0.1, 1, 1);
        const seqScale3 = cc.scaleTo(0.2, 0.8, 1.2);
        const seq2 = cc.sequence(seqScale1, seqScale2, seqScale3);

        this.node.runAction(cc.spawn(seq, seq2));
    }

    scaleAction() {
        const moveList = [];
        const scale = cc.scaleTo(0.5, 0.8, 1.2);
        const move = cc.moveBy(0.5, v3(0, 80));
        const sp = cc.spawn(scale, move);
        moveList.push(sp);

        const scale2 = cc.scaleTo(0.5, 1, 1);
        const move2 = cc.moveBy(0.5, v3(0, -80));
        const sp2 = cc.spawn(scale2, move2);
        moveList.push(sp2);

        const callFunc = cc.callFunc(() => {
            if (this.m_type > 0) {
                const moveScale1 = cc.scaleTo(0.5, 1.1, 0.9);
                const moveScale2 = cc.scaleTo(0.5, 0.9, 1.1);
                const seqMoveScale = cc.sequence(moveScale1, moveScale2);

                this.m_scaleItem.runAction(cc.repeatForever(seqMoveScale));
            } else {
                const jump1 = cc.moveBy(0.2, v3(0, 30));
                const jump2 = cc.moveBy(0.2, v3(0, -30));
                const seqJump = cc.sequence(jump1, jump2);

                this.m_itemNode.runAction(cc.repeatForever(seqJump));
            }
        });
        moveList.push(callFunc);
        const seq = cc.sequence(...moveList);
        this.m_itemNode.runAction(seq);
    }

    getSpeed(): number {
        return this.m_speed;
    }

    setSpeed(speed: number) {
        this.m_speed = speed;
        this.nextMove();
    }

    defaultSpeed() {
        this.m_speed = this.m_defaultSpeed;
        this.nextMove();
    }

    go(speed: number) {
        this.m_speed = speed;
        this.m_defaultSpeed = speed;

        this.moveAction();
        this.scaleAction();
    }

    updateHpSize(width: number, height: number) {
        this.m_HpBar.node.width = width;
        this.m_HpBar.node.y = height;
        this.m_HpBar.totalLength = width;
    }

    updateCollider(width: number, height: number) {
        const box = this.m_itemNode.getComponent(CircleCollider);
        box.radius = width * 0.8 / 2;
        box.offset.y = height / 2;
    }

    setID(id: number) {
        this.m_itemNode['_monsterID'] = id;
        this.node['_monsterID'] = id;
    }

    setMaxHP(hp: number) {
        this.m_Hp = hp;
        this.m_maxHp = hp;
    }

    setDeadGold(gold: number) {
        this.m_deadGold = gold;
    }

    subHP(hp: number) {
        if (!g_game.isGameStart() || this.node['isDead']) {
            return;
        }
        if (hp == null) {
            console.log('攻击力未定义');
            return;
        }
        if (g_bufferState[BUFFER_GONGJIFANBEI]) {
            hp *= 2;
        }
        let double = false;
        if (Math.random() * 1000 <= 500) {
            const lv = g_dataManager.getInternsifLevel(INTENSIFY_BAOJI);
            const doubleValue = g_intensifyData.getValue(INTENSIFY_BAOJI, lv);
            hp = hp * 2 + hp * (doubleValue / 100);
            hp = hp + hp * (doubleValue / 100);
            hp = parseFloat(hp.toFixed(2));
            double = true;
        }

        this.m_Hp -= hp;
        if (this.m_Hp <= 0) {
            this.node.stopAllActions();
            this.m_HpBar.progress = 0;
            this.node['isDead'] = true;
            this.node.opacity = 0;
            const pos = this.node.getPosition();
            g_effectBuild.createDeadEffect(pos);
            let cale_gold = this.m_deadGold;
            if (g_bufferState[BUFFER_JINBIFANBEI]) {
                cale_gold *= 2;
            }
            if (cale_gold > 0) {
                g_coinFly.createCoinToTip(this.node, (gold: number) => {
                    g_dataManager.addGold(gold);
                    g_gameUI.updateGameUI();
                }, cale_gold);
            }

            g_GlobalData.subCurMonsterCount();
            if (g_GlobalData.getCurMonsterCount() <= 0) {
                g_gameUI.showSucceed();
            }

            g_dataManager.addTaskCount(TASK_JIDAO_DIREN);

        } else {
            this.m_HpBar.progress = this.m_Hp / this.m_maxHp;
        }
        let str = numberToString(hp);
        if (double) {
            str = '暴击' + str;
        }
        g_hpEffect.createHpEffect(this.node.getPosition(), str);
    }

    setSlow(bSlow: boolean) {
        if (bSlow) {
            this.m_slow.active = true;
            this.setSpeed(this.m_defaultSpeed / 2);
        } else {
            this.m_slow.active = false;
            this.setSpeed(this.m_defaultSpeed);
        }
    }
}
