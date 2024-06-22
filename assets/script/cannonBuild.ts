import { _decorator, Component, Node, Prefab, instantiate, Vec2, Vec3, UITransform, v2, Color, EventTouch, Tween, tween, Label } from 'cc';
import { GameManager } from './game';
import { BottomUIManager } from './gameUI/bottom';
import { DataManager } from './data/dataManager';
import { CHENGJIOU_QIANGHUA_JINENG, TASK_HEBING_FANGYUTA } from './define';
import { v3 } from 'cc';
import { Cannon } from './cannon';
const { ccclass, property } = _decorator;

@ccclass('CannonManager')
export class CannonManager extends Component {

    @property(Prefab)
    m_cannonPrefab: Prefab = null;

    @property(Node)
    m_moveCannonNode: Node = null;

    private static _instance: CannonManager = null;

    private m_curZIndex: number = 100;
    private m_touchNode: Node = null;
    private m_cannonList: any[] = [];
    private m_selecetCannon: any = null;
    private m_moveCannon: Node = null;

    public static get instance(): CannonManager {
        return this._instance;
    }

    onLoad() {
        CannonManager._instance = this;

        this.m_curZIndex = 100;
        this.m_touchNode = new Node();
        this.node.addChild(this.m_touchNode);
        const uiTransform = this.m_touchNode.addComponent(UITransform);
        uiTransform.anchorY = 1;
        this.m_touchNode.setPosition(new Vec3(320, 361));
        uiTransform.setContentSize(640, 1200);

        this.m_cannonList = [];
        const _cannonList = GameManager.instance.getCurCannonPoint();
        for (let i = 0; i < _cannonList.length; i++) {
            this.m_cannonList[i] = this.createCannonData();
            this.m_cannonList[i].pos = _cannonList[i];
        }
        this.createEndItemBlock();

        this.m_touchNode.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.m_touchNode.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.m_touchNode.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.m_touchNode.on(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    start() {
        // Initialization code here
    }

    onTouchStart(event: EventTouch) {
        const pos = event.getLocation();
        this.m_selecetCannon = this.getCannonByPosition(pos);
        if (this.m_selecetCannon != null) {
            const cannon = this.m_selecetCannon.cannon;
            if (cannon != null) {
                if (this.m_moveCannon != null) {
                    this.m_moveCannon.removeFromParent();
                    this.m_moveCannon = null;
                }
                this.m_moveCannon = instantiate(cannon.node);
                this.m_moveCannon['_selfData'] = cannon.node['_selfData'];
                this.m_moveCannonNode.addChild(this.m_moveCannon);
                const cloneCannon = this.m_moveCannon.getComponent('cannon');
                this.showCannonRange(cannon);
                cannon.node.opacity = 127;
                this.showCannonHint(cannon.node['_selfData'].cannon);
                BottomUIManager.instance.setShowDestroy(true);
            } else {
                this.m_selecetCannon = null;
            }
        }
    }

    onTouchMove(event: EventTouch) {
        if (this.m_moveCannon == null) return;

        const delta = event.getDelta();
        let pos = this.m_moveCannon.getPosition();
        pos.x += delta.x;
        pos.y += delta.y;
        this.m_moveCannon.setPosition(pos);

        const worldPos = event.getLocation();
        const cannon = this.getCannonByPosition(worldPos);
        if (cannon != null) {
            const cannonComp = cannon.cannon;
            if (cannonComp != null) {
                this.showCannonRange(cannonComp);
            } else {
                this.hideCannonRange();
            }
        }
    }

    onTouchEnd(event: EventTouch) {
        this.setAllCannonOpacity();
        const worldPos = event.getLocation();
        const block = this.getBlockByPos(worldPos);
        if (block != null) {
            if (this.m_moveCannon != null) {
                this.changeCannon(this.m_moveCannon['_selfData'], block['_selfData']);
            }
        }

        if (this.m_moveCannon != null) {
            this.m_moveCannon.removeFromParent();
            this.m_moveCannon = null;
            this.hideCannonHint();
        }

        this.hideCannonRange();
        BottomUIManager.instance.setShowDestroy(false);

        if (BottomUIManager.instance.isInDestroy(worldPos)) {
            this.m_selecetCannon.cannon.node.removeFromParent();
            this.m_selecetCannon.cannon.node.destroy();
            this.m_selecetCannon.cannon = null;
        }
    }

    onTouchCancel(event: EventTouch) {
        this.setAllCannonOpacity();
        if (this.m_moveCannon != null) {
            this.m_moveCannon.removeFromParent();
            this.m_moveCannon = null;
        }

        this.hideCannonRange();
        BottomUIManager.instance.setShowDestroy(false);

        const worldPos = event.getLocation();
        if (BottomUIManager.instance.isInDestroy(worldPos)) {
            this.m_selecetCannon.cannon.node.removeFromParent();
            this.m_selecetCannon.cannon.node.destroy();
            this.m_selecetCannon.cannon = null;
        }
    }

    showCannonRange(cannon: any) {
        this.hideCannonRange();
        cannon.showRange();
        cannon.node.setSiblingIndex(this.m_curZIndex);
        this.m_moveCannon.setSiblingIndex(this.m_curZIndex + 1);
        this.m_curZIndex++;
    }

    hideCannonRange() {
        for (let i = 0; i < this.m_cannonList.length; i++) {
            if (this.m_cannonList[i].cannon != null) {
                this.m_cannonList[i].cannon.hideRange();
            }
        }
    }

    showCannonHint(cannon: any) {
        for (let i = 0; i < this.m_cannonList.length; i++) {
            if (this.m_cannonList[i].cannon != null) {
                if (this.m_cannonList[i].cannon.compare(cannon)) {
                    this.m_cannonList[i].cannon.showHint();
                }
            }
        }
    }

    hideCannonHint() {
        for (let i = 0; i < this.m_cannonList.length; i++) {
            if (this.m_cannonList[i].cannon != null) {
                this.m_cannonList[i].cannon.hideHint();
            }
        }
    }

    changeCannon(startItem: any, endItem: any) {
        if (startItem.pos.x == endItem.pos.x && startItem.pos.y == endItem.pos.y) {
            return;
        }
        if (startItem.cannon == null) {
            return;
        }

        let playEffect = false;
        if (endItem.cannon != null) {
            if (startItem.cannon.compare(endItem.cannon)) {
                startItem.cannon.levelUp();
                endItem.cannon.node.destroy();
                endItem.cannon = null;
                playEffect = true;

                DataManager.addTaskCount(TASK_HEBING_FANGYUTA);
                DataManager.addTaskCount(CHENGJIOU_QIANGHUA_JINENG);
            }
        }

        if (endItem.cannon == null) {
            startItem.cannon.node.setPosition(new Vec3(endItem.pos.x * 106 + 106 / 2, -endItem.pos.y * 106 - 106 / 2));
            endItem.cannon = startItem.cannon;
            endItem.cannon.node['_selfData'] = endItem;
            startItem.cannon = null;
            if (playEffect) {
                endItem.cannon.effectAction();
            }
        } else {
            startItem.cannon.node.setPosition(new Vec3(endItem.pos.x * 106 + 106 / 2, -endItem.pos.y * 106 - 106 / 2));
            endItem.cannon.node.setPosition(new Vec3(startItem.pos.x * 106 + 106 / 2, -startItem.pos.y * 106 - 106 / 2));
            const cannon = endItem.cannon;
            endItem.cannon = startItem.cannon;
            endItem.cannon.node['_selfData'] = endItem;
            startItem.cannon = cannon;
            startItem.cannon.node['_selfData'] = startItem;
        }
    }

    setAllCannonOpacity() {
        for (let i = 0; i < this.m_cannonList.length; i++) {
            if (this.m_cannonList[i].cannon != null) {
                this.m_cannonList[i].cannon.node.opacity = 255;
            }
        }
    }

    getBlockByPos(world_pos: Vec2) {
        for (let i = 0; i < this.m_cannonList.length; i++) {
            const pos = this.m_cannonList[i].block.convertToNodeSpaceAR(world_pos);
            if (pos.x < 106 / 2 && pos.x > -106 / 2 && pos.y < 106 / 2 && pos.y > -106 / 2) {
                return this.m_cannonList[i].block;
            }
        }
        return null;
    }

    getCannonByPosition(world_pos: Vec2) {
        for (let i = 0; i < this.m_cannonList.length; i++) {
            if (this.m_cannonList[i].cannon != null) {
                const pos = this.m_cannonList[i].cannon.node.convertToNodeSpaceAR(world_pos);
                if (pos.x < 106 / 2 && pos.x > -106 / 2 && pos.y < 106 / 2 && pos.y > -106 / 2) {
                    return this.m_cannonList[i];
                }
            }
        }
        return null;
    }

    createCannonData() {
        const obj: any = {};
        obj.pos = v2(0, 0);
        obj.cannon = null;
        return obj;
    }

    getCanMakeIndex() {
        for (let i = 0; i < this.m_cannonList.length; i++) {
            if (this.m_cannonList[i].cannon == null) {
                return i;
            }
        }
        return null;
    }

    cannonBuild(index: number, level?: number) {
        if (this.m_cannonList[index] == null) {
            return;
        }
        if (this.m_cannonList[index].cannon != null) {
            return;
        }

        let cannon = instantiate(this.m_cannonPrefab);
        this.node.addChild(cannon);
        const pos = this.m_cannonList[index].pos;
        cannon['_selfData'] = this.m_cannonList[index];

        cannon.setPosition(v3(317, -952));

        const ts = cannon.getComponent(Cannon) as Cannon;
        ts.setRot(randomNum(0, 360));
        level = level ? level : 0;
        ts.createGun(level);
        this.m_cannonList[index].cannon = ts;

        const x = pos.x * 106 + 106 / 2;
        const y = -pos.y * 106 - 106 / 2;

        tween(cannon)
            .to(0.5, { position: v3(x,y) })
            .to(0.2, { scale: new Vec3(4, 4) })
            .delay(0.2)
            .to(0.1, { scale: new Vec3(1, 1) })
            .call(() => {
                ts.effectAction();
                ts.openLockEnemy();
                ts.setFlying(false);
            })
            .start();
    }

    clearAllCannon() {
        for (let i = 0; i < this.m_cannonList.length; i++) {
            if (this.m_cannonList[i].cannon != null) {
                this.m_cannonList[i].cannon.node.removeFromParent();
                this.m_cannonList[i].cannon = null;
            }
        }
    }

    clearAllCannonTarget() {
        for (let i = 0; i < this.m_cannonList.length; i++) {
            if (this.m_cannonList[i].cannon != null) {
                this.m_cannonList[i].cannon.setTarget(null);
            }
        }
    }

    createEndItemBlock() {
        const _cannonList = GameManager.instance.getCurCannonPoint();
        for (let i = 0; i < _cannonList.length; i++) {
            const pos = _cannonList[i];

            const block = new Node();
            this.node.addChild(block);
            block.setPosition(new Vec3(pos.x * 106 + 106 / 2, -pos.y * 106 - 106 / 2));
            block.addComponent(UITransform).setContentSize(106, 106);
            this.m_cannonList[i].block = block;
            this.m_cannonList[i].block['_selfData'] = this.m_cannonList[i];
        }
    }

    testTarget(target: any) {
        for (let i = 0; i < this.m_cannonList.length; i++) {
            if (this.m_cannonList[i].cannon != null) {
                this.m_cannonList[i].cannon.setTarget(target);
            }
        }
    }

    autoMerge() {
        const count = [];
        let minIndex = 0;
        let minLevel = 9999;
        for (let i = 0; i < this.m_cannonList.length; i++) {
            if (this.m_cannonList[i].cannon == null) continue;
            const level = this.m_cannonList[i].cannon.m_levelData;
            if (count[level] == null) {
                count[level] = 1;
            } else {
                count[level]++;
            }
            if (count[level] >= 2) {
                if (level < minLevel) {
                    minLevel = level;
                    minIndex = i;
                }
            }
        }
        if (minLevel != 9999) {
            const cannon1 = this.m_cannonList[minIndex].cannon;

            for (let j = 0; j < this.m_cannonList.length; j++) {
                if (this.m_cannonList[j].cannon == null) continue;
                const cannon2 = this.m_cannonList[j].cannon;

                if (cannon1 == cannon2) continue;

                if (cannon1.compare(cannon2)) {
                    this.changeCannon(this.m_cannonList[minIndex], this.m_cannonList[j]);
                    return true;
                }
            }
        }

        return false;
    }

    jumpNextMap() {
        for (let j = 0; j < this.m_cannonList.length; j++) {
            if (this.m_cannonList[j].cannon == null) continue;
            const cannon = this.m_cannonList[j].cannon.node;
            let rand = randomNum(0, 20);
            if (randomNum(0, 100) > 50) {
                rand *= -1;
            }
            rand = rand / 100;
            const acList = [];
            acList.push(tween(cannon).to(0.35 + rand, { scale: new Vec3(1.8, 1.8) }));
            acList.push(tween(cannon).to(0.35 - rand, { scale: new Vec3(1, 1) }));
            tween(cannon).sequence(...acList).start();
        }
    }
}

function randomNum(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getAngle(start: Vec2, end: Vec2): number {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
    return angle;
}
