import { Tween } from 'cc';
import { _decorator, Component, Node, NodePool, Label, Vec2, v2, tween, instantiate, UIOpacity, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

function randomNum(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

@ccclass('HpEffect')
export class HpEffect extends Component {

    @property(Node)
    m_hpEffectItem: Node = null;

    private hpEffectPool: NodePool = new NodePool();
    private static _instance: HpEffect = null;

    public static get instance(): HpEffect {
        return this._instance;
    }

    onLoad() {
        HpEffect._instance = this;
        // @ts-ignore
    }

    createHpEffect(pos: Vec2, str: string) {
        let node: Node;
        if (this.hpEffectPool.size() > 0) {
            node = this.hpEffectPool.get();
        } else {
            node = instantiate(this.m_hpEffectItem);
        }
        const label = node.getComponent(Label);
        if (label) {
            label.string = str;
        }

        node.active = true;
        node.setPosition(pos.x, pos.y, 0);

        // Add UIOpacity component if not already present
        let uiOpacity = node.getComponent(UIOpacity);
        if (!uiOpacity) {
            uiOpacity = node.addComponent(UIOpacity);
        }
        uiOpacity.opacity = 255;

        this.node.addChild(node);

        const left = randomNum(0, 100) > 50;
        const dir = left ? 1 : -1;

        const moveList: Vec2[] = [];
        moveList.push(v2(0, 0));

        let x = randomNum(0, 50);
        let y = randomNum(50, 130);
        moveList.push(v2(x * dir, y));

        x = randomNum(60, 100);
        y = randomNum(10, 40);
        moveList.push(v2(x * dir, -y));

        const splinePoints = moveList.map(point => new Vec2(point.x, point.y));
        const duration = 0.5;

        const moveTween = this.createSplineTween(node, splinePoints, duration);
        const fadeTween = tween(uiOpacity)
            .delay(0.3)
            .to(0.2, { opacity: 0 })
            .call(() => {
                this.hpEffectPool.put(node);
            });

        moveTween.start();
        fadeTween.start();
    }

    createSplineTween(node: Node, points: Vec2[], duration: number): Tween<Node> {
        const totalLength = points.reduce((acc, point, index) => {
            if (index === 0) return acc;
            return acc + Vec2.distance(points[index - 1], point);
        }, 0);

        const tweens: Tween<Node>[] = [];
        for (let i = 1; i < points.length; i++) {
            const segmentLength = Vec2.distance(points[i - 1], points[i]);
            const segmentDuration = duration * (segmentLength / totalLength);
            tweens.push(tween(node).to(segmentDuration, { position: new Vec3(points[i].x, points[i].y, 0) }));
        }

        return tweens.reduce((prev, curr) => prev.then(curr));
    }
}

export default HpEffect;
