import { _decorator, Component, Node, instantiate } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TaskView')
export class TaskView extends Component {

    @property(Node)
    m_cloneItem: Node = null;

    @property(Node)
    m_content: Node = null;

    private m_item: any[] = [];
    private m_selectId: number = 0;

    onLoad() {
        window['g_taskView'] = this;
        this.m_cloneItem.active = false;
        this.m_item = [];
        this.m_selectId = 0;
        this.updateData();
    }

    start() {
        // Initialization code here
    }

    show() {
        this.updateData();
        this.node.active = true;
    }

    hide() {
        this.node.active = false;
    }

    updateData() {
        for (let i = 0; i < this.m_item.length; i++) {
            this.m_item[i].node.active = false;
        }

        const data = g_taskData.getData();
        for (let i = 0; i < data.length; i++) {
            if (data[i].taskType != this.m_selectId) {
                continue;
            }
            if (this.m_item[i] == null) {
                this.m_item[i] = this.createItem(i);
            }
            this.m_item[i].node.active = true;
            this.m_item[i].updateItem();
        }
    }

    createItem(taskID: number) {
        let item = instantiate(this.m_cloneItem);
        this.m_content.addChild(item);
        item.active = true;
        item = item.getComponent('taskItem');
        item.setTaskID(taskID);
        return item;
    }

    onChangeClick(target: Node, data: string) {
        this.m_selectId = parseInt(data);
        this.updateData();
    }

    // update(dt: number) {
    //     // Update code here
    // }
}
