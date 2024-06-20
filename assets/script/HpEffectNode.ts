import { _decorator, Component, Node, NodePool, Label, Vec2, v2, cardinalSplineBy, delayTime, fadeTo, callFunc, sequence, spawn } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('HpEffect')
export class HpEffect extends Component {

    @property(Node)
    m_hpEffectItem: Node = null;

    private hpEffectPool: NodePool = new NodePool();

    onLoad() {
        // @ts-ignore
        window.g_hpEffect = this;
    }

    start() {

    }

    createHpEffect(pos: Vec2, str: string) {
        let node: Node;
        if (this.hpEffectPool.size() > 0) { 
            node = this.hpEffectPool.get();
        } else {
            node = instantiate(this.m_hpEffectItem);
        }
        const label = node.getComponent(Label);
        label.string = str;

        node.active = true;
        node.opacity = 255;
        node.setPosition(pos);
        this.node.addChild(node);
        const left = randomNum(0, 100) > 50;
        const moveList: Vec2[] = [];
        moveList.push(v2(0, 0));
        const dir = left ? 1 : -1;

        let x = randomNum(0, 50);
        let y = randomNum(50, 130);
        moveList.push(v2(x * dir, y));

        x = randomNum(60, 100);
        y = randomNum(10, 40);
        moveList.push(v2(x * dir, -y));

        const spline = cardinalSplineBy(0.5, moveList, 0);
        const seq = sequence(
            delayTime(0.3),
            fadeTo(0.2, 0),
            callFunc(() => {
                this.hpEffectPool.put(node); 
            })
        );

        node.runAction(spawn(spline, seq));
    }
}
