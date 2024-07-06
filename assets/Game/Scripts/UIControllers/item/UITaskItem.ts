import { UIComponent } from '../../../../Framework/Scripts/UI/UIComponent';
import { DataManager } from '../../../../script/data/dataManager';
import { g_taskData } from '../../../../script/data/taskData';
import { Button } from 'cc';
import { ProgressBar } from 'cc';
import { Label } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { UIEventName } from '../../Constants';
import { CoinFlyManager } from '../../../../script/coinFly';
import DiamondFlyManager from '../../../../script/diamondFly';
const { ccclass, property } = _decorator;

@ccclass('UITaskItem')
export class UITaskItem extends UIComponent {
    m_title: Label = null;
    m_curLabel: Label = null;
    m_progressBar: ProgressBar = null;
    m_awardLabel: Label = null;
    m_getButton: Button = null;
    m_awardCoin: Node = null;
    m_awardDiamond: Node = null;

    private m_taskID: number = 0;

    onLoad() {
        this.m_title = this.ViewComponent("title", Label);
        this.m_curLabel = this.ViewComponent("curLabel", Label);
        this.m_progressBar = this.ViewComponent("progressBar", ProgressBar);
        this.m_awardLabel = this.ViewComponent("ui_win_numbg_rect/award", Label);
        this.m_getButton = this.ViewComponent("get", Button);
        this.m_awardCoin = this.ViewNode("ui_win_numbg_rect/ui_coin");
        this.m_awardDiamond = this.ViewNode("ui_win_numbg_rect/ui_diamond");
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
        this.EmitEventListener(UIEventName.updateGameUI);
    }

    diamondFlyEnd(diamond: number) {
        DataManager.addDiamond(diamond);
        this.EmitEventListener(UIEventName.updateGameUI);
    }

    onClickGet() {
        const curTaskData = DataManager.getTaskByID(this.m_taskID);
        const award = g_taskData.getAward(this.m_taskID, curTaskData.maxIndex);
        const taskData = g_taskData.getTaskDataByID(this.m_taskID);
        let count = 50;

        const createFly = () => {
            if (taskData.taskType == 0) {
                const value = Math.floor(award / count);
                CoinFlyManager.instance.createCoinToTip(this.m_awardCoin, this.goldFlyEnd.bind(this), value);
            }
            if (taskData.taskType == 1) {
                const value = Math.floor(award / count);
                DiamondFlyManager.instance.createDiamondToTip(this.m_awardCoin, this.diamondFlyEnd.bind(this), value);
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
                this.EmitEventListener(UIEventName.updateGameUI);
            }
        }, 10);

        DataManager.nextTask(this.m_taskID);
        this.updateItem();
    }

}

