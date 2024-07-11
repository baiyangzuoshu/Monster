import { _decorator, Component, Node, Prefab, instantiate, Vec2, Vec3, UITransform, v2, Color, EventTouch, Tween, tween, Label } from 'cc';
import { GameManager } from '../Game/Scripts/Manager/GameManager';

import { BottomUIManager } from './gameUI/bottom';
import { DataManager } from './data/dataManager';
import { CHENGJIOU_QIANGHUA_JINENG, TASK_HEBING_FANGYUTA } from './define';
import { v3 } from 'cc';
import { randomNum } from './utlis';
import { UIOpacity } from 'cc';
import { EventManager } from '../Framework/Scripts/Managers/EventManager';
import { UIEventName } from '../Game/Scripts/Constants';
import { ECSWorld } from '../Game/Scripts/ECS/ECSWorld';
import { Cannon } from '../Game/Scripts/Role/Cannon';
const { ccclass, property } = _decorator;
class CannonBlock{
    pos:Vec3
    cannon:Node
    block:Node
}
const offsetX=0;
const offsetY=0;
@ccclass('CannonManager')
export class CannonManager extends Component {

    @property(Prefab)
    m_cannonPrefab: Prefab = null;

    @property(Node)
    m_moveCannonNode: Node = null;
    @property(Prefab)
    m_blockPrefab: Prefab = null;

    private static _instance: CannonManager = null;

    private m_curZIndex: number = 100;
    private m_cannonList: CannonBlock[] = [];
    private m_selecetCannon: any = null;
    private m_moveCannon: Node = null;

    public static get instance(): CannonManager {
        return this._instance;
    }

    onLoad() {
        CannonManager._instance = this;

        this.m_curZIndex = 100;
        this.m_cannonList = [];
        const _cannonList = GameManager.instance.getCurCannonPoint();
        for (let i = 0; i < _cannonList.length; i++) {
            this.m_cannonList[i] = this.createCannonData();
            this.m_cannonList[i].pos = _cannonList[i];
        }
        this.createEndItemBlock();

        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    start() {
        // Initialization code here
    }

    onTouchStart(event: EventTouch) {
        const worldPos = event.getUILocation();
        this.m_selecetCannon = this.getCannonByPosition(v3(worldPos.x,worldPos.y));
        if (this.m_selecetCannon != null) {
            const cannon = this.m_selecetCannon.cannon;
            if (cannon != null) {
                if (this.m_moveCannon != null) {
                    this.m_moveCannon.removeFromParent();
                    this.m_moveCannon = null;
                }
                this.m_moveCannon = instantiate(cannon);
                this.m_moveCannon['_selfData'] = cannon['_selfData'];
                this.m_moveCannonNode.addChild(this.m_moveCannon);
                const cloneCannon = this.m_moveCannon.getComponent(Cannon);
                this.showCannonRange(cannon);
                cannon.opacity = 127;
                this.showCannonHint(cannon['_selfData'].cannon);
                //BottomUIManager.instance.setShowDestroy(true);
                EventManager.Instance.Emit(UIEventName.setShowDestroy, true);
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

        const worldPos = event.getUILocation();
        const cannon = this.getCannonByPosition(v3(worldPos.x,worldPos.y));
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
        const worldPos = event.getUILocation();
        const cannonBlock = this.getBlockByPos(v3(worldPos.x,worldPos.y));
        if (cannonBlock != null) {
            if (this.m_moveCannon != null) {
                this.changeCannon(this.m_moveCannon['_selfData'], cannonBlock['_selfData']);
            }
        }
        else{
            console.log('not in block');
        }

        if (this.m_moveCannon != null) {
            this.m_moveCannon.removeFromParent();
            this.m_moveCannon = null;
            this.hideCannonHint();
        }

        this.hideCannonRange();
        //BottomUIManager.instance.setShowDestroy(false);
        EventManager.Instance.Emit(UIEventName.setShowDestroy, false);
        // if (BottomUIManager.instance.isInDestroy(worldPos)) {
        //     this.m_selecetCannon.cannon.removeFromParent();
        //     this.m_selecetCannon.cannon.destroy();
        //     this.m_selecetCannon.cannon = null;
        // }
    }

    onTouchCancel(event: EventTouch) {
        this.setAllCannonOpacity();
        if (this.m_moveCannon != null) {
            this.m_moveCannon.removeFromParent();
            this.m_moveCannon = null;
        }

        this.hideCannonRange();
        //BottomUIManager.instance.setShowDestroy(false);
        EventManager.Instance.Emit(UIEventName.setShowDestroy, false);
        const worldPos = event.getUILocation();
        // if (BottomUIManager.instance.isInDestroy(worldPos)) {
        //     this.m_selecetCannon.cannon.removeFromParent();
        //     this.m_selecetCannon.cannon.destroy();
        //     this.m_selecetCannon.cannon = null;
        // }
    }

    showCannonRange(cannon: Node) {
        this.hideCannonRange();
        cannon.getComponent(Cannon).showRange();
        cannon.setSiblingIndex(this.m_curZIndex);
        this.m_moveCannon.setSiblingIndex(this.m_curZIndex + 1);
        this.m_curZIndex++;
    }

    hideCannonRange() {
        for (let i = 0; i < this.m_cannonList.length; i++) {
            if (this.m_cannonList[i].cannon != null) {
                this.m_cannonList[i].cannon.getComponent(Cannon).hideRange();
            }
        }
    }

    showCannonHint(cannon: Node) {
        for (let i = 0; i < this.m_cannonList.length; i++) {
            if (this.m_cannonList[i].cannon != null) {
                if (this.m_cannonList[i].cannon.getComponent(Cannon).compare(cannon.getComponent(Cannon))) {
                    this.m_cannonList[i].cannon.getComponent(Cannon).showHint();
                }
            }
        }
    }

    hideCannonHint() {
        for (let i = 0; i < this.m_cannonList.length; i++) {
            if (this.m_cannonList[i].cannon != null) {
                this.m_cannonList[i].cannon.getComponent(Cannon).hideHint();
            }
        }
    }

    changeCannon(startItem: CannonBlock, endItem: CannonBlock) {
        if (startItem.pos.x == endItem.pos.x && startItem.pos.y == endItem.pos.y) {
            return;
        }
        if (startItem.cannon == null) {
            return;
        }

        let playEffect = false;
        if (endItem.cannon != null) {
            if (startItem.cannon.getComponent(Cannon).compare(endItem.cannon.getComponent(Cannon))) {
                startItem.cannon.getComponent(Cannon).levelUp();
                endItem.cannon.destroy();
                endItem.cannon = null;
                playEffect = true;

                DataManager.addTaskCount(TASK_HEBING_FANGYUTA);
                DataManager.addTaskCount(CHENGJIOU_QIANGHUA_JINENG);
            }
        }

        if (endItem.cannon == null) {
            startItem.cannon.setPosition(new Vec3(offsetX+endItem.pos.x * 106 + 106 / 2, offsetY-endItem.pos.y * 106 - 106 / 2));
            endItem.cannon = startItem.cannon;
            endItem.cannon['_selfData'] = endItem;
            startItem.cannon = null;
            if (playEffect) {
                endItem.cannon.getComponent(Cannon).effectAction();
            }
        } else {
            startItem.cannon.setPosition(new Vec3(offsetX+endItem.pos.x * 106 + 106 / 2, offsetY-endItem.pos.y * 106 - 106 / 2));
            endItem.cannon.setPosition(new Vec3(offsetX+startItem.pos.x * 106 + 106 / 2, offsetY-startItem.pos.y * 106 - 106 / 2));
            const cannon = endItem.cannon;
            endItem.cannon = startItem.cannon;
            endItem.cannon['_selfData'] = endItem;
            startItem.cannon = cannon;
            startItem.cannon['_selfData'] = startItem;
        }
    }

    setAllCannonOpacity() {
        for (let i = 0; i < this.m_cannonList.length; i++) {
            if (this.m_cannonList[i].cannon != null) {
                this.m_cannonList[i].cannon.getComponent(UIOpacity).opacity = 255;
            }
        }
    }

    getBlockByPos(world_pos: Vec3) {
        const pos2=this.node.getComponent(UITransform).convertToNodeSpaceAR(world_pos);
        for (let i = 0; i < this.m_cannonList.length; i++) {
            const pos = this.m_cannonList[i].block.getComponent(UITransform).convertToNodeSpaceAR(world_pos);
            if (pos.x < 106 / 2 && pos.x > -106 / 2 && pos.y < 106 / 2 && pos.y > -106 / 2) {
                return this.m_cannonList[i].block;
            }
        }
        return null;
    }

    getCannonByPosition(world_pos: Vec3) {
        for (let i = 0; i < this.m_cannonList.length; i++) {
            if (this.m_cannonList[i].cannon != null) {
                const uiTransform=this.m_cannonList[i].cannon.getComponent(UITransform) as UITransform
                const pos = uiTransform.convertToNodeSpaceAR(world_pos);
                if (pos.x < 106 / 2 && pos.x > -106 / 2 && pos.y < 106 / 2 && pos.y > -106 / 2) {
                    return this.m_cannonList[i];
                }
            }
        }
        return null;
    }

    createCannonData() {
        const obj: CannonBlock = new CannonBlock;
        obj.pos = v3(0, 0,0);
        obj.cannon = null;
        obj.block = null;
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

    async cannonBuild(index: number, level?: number) {
        if (this.m_cannonList[index] == null) {
            return;
        }
        if (this.m_cannonList[index].cannon != null) {
            return;
        }

        const pos = this.m_cannonList[index].pos;

        let cannonEntity=await ECSWorld.instance.createCannon(pos);
        let cannon=cannonEntity.baseCompnent.gameObject;  

        cannon['_selfData'] = this.m_cannonList[index];

        this.m_cannonList[index].cannon = cannon;
    }

    clearAllCannon() {
        for (let i = 0; i < this.m_cannonList.length; i++) {
            if (this.m_cannonList[i].cannon != null) {
                this.m_cannonList[i].cannon.removeFromParent();
                this.m_cannonList[i].cannon = null;
            }
        }
    }

    clearAllCannonTarget() {
        for (let i = 0; i < this.m_cannonList.length; i++) {
            if (this.m_cannonList[i].cannon != null) {
                this.m_cannonList[i].cannon.getComponent(Cannon).setTarget(null);
            }
        }
    }

    createEndItemBlock() {
        const _cannonList = GameManager.instance.getCurCannonPoint();
        for (let i = 0; i < _cannonList.length; i++) {
            const pos = _cannonList[i];

            const block = instantiate(this.m_blockPrefab);
            this.node.addChild(block);

            block.setPosition(new Vec3(offsetX+pos.x * 106 + 106 / 2, offsetY-pos.y * 106 - 106 / 2));

            this.m_cannonList[i].block = block;
            this.m_cannonList[i].block['_selfData'] = this.m_cannonList[i];
        }
    }

    testTarget(target: any) {
        for (let i = 0; i < this.m_cannonList.length; i++) {
            if (this.m_cannonList[i].cannon != null) {
                this.m_cannonList[i].cannon.getComponent(Cannon).setTarget(target);
            }
        }
    }

    autoMerge() {
        const count = [];
        let minIndex = 0;
        let minLevel = 9999;
        for (let i = 0; i < this.m_cannonList.length; i++) {
            if (this.m_cannonList[i].cannon == null) continue;
            const level = this.m_cannonList[i].cannon.getComponent(Cannon).m_levelData;
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

                if (cannon1.getComponent(Cannon).compare(cannon2.getComponent(Cannon))) {
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
            const cannon = this.m_cannonList[j].cannon;
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

