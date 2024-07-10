import { _decorator, Component, SpriteAtlas, Node, Sprite, Vec3, ProgressBar, v3, tween, Label, instantiate } from 'cc';
import { GameManager } from '../Game/Scripts/Manager/GameManager';

import { CrownManager } from './crownBuild';
import HpEffect from './HpEffectNode';
import { MonsterBuild } from './monsterBuild';
import { BUFFER_GONGJIFANBEI, BUFFER_JINBIFANBEI, INTENSIFY_BAOJI, TASK_JIDAO_DIREN } from './define';
import { g_GlobalData } from './data/data';
import { DataManager } from './data/dataManager';
import { g_intensifyData } from './data/intensifyData';
import { numberToString } from './utlis';
import { SkillManager } from './gameUI/skillBuffer';
import EffectBuild from './effectBuild';
import { UITransform } from 'cc';
import { CircleCollider2D } from 'cc';
import { CoinFlyManager } from './coinFly';
import { v2 } from 'cc';
import { EventManager } from '../Framework/Scripts/Managers/EventManager';
import { UIEventName } from '../Game/Scripts/Constants';
import { DataModelManager, ModelName } from '../Game/Scripts/Data/DataModelManager';
import { GameModel, GameState } from '../Game/Scripts/Data/Model/GameModel';
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
    private m_type: number = 0;
    private m_index: number = 0;
    private m_isDead: boolean = false;

    onLoad() {
        this.m_curMoveIndex = 0;
        this.m_isDead = false;
    }

    start() {

    }

    isDead(): boolean {
        return this.m_isDead;
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
            width = sprite.node.getComponent(UITransform).width;
            height = sprite.node.getComponent(UITransform).height;
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
        //console.log(this._pathPos[0].x, this._pathPos[0].y, this._pathPos[1].x, this._pathPos[1].y);
        this.node.setPosition(this._pathPos[0]);

        this.updateDir(this._pathPos[0], this._pathPos[1]);
    }

    stopMoveAction() {
        tween(this.node).stop();
    }

    nextMove() {
        this.stopMoveAction();

        const start = this.node.getPosition();
        const end = this._pathPos[this.m_curMoveIndex + 1];
        if (end) {
            this.updateDir(start, end);
        }
        else{
            return;
        }
        
        const dis = start.subtract(end).length();
        const time = dis / this.m_speed;

        tween(this.node)
            .to(time, { position: end })
            .call(() => {
                this.m_curMoveIndex++;
                if (this.m_curMoveIndex === this._pathPos.length - 1) {
                    let gameModel=DataModelManager.instance.getModel(ModelName.Game) as GameModel;
        
                    if (gameModel.state==GameState.Playering) {
                        this.m_diamond.active = true;
                        GameManager.instance.stopGame();

                        let gameModel=DataModelManager.instance.getModel(ModelName.Game) as GameModel;
                        gameModel.state=GameState.End;

                        CrownManager.instance.hide();
                        MonsterBuild.instance.setGameEndSpeed();
                    }
                    this.gameEndAction();
                } else {
                    this.nextMove();
                }
            })
            .start();
    }

    moveAction() {
        this.nextMove();
    }

    gameEndAction() {
        const list = GameManager.instance.getCurPahtList();
        const lastPos = list[0];

        const pos = v3(lastPos.x * 106 + 106 / 2, -lastPos.y * 106 - 106 / 2);
        const curPos = this.node.getPosition();
        const startPos = v3((pos.x - curPos.x) / 2 + curPos.x, curPos.y + 150);

        tween(this.node)
            .to(0.2, { position: startPos })
            .to(0.4, { position: pos })
            .call(() => {
                this.m_diamond.active = false;
                this.node.active = false;
                this.m_isDead = true;
                g_GlobalData.subCurMonsterCount();
                if (g_GlobalData.getCurMonsterCount() <= 0) {
                    EventManager.Instance.Emit(UIEventName.showFaild, {});
                }
            })
            .start();

        this.node.setScale(v3(1, 1));

        tween(this.node)
            .sequence(
                tween().to(0.1, { scale: v3(1.2, 0.8) }),
                tween().to(0.1, { scale: v3(1, 1) }),
                tween().to(0.2, { scale: v3(0.8, 1.2) })
            )
            .start();
    }

    scaleAction() {
        const moveList = [];
        const scale = tween().to(0.5, { scale: v3(0.8, 1.2) });
        const move = tween().by(0.5, { position: v3(0, 80) });
        const sp = tween().parallel(scale, move);
        moveList.push(sp);

        const scale2 = tween().to(0.5, { scale: v3(1, 1) });
        const move2 = tween().by(0.5, { position: v3(0, -80) });
        const sp2 = tween().parallel(scale2, move2);
        moveList.push(sp2);

        const callFunc = tween().call(() => {
            if (this.m_type > 0) {
                tween(this.m_scaleItem)
                    .repeatForever(
                        tween().sequence(
                            tween().to(0.5, { scale: v3(1.1, 0.9) }),
                            tween().to(0.5, { scale: v3(0.9, 1.1) })
                        )
                    )
                    .start();
            } else {
                tween(this.m_itemNode)
                    .repeatForever(
                        tween().sequence(
                            tween().by(0.2, { position: v3(0, 30) }),
                            tween().by(0.2, { position: v3(0, -30) })
                        )
                    )
                    .start();
            }
        });
        moveList.push(callFunc);
        tween(this.m_itemNode).sequence(...moveList).start();
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
        this.m_HpBar.node.getComponent(UITransform).width = width;
        this.m_HpBar.node.getComponent(UITransform).height = height;
        this.m_HpBar.totalLength = width;
    }

    updateCollider(width: number, height: number) {
        const box = this.m_itemNode.getComponent(CircleCollider2D);
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
        let gameModel=DataModelManager.instance.getModel(ModelName.Game) as GameModel;
        
        if (gameModel.state!=GameState.Playering || this.m_isDead) {
            return;
        }
        if (hp == null) {
            console.log('攻击力未定义');
            return;
        }
        if (SkillManager.instance.bufferState[BUFFER_GONGJIFANBEI]) {
            hp *= 2;
        }
        let double = false;
        if (Math.random() * 1000 <= 500) {
            const lv = DataManager.getInternsifLevel(INTENSIFY_BAOJI);
            const doubleValue = g_intensifyData.getValue(INTENSIFY_BAOJI, lv);
            hp = hp * 2 + hp * (doubleValue / 100);
            hp = hp + hp * (doubleValue / 100);
            hp = parseFloat(hp.toFixed(2));
            double = true;
        }

        this.m_Hp -= hp;
        if (this.m_Hp <= 0) {
            //this.node.stopAllActions();
            this.m_HpBar.progress = 0;
            this.m_isDead = true;
            this.node.active = false;
            const pos = this.node.getPosition();
            EffectBuild.instance.createDeadEffect(pos);
            let cale_gold = this.m_deadGold;
            if (SkillManager.instance.bufferState[BUFFER_JINBIFANBEI]) {
                cale_gold *= 2;
            }
            if (cale_gold > 0) {
                CoinFlyManager.instance.createCoinToTip(this.node, (gold: number) => {
                    DataManager.addGold(gold);
                    EventManager.Instance.Emit(UIEventName.updateGameUI, {});

                }, cale_gold);
            }

            g_GlobalData.subCurMonsterCount();
            if (g_GlobalData.getCurMonsterCount() <= 0) {
                EventManager.Instance.Emit(UIEventName.showSucceed, {});
            }

            DataManager.addTaskCount(TASK_JIDAO_DIREN);

        } else {
            this.m_HpBar.progress = this.m_Hp / this.m_maxHp;
        }
        let str = numberToString(hp);
        if (double) {
            str = '暴击' + str;
        }

        HpEffect.instance.createHpEffect(v2(this.node.getPosition().x,this.node.getPosition().y), str);
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
