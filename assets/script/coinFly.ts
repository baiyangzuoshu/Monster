import { _decorator, Component, Node, instantiate, Vec3, UITransform, tween, Tween, Label, Color, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CoinFlyManager')
export class CoinFlyManager extends Component {

    @property(Node)
    m_itemCoin: Node = null;

    @property(Node)
    m_targetCoin: Node = null;

    @property(Node)
    m_targetCoinLight: Node = null;

    private static _instance: CoinFlyManager;

    static get instance() {
        return this._instance;
    }

    onLoad() {
        if (CoinFlyManager._instance) {
            this.destroy();
            return;
        }
        CoinFlyManager._instance = this;
    }

    start() {
        // Initialization code here
    }

    createCoinToTip(targetNode: Node, endCallBack: Function, gold: number, parent: Node = null) {
        const node = instantiate(this.m_itemCoin);
        node.setScale(new Vec3(0, 0, 0));

        let startPos: Vec3;
        if (targetNode == null) {
            startPos = node.getPosition();
        } else {
            startPos = targetNode.getComponent(UITransform).convertToWorldSpaceAR(new Vec3(0, 0, 0));
            startPos = this.node.getComponent(UITransform).convertToNodeSpaceAR(startPos);
        }

        const targetWorldPos = this.m_targetCoin.getComponent(UITransform).convertToWorldSpaceAR(new Vec3(0, 0, 0));
        const endPos = this.node.getComponent(UITransform).convertToNodeSpaceAR(targetWorldPos);

        let left = -1;
        if (randomNum(0, 100) > 50) {
            left = 1;
        }

        node.active = true;
        if (parent == null) {
            this.node.addChild(node);
        } else {
            parent.addChild(node);
        }

        const angle = getAngle(startPos, endPos);
        const offset = randomNum(25, 65);
        const adjustedAngle = left === -1 ? angle + offset : angle - offset;
        const dis = randomNum(120, 180);

        const x = Math.cos(adjustedAngle * (Math.PI / 180)) * dis;
        const y = Math.sin(adjustedAngle * (Math.PI / 180)) * dis;

        const midPos = new Vec3(startPos.x + x, startPos.y + y, 0);

        const coinTween = tween(node)
            .to(0.2, { scale: new Vec3(1, 1, 1) })
            .to(0.5, { position: midPos }, { easing: 'cubicOut' })
            .to(0.5, { position: endPos }, { easing: 'cubicIn' })
            .call(() => {
                if (!this.m_targetCoin['scaleToBig']) {
                    this.m_targetCoin['scaleToBig'] = true;
                    tween(this.m_targetCoin)
                        .to(0.1, { scale: new Vec3(1.5, 1.5, 1.5) }, { easing: 'quadOut' })
                        .to(0.1, { scale: new Vec3(1, 1, 1) }, { easing: 'quadIn' })
                        .call(() => {
                            this.m_targetCoin['scaleToBig'] = false;
                        })
                        .start();

                    const sprite = this.m_targetCoinLight.getComponent(Sprite);
                    if (sprite) {
                        sprite.color = new Color(255, 255, 255, 0);
                        tween(sprite)
                            .to(0.1, { color: new Color(255, 255, 255, 255) })
                            .to(0.1, { color: new Color(255, 255, 255, 0) })
                            .start();
                    }
                }

                if (endCallBack != null) {
                    endCallBack(gold);
                }
                node.destroy();
            });

        coinTween.start();
    }

    // update (dt) {},
}

function randomNum(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getAngle(start: Vec3, end: Vec3): number {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
    return angle;
}
