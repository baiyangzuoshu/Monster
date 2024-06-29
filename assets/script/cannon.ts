import { _decorator, Component, Node, Label, SpriteAtlas, Sprite, Prefab, instantiate, v2, Vec2, tween, Tween } from 'cc';
import { GameManager } from '../Game/Scripts/Manager/GameManager';

import { BUFFER_QUANPINGGONGJI } from './define';
import { Vec3 } from 'cc';
import { v3 } from 'cc';
import { MonsterBuild } from './monsterBuild';
import { SkillManager } from './gameUI/skillBuffer';
import { g_GlobalData } from './data/data';
import GunBase from './gun/gunBase';
import { getAngle, getDistance } from './utlis';
import { MonsterItem } from './msItem';
const { ccclass, property } = _decorator;

@ccclass('Cannon')
export class Cannon extends Component {

    @property(Label)
    m_labLevel: Label = null;

    @property(Node)
    m_gunNode: Node = null;

    @property(Node)
    m_padNode: Node = null;

    @property(SpriteAtlas)
    m_gunAtlas: SpriteAtlas = null;

    @property(SpriteAtlas)
    m_padAtlas: SpriteAtlas =null;

    @property(Node)
    m_hintNode: Node = null;

    @property(Node)
    m_rangeNode: Node = null;

    @property([Prefab])
    m_gunPrefab: Prefab[] = [];

    private static _instance: Cannon = null;

    public m_levelData: number = -1;
    private m_type: number = 0;
    private m_bFire: boolean = false;
    private m_isCanLockEnemy: boolean = false;
    private m_isFlying: boolean = true;
    private m_gunSprite: Node = null;
    private m_attackTarget: Node = null;

    public static get instance(): Cannon {
        return this._instance;
    }

    onLoad() {
        Cannon._instance = this;

        this.m_levelData = -1;
        this.m_type = 0;
        this.m_bFire = false;
        this.m_isCanLockEnemy = false;
        this.m_isFlying = true;
    }

    start() {
        // Initialization code here
    }

    openLockEnemy() {
        this.m_isCanLockEnemy = true;
    }

    closeLockEnemy() {
        this.m_isCanLockEnemy = false;
    }

    setFlying(fly: boolean) {
        this.m_isFlying = fly;
    }

    effectAction() {
        const self = instantiate(this.node);
        this.node.addChild(self);
        self.setPosition(v3(0, 0));
        tween(self)
            .to(0.1, { scale: v3(4, 4,0) })
            .destroySelf()
            .start();
    }

    setLevel(lv: number) {
        if (this.m_levelData != lv) {
            this.setTarget(null);
            this.closeLockEnemy();
            if (this.m_gunSprite == null) {
                this.createGun(lv);
            } else {
                const js = this.m_gunSprite.getComponent(GunBase);
                if (!js.isFire()) {
                    this.m_gunSprite.removeFromParent();
                    this.m_gunSprite = null;
                    return this.setLevel(lv);
                }
            }
        }
        this.m_levelData = lv;
        this.updateStyle();
    }

    setRot(rot: number) {
        this.m_gunNode.angle = rot;
    }

    createGun(curlevel: number) {
        const lvData = g_GlobalData.cannonUpLevel[curlevel];
        const type = lvData.type;
        const level = lvData.level;
        const ATK = lvData.atk;
        console.log("createGun",type,level,ATK);
        this.m_type = type;
        this.m_levelData = curlevel;

        this.m_gunSprite = instantiate(this.m_gunPrefab[type]);
        const js = this.m_gunSprite.getComponent('gun_' + type) as GunBase;
        js.setATK(ATK);
        js.setFireEndCallBack((level: number) => {
            console.log("fire end call back", level, this.m_levelData);
            if (level != this.m_levelData) {
                this.m_gunSprite.removeFromParent();
                this.m_gunSprite = null;
                this.createGun(this.m_levelData);
            }
        }, curlevel);
        this.m_gunNode.addChild(this.m_gunSprite);
        this.updateStyle();
        if (!this.m_isFlying) {
            this.openLockEnemy();
        }
    }

    updateStyle() {
        const lvData = g_GlobalData.cannonUpLevel[this.m_levelData];
        const type = lvData.type;
        const level = lvData.level;

        this.m_type = type;
        const name = '' + type + '_' + level;
        const frame = this.m_gunAtlas.getSpriteFrame(name);
        this.m_gunSprite.getComponent(Sprite).spriteFrame = frame;

        const index = Math.floor(level / 3);
        const padName = '' + type + '_' + index;
        const padFrame = this.m_padAtlas.getSpriteFrame(padName);
        this.m_padNode.getComponent(Sprite).spriteFrame = padFrame;

        this.m_labLevel.string = '' + (this.m_levelData + 1);
    }

    compare(cannon: Cannon): boolean {
        return this.m_levelData === cannon.m_levelData;
    }

    levelUp() {
        this.setLevel(this.m_levelData + 1);
        this.updateStyle();
    }

    showHint() {
        this.m_hintNode.active = true;
    }

    hideHint() {
        this.m_hintNode.active = false;
    }

    showRange() {
        this.m_rangeNode.active = true;
    }

    hideRange() {
        this.m_rangeNode.active = false;
    }

    setTarget(target: Node) {
        if (this.m_attackTarget != null && target == null) {
            this.endFire();
        }
        this.m_attackTarget = target;
        this.m_bFire = false;
    }

    findMonsterAttack() {
        // Implement the logic to find monster attack
    }

    beginFire() {
        if (!GameManager.instance.isGameStart()) {
            return;
        }
        console.log('111111111');
        if (this.m_gunSprite == null) {
            this.scheduleOnce(this.beginFire.bind(this), 0.2);
            return;
        }
        const component = this.m_gunSprite.getComponent(GunBase);
        console.log('222222');
        if (component != null && component.isFire()) {
            this.scheduleOnce(this.beginFire.bind(this), 0.2);
            return;
        }
        console.log('333333');
        if (component != null && this.m_attackTarget != null && !this.m_attackTarget.getComponent(MonsterItem).isDead()) {
            component.fire(this.m_attackTarget);
        }
    }

    endFire() {
        if (this.m_gunSprite == null) {
            return;
        }

        const component = this.m_gunSprite.getComponent(GunBase);

        if (component != null && component.endFire != null) {
            component.endFire();
        }
    }

    update(dt: number) {
        if (!this.m_isCanLockEnemy) return;

        if (this.m_attackTarget == null) {
            const target = MonsterBuild.instance.calcNearDistance(this.node);
            this.setTarget(target);
        }
        if (this.m_attackTarget != null) {
            if (this.m_attackTarget.getComponent(MonsterItem).isDead()) {
                this.setTarget(null);
                return;
            }
            const dis = getDistance(this.m_attackTarget.getPosition(), v3(this.node.getPosition().x, this.node.getPosition().y));
            let curDis = 230;
            if (SkillManager.instance.bufferState[BUFFER_QUANPINGGONGJI]) {
                curDis *= 10;
            }
            if (Math.abs(dis) > curDis) {
                this.setTarget(null);
                return;
            }
            const start = this.node.getPosition();
            const end = this.m_attackTarget.getPosition();
            let angle = getAngle(v3(start.x,start.y), end);
            angle += 360;
            angle -= 90;
            if (this.m_bFire) {
                this.setRot(angle);
            } else {
                let moveAngle = 300 * dt;
                if (this.m_gunNode.angle > angle || angle - this.m_gunNode.angle > 180) {
                    moveAngle = -moveAngle;
                }
                this.m_gunNode.angle += moveAngle;
                if (this.m_gunNode.angle < 0) this.m_gunNode.angle += 360;
                if (Math.abs(this.m_gunNode.angle - angle) < Math.abs(moveAngle)) {
                    this.m_bFire = true;
                    this.beginFire();
                    this.setRot(angle);
                }
            }
        }
    }
}


