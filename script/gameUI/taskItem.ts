import { _decorator, Component, Node, Label, ProgressBar, Button, v2, moveTo, runAction, delayTime, callFunc, sequence } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TaskItem')
export class TaskItem extends Component {

    @property(Label)
    m_title: Label = null;

    @property(Label)
    m_curLabel: Label = null;

    @property(ProgressBar)
    m_progressBar: ProgressBar = null;

    @property(Label)
    m_awardLabel: Label = null;

    @property(Button)
    m_getButton: Button = null;

    @property(Node)
    m_awardCoin: Node = null;

    @property(Node)
    m_awardDiamond: Node = null;

    private m_taskID: number = 0;

    start() {
        // Initialization code here
    }

    setTaskID(taskID: number) {
        this.m_taskID = taskID;
    }

    updateItem() {
        this.m_getButton.interactable = false;
        const data = g_taskData.getData();
        const taskData = g_taskData.getTaskDataByID(this.m_taskID);
        if (this.m_taskID >= data.length) {
            return;
        }
        const curTaskData = g_dataManager.getTaskByID(this.m_taskID);
        const title = g_taskData.getTitle(this.m_taskID, curTaskData.maxIndex);
        this.m_title.string = title;

        const maxCount = g_taskData.getMaxCount(this.m_taskID, curTaskData.maxIndex);

        if (curTaskData.curCount >= maxCount) {
            curTaskData.curCount = maxCount;
            this.m_getButton.interactable = true;
        }

        const curLabel = `${curTaskData.curCount}/${maxCount}`;
        this.m_curLabel.string = curLabel;
        const pre = curTaskData.curCount / maxCount;
        this.m_progressBar.progress = pre;

        if (taskData.taskType == 0) {
            this.m_awardCoin.active = true;
            this.m_awardDiamond.active = false;
        } else {
            this.m_awardCoin.active = false;
            this.m_awardDiamond.active = true;
        }

        this.m_awardLabel.string = `${g_taskData.getAward(this.m_taskID, curTaskData.maxIndex)}`;
    }

    goldFlyEnd(gold: number) {
        g_dataManager.addGold(gold);
        g_gameUI.updateGameUI();
    }

    diamondFlyEnd(diamond: number) {
        g_dataManager.addDiamond(diamond);
        g_gameUI.updateGameUI();
    }

    onClickGet() {
        const curTaskData = g_dataManager.getTaskByID(this.m_taskID);
        const award = g_taskData.getAward(this.m_taskID, curTaskData.maxIndex);
        const taskData = g_taskData.getTaskDataByID(this.m_taskID);
        let count = 50;

        const createFly = () => {
            if (taskData.taskType == 0) {
                const value = Math.floor(award / count);
                g_coinFly.createCoinToTip(this.m_awardCoin, this.goldFlyEnd.bind(this), value, g_gameUI.m_coinFlyNode);
            }
            if (taskData.taskType == 1) {
                const value = Math.floor(award / count);
                g_diamondFly.createDiamondToTip(this.m_awardCoin, this.diamondFlyEnd.bind(this), value, g_gameUI.m_coinFlyNode);
            }
        };

        const actionList = [];
        if (award < count) {
            count = award;
        }
        for (let i = 0; i < count; i++) {
            actionList.push(delayTime(0.01));
            actionList.push(callFunc(createFly.bind(this)));
        }
        actionList.push(callFunc(() => {
            if (taskData.taskType == 0) {
                g_dataManager.setGold(award);
            } else {
                g_dataManager.setDiamond(award);
            }
            g_gameUI.updateGameUI();
        }));

        this.node.runAction(sequence(...actionList));

        g_dataManager.nextTask(this.m_taskID);
        this.updateItem();
    }

    // update(dt: number) {
    //     // Update code here
    // }
}
