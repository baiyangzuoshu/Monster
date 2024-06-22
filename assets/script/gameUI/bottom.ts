import { _decorator, Component, Node, Label, Prefab, instantiate, tween, Vec3, UITransform, Vec2 } from 'cc';
import { GameManager } from '../game';
import { CannonManager } from '../cannonBuild';
import { GameUIManager } from './gameUI';
import { DataManager } from '../data/dataManager';
import { INTENSIFY_KUORONG } from '../define';
import { g_intensifyData } from '../data/intensifyData';
import { v3 } from 'cc';
import { TaskView } from './taskView';
import { IntensifyView } from './intensifyView';

const { ccclass, property } = _decorator;

@ccclass('BottomUIManager')
export class BottomUIManager extends Component {

    @property(Node)
    m_hammer: Node = null;

    @property(Label)
    m_makeNumberLabel: Label = null;

    @property(Node)
    m_water: Node = null;

    @property(Prefab)
    m_taskViewPrefab: Prefab = null;

    @property(Prefab)
    m_intensifyViewPrefab: Prefab = null;

    @property(Node)
    m_destroyNode: Node = null;

    private m_canMakeCount: number = 10;
    private m_maxMakeCount: number = 10;
    private m_hammerAction: boolean = false;
    private m_waterAction: boolean = false;
    private m_taskView: any = null;
    private m_intensifyView: any = null;

    private static _instance: BottomUIManager;

    static get instance() {
        return this._instance;
    }

    onLoad() {
        if (BottomUIManager._instance) {
            this.destroy();
            return;
        }
        BottomUIManager._instance = this;
        
        this.updateGameUI();
        this.setShowDestroy(false);
    }

    start() {
        // Initialization code here
    }

    onClickMake() {
        if (!GameManager.instance.isGameStart()) {
            return;
        }

        const index = CannonManager.instance.getCanMakeIndex();
        if (index == null) {
            return;
        }
        if (this.m_canMakeCount == 0) {
            return;
        }
        if (!this.m_hammerAction) {
            this.m_hammerAction = true;
            tween(this.m_hammer)
                .to(0.2, { eulerAngles: new Vec3(-90, 0, 0) })
                .to(0.2, { eulerAngles: new Vec3(0, 0, 0) })
                .call(() => {
                    this.m_hammerAction = false;
                })
                .start();
        }
        this.subMakeNumber();
        CannonManager.instance.cannonBuild(index);
    }

    addMakeNumber() {
        this.m_canMakeCount++;
        if (this.m_canMakeCount > this.m_maxMakeCount) {
            this.m_canMakeCount = this.m_maxMakeCount;
        }
        this.updateMakeCount();
    }

    subMakeNumber() {
        this.m_canMakeCount--;
        if (this.m_canMakeCount < 0) {
            this.m_canMakeCount = 0;
        }
        if (!this.m_waterAction) {
            this.m_water.getComponent(UITransform).setContentSize(0, 0);
        }
        this.updateMakeCount();
    }

    updateMakeCount() {
        this.m_makeNumberLabel.string = `${this.m_canMakeCount}/${this.m_maxMakeCount}`;
    }

    update(dt: number) {
        if (this.m_canMakeCount < this.m_maxMakeCount) {
            const newHeight = this.m_water.getComponent(UITransform).height + dt * 50;
            this.m_water.getComponent(UITransform).setContentSize(133, newHeight);
            this.m_waterAction = true;
            if (newHeight >= 133) {
                this.addMakeNumber();
                if (this.m_canMakeCount == this.m_maxMakeCount) {
                    this.m_water.getComponent(UITransform).setContentSize(133, 133);
                    this.m_waterAction = false;
                } else {
                    this.m_water.getComponent(UITransform).setContentSize(133, 0);
                }
            }
        }
    }

    onClickAutoMake() {
        if (!GameManager.instance.isGameStart()) {
            return;
        }
        CannonManager.instance.autoMerge();
    }

    updateGameUI() {
        if (!this.m_waterAction) {
            this.m_water.getComponent(UITransform).setContentSize(133, 0);
        }

        const lv = DataManager.getInternsifLevel(INTENSIFY_KUORONG);
        this.m_maxMakeCount = g_intensifyData.getValue(INTENSIFY_KUORONG, lv);
        this.updateMakeCount();
    }

    showTaskView() {
        if (this.m_taskView == null) {
            this.m_taskView = instantiate(this.m_taskViewPrefab);
            GameUIManager.instance.node.addChild(this.m_taskView);
            this.m_taskView = this.m_taskView.getComponent(TaskView);
        }
        this.m_taskView.show();
    }

    showIntensifyView() {
        if (this.m_intensifyView == null) {
            this.m_intensifyView = instantiate(this.m_intensifyViewPrefab);
            GameUIManager.instance.node.addChild(this.m_intensifyView);
            this.m_intensifyView = this.m_intensifyView.getComponent(IntensifyView);
        }
        this.m_intensifyView.show();
    }

    setShowDestroy(bShow: boolean) {
        this.m_destroyNode.active = bShow;
    }

    isInDestroy(world_pos: Vec2) {
        const pos = this.m_destroyNode.getComponent(UITransform).convertToNodeSpaceAR(v3(world_pos.x, world_pos.y));
        return pos.x < 50 && pos.x > -50 && pos.y < 50 && pos.y > -50;
    }
}
