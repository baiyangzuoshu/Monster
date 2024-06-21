import { _decorator, Component, Node, instantiate } from 'cc';
import { g_intensifyData } from '../data/intensifyData';
import { IntensifyItem } from './intensifyItem';
const { ccclass, property } = _decorator;

@ccclass('IntensifyView')
export class IntensifyView extends Component {

    @property(Node)
    m_cloneItem: Node = null;

    @property(Node)
    m_content: Node = null;

    private m_item: any[] = [];

    onLoad() {
        this.m_cloneItem.active = false;
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

        const data = g_intensifyData.getData();
        for (let i = 0; i < data.length; i++) {
            if (this.m_item[i] == null) {
                this.m_item[i] = this.createItem(i);
            }
            this.m_item[i].node.active = true;
            this.m_item[i].setID(i);
            this.m_item[i].updateItem();
        }
    }

    createItem(ID: number) {
        let item = instantiate(this.m_cloneItem);
        this.m_content.addChild(item);
        item.active = true;

        let ts = item.getComponent(IntensifyItem);
        ts.setID(ID);
        return item;
    }

    // update(dt: number) {
    //     // Update code here
    // }
}
