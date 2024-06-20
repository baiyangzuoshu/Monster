import { _decorator, Component, Node, Label, SpriteAtlas, Sprite, Prefab, instantiate, v2, Vec2, scaleTo, fadeOut, sequence, callFunc, delayTime, scheduleOnce } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GunComponent')
export class GunComponent extends Component {

    @property(Label)
    m_labLevel: Label = null;

    @property(Node)
    m_gunNode: Node = null;

    @property(Node)
    m_padNode: Node = null;

    @property([SpriteAtlas])
    m_gunAtlas: SpriteAtlas[] = [];

    @property([SpriteAtlas])
    m_padAtlas: SpriteAtlas[] = [];

    @property(Node)
    m_hintNode: Node = null;

    @property(Node)
    m_rangeNode: Node = null;

    @property([Prefab])
    m_gunPrefab: Prefab[] = [];

    private m_levelData: number = -1;
    private m_type: number = 0;
    private m_bFire: boolean = false;
    private m_isCanLockEnemy: boolean = false;
    private m_isFlying: boolean = true;
    private m_gunSprite: Node = null;
    private m_attackTarget: any = null;

    onLoad() {
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
        self.setPosition(v2(0, 0));
        const scale = scaleTo(0.1, 4, 4);
        const fade = fadeOut(0.1);
        const sp = cc.spawn(scale, fade);
        const seq = sequence(delayTime(0.1), sp, callFunc(() => {
            self.removeFromParent();
            self.destroy();
        }));
        self.runAction(seq);
    }

    setLevel(lv: number) {
        if (this.m_levelData != lv) {
            this.setTarget(null);
            this.closeLockEnemy();
            if (this.m_gunSprite == null) {
                this.createGun(lv);
            } else {
                const js = this.m_gunSprite.getComponent('gun_' + this.m_type);
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

        this.m_type = type;
        this.m_levelData = curlevel;

        this.m_gunSprite = instantiate(this.m_gunPrefab[type]);
        const js = this.m_gunSprite.getComponent('gun_' + type);
        js.setATK(ATK);
        js.setFireEndCallBack((level: number) => {
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
        const frame = this.m_gunAtlas[0].getSpriteFrame(name);
        this.m_gunSprite.getComponent(Sprite).spriteFrame = frame;

        const index = Math.floor(level / 3);
        const padName = '' + type + '_' + index;
        const padFrame = this.m_padAtlas[0].getSpriteFrame(padName);
        this.m_padNode.getComponent(Sprite).spriteFrame = padFrame;

        this.m_labLevel.string = '' + (this.m_levelData + 1);
    }

    compare(cannon: any): boolean {
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

    setTarget(target: any) {
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
        if (!g_game.isGameStart()) {
            return;
        }

        if (this.m_gunSprite == null) {
            this.scheduleOnce(this.beginFire.bind(this), 0.2);
            return;
        }
        const component = this.m_gunSprite.getComponent('gun_' + this.m_type);

        if (component != null && component.isFire()) {
            this.scheduleOnce(this.beginFire.bind(this), 0.2);
            return;
        }
        if (component != null && component.fire != null && this.m_attackTarget != null && !this.m_attackTarget.isDead) {
            component.fire(this.m_attackTarget);
        }
    }

    endFire() {
        if (this.m_gunSprite == null) {
            return;
        }

        const component = this.m_gunSprite.getComponent('gun_' + this.m_type);

        if (component != null && component.endFire != null) {
            component.endFire();
        }
    }

    update(dt: number) {
        if (!this.m_isCanLockEnemy) return;

        if (this.m_attackTarget == null) {
            const target = g_monsterBuild.calcNearDistance(this.node);
            this.setTarget(target);
        }
        if (this.m_attackTarget != null) {
            if (this.m_attackTarget.isDead) {
                this.setTarget(null);
                return;
            }
            const dis = getDistance(this.m_attackTarget.getPosition(), this.node.getPosition());
            let curDis = 230;
            if (g_bufferState[BUFFER_QUANPINGGONGJI]) {
                curDis *= 10;
            }
            if (Math.abs(dis) > curDis) {
                this.setTarget(null);
                return;
            }
            const start = this.node.getPosition();
            const end = this.m_attackTarget.getPosition();
            let angle = getAngle(start, end);
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

export default GunComponent;

function getDistance(pos1: Vec2, pos2: Vec2): number {
    const dx = pos1.x - pos2.x;
    const dy = pos1.y - pos2.y;
    return Math.sqrt(dx * dx + dy * dy);
}

function getAngle(startPos: Vec2, endPos: Vec2): number {
    const dx = endPos.x - startPos.x;
    const dy = endPos.y - startPos.y;
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
    return angle;
}
