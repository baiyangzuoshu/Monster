import { _decorator, Component, Node, Prefab, instantiate, Vec2, Vec3, UITransform, v2, Color, EventTouch, Tween, tween, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CannonBuild')
export class CannonBuild extends Component {

    @property(Prefab)
    m_cannonPrefab: Prefab = null;

    @property(Node)
    m_moveCannonNode: Node = null;

    private m_curZIndex: number = 100;
    private m_touchNode: Node = null;
    private m_cannonList: any[] = [];
    private m_selecetCannon: any = null;
    private m_moveCannon: Node = null;

    onLoad() {
        this.m_curZIndex = 100;
        this.m_touchNode = new Node();
        this.node.addChild(this.m_touchNode);
        this.m_touchNode.getComponent(UITransform).anchorY = 1;
        this.m_touchNode.setPosition(new Vec3(320, 361));
        this.m_touchNode.getComponent(UITransform).setContentSize(640, 1200);

        window['g_cannonBuild'] = this;
        this.m_cannonList = [];
        const _cannonList = g_game.getCurCannonPoint();
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
                g_bottomUI.setShowDestroy(true);
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
        g_bottomUI.setShowDestroy(false);

        if (g_bottomUI.isInDestroy(worldPos)) {
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
        g_bottomUI.setShowDestroy(false);

        const worldPos = event.getLocation();
        if (g_bottomUI.isInDestroy(worldPos)) {
            this.m_selecetCannon.cannon.node.removeFromParent();
            this.m_selecetCannon.cannon.node.destroy();
            this.m_selecetCannon.cannon = null;
        }
    }

    showCannonRange(cannon: any) {
        this.hideCannonRange();
        cannon.showRange();
        cannon.node.zIndex = this.m_curZIndex;
        this.m_moveCannon.zIndex = this.m_curZIndex + 1;
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

                g_dataManager.addTaskCount(TASK_HEBING_FANGYUTA);
                g_dataManager.addTaskCount(CHENGJIOU_QIANGHUA_JINENG);
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

        const startPos = v2(317, -952);
        cannon.setPosition(startPos);

        const cannonComp = cannon.getComponent('cannon');
        cannonComp.setRot(randomNum(0, 360));
        level = level ? level : 0;
        cannonComp.createGun(level);
        this.m_cannonList[index].cannon = cannonComp;

        const x = pos.x * 106 + 106 / 2;
        const y = -pos.y * 106 - 106 / 2;
        const endPos = v2(x, y);

        const moveTo = new Tween().to(0.5, { position: endPos });
        const scaleTo1 = new Tween().to(0.2, { scale: new Vec3(4, 4) });
        const delta = new Tween().delay(0.2);
        const scaleTo2 = new Tween().to(0.1, { scale: new Vec3(1, 1) });
        const seq = new Tween().sequence(scaleTo1, delta, scaleTo2, new Tween().call(() => {
            cannonComp.effectAction();
            cannonComp.openLockEnemy();
            cannonComp.setFlying(false);
        }));

        new Tween(cannon.node).parallel(moveTo, seq).start();
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
        const _cannonList = g_game.getCurCannonPoint();
        for (let i = 0; i < _cannonList.length; i++) {
            const pos = _cannonList[i];

            const block = new Node();
            this.node.addChild(block);
            block.setPosition(new Vec3(pos.x * 106 + 106 / 2, -pos.y * 106 - 106 / 2));
            block.getComponent(UITransform).setContentSize(106, 106);
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
            acList.push(new Tween().to(0.35 + rand, { scale: new Vec3(1.8, 1.8) }).easing(Tween.Easing.quadIn));
            acList.push(new Tween().to(0.35 - rand, { scale: new Vec3(1, 1) }).easing(Tween.Easing.quadOut));
            new Tween(cannon).sequence(...acList).start();
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
