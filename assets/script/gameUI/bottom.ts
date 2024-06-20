import { _decorator, Component, Node, Label, Prefab, instantiate, rotateTo, callFunc, sequence, Animation } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BottomUI')
export class BottomUI extends Component {

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

    onLoad() {
        window['g_bottomUI'] = this;
        this.updateGameUI();
        this.setShowDestroy(false);
    }

    start() {
        // Initialization code here
    }

    onClickMake() {
        if (!g_game.isGameStart()) {
            return;
        }

        const index = g_cannonBuild.getCanMakeIndex();
        if (index == null) {
            return;
        }
        if (this.m_canMakeCount == 0) {
            return;
        }
        if (!this.m_hammerAction) {
            const rot1 = rotateTo(0.2, -90);
            const rot2 = rotateTo(0.2, 0);
            const callFuncAction = callFunc(() => {
                this.m_hammerAction = false;
            });
            const seq = sequence(rot1, rot2, callFuncAction);
            this.m_hammer.runAction(seq);

            this.m_hammerAction = true;
        }
        this.subMakeNumber();
        g_cannonBuild.cannonBuild(index);
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
            this.m_water.height = 0;
        }
        this.updateMakeCount();
    }

    updateMakeCount() {
        this.m_makeNumberLabel.string = `${this.m_canMakeCount}/${this.m_maxMakeCount}`;
    }

    update(dt: number) {
        if (this.m_canMakeCount < this.m_maxMakeCount) {
            this.m_water.height += dt * 50;
            this.m_waterAction = true;
            if (this.m_water.height >= 133) {
                this.addMakeNumber();
                if (this.m_canMakeCount == this.m_maxMakeCount) {
                    this.m_water.height = 133;
                    this.m_waterAction = false;
                } else {
                    this.m_water.height = 0;
                }
            }
        }
    }

    onClickAutoMake() {
        if (!g_game.isGameStart()) {
            return;
        }
        g_cannonBuild.autoMerge();
    }

    updateGameUI() {
        if (!this.m_waterAction) {
            this.m_water.height = 0;
        }

        const lv = g_dataManager.getInternsifLevel(INTENSIFY_KUORONG);
        this.m_maxMakeCount = g_intensifyData.getValue(INTENSIFY_KUORONG, lv);
        this.updateMakeCount();
    }

    showTaskView() {
        if (this.m_taskView == null) {
            this.m_taskView = instantiate(this.m_taskViewPrefab);
            g_gameUI.node.addChild(this.m_taskView);
            this.m_taskView = this.m_taskView.getComponent('taskView');
        }
        this.m_taskView.show();
    }

    showIntensifyView() {
        if (this.m_intensifyView == null) {
            this.m_intensifyView = instantiate(this.m_intensifyViewPrefab);
            g_gameUI.node.addChild(this.m_intensifyView);
            this.m_intensifyView = this.m_intensifyView.getComponent('intensifyView');
        }
        this.m_intensifyView.show();
    }

    setShowDestroy(bShow: boolean) {
        this.m_destroyNode.active = bShow;
    }

    isInDestroy(world_pos: Node) {
        const pos = this.m_destroyNode.convertToNodeSpaceAR(world_pos.getPosition());
        return pos.x < 50 && pos.x > -50 && pos.y < 50 && pos.y > -50;
    }
}
