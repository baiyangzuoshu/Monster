import { _decorator, Component, Node, Label, ProgressBar, Button, tween, Vec3, UITransform } from 'cc';
import { CoinFlyManager } from '../coinFly';
import { DataManager } from '../data/dataManager';
import { g_taskData } from '../data/taskData';
import DiamondFlyManager from '../diamondFly';
import { GameUIManager } from './gameUI';
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
        const curTaskData = DataManager.getTaskByID(this.m_taskID);
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
        DataManager.addGold(gold);
        GameUIManager.instance.updateGameUI();
    }

    diamondFlyEnd(diamond: number) {
        DataManager.addDiamond(diamond);
        GameUIManager.instance.updateGameUI();
    }

    onClickGet() {
        const curTaskData = DataManager.getTaskByID(this.m_taskID);
        const award = g_taskData.getAward(this.m_taskID, curTaskData.maxIndex);
        const taskData = g_taskData.getTaskDataByID(this.m_taskID);
        let count = 50;

        const createFly = () => {
            if (taskData.taskType == 0) {
                const value = Math.floor(award / count);
                CoinFlyManager.instance.createCoinToTip(this.m_awardCoin, this.goldFlyEnd.bind(this), value, GameUIManager.instance.m_coinFlyNode);
            }
            if (taskData.taskType == 1) {
                const value = Math.floor(award / count);
                DiamondFlyManager.instance.createDiamondToTip(this.m_awardCoin, this.diamondFlyEnd.bind(this), value, GameUIManager.instance.m_coinFlyNode);
            }
        };

        let i = 0;
        const flyInterval = setInterval(() => {
            if (i < count) {
                createFly();
                i++;
            } else {
                clearInterval(flyInterval);
                if (taskData.taskType == 0) {
                    DataManager.setGold(award);
                } else {
                    DataManager.setDiamond(award);
                }
                GameUIManager.instance.updateGameUI();
            }
        }, 10);

        DataManager.nextTask(this.m_taskID);
        this.updateItem();
    }

    // update(dt: number) {
    //     // Update code here
    // }
}
