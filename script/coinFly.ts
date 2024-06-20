import { _decorator, Component, Node, instantiate, v2, Vec2, Vec3, tween, Tween, easing, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CoinFly')
export class CoinFly extends Component {

    @property(Node)
    m_itemCoin: Node = null;

    @property(Node)
    m_targetCoin: Node = null;

    @property(Node)
    m_targetCoinLight: Node = null;

    onLoad() {
        window['g_coinFly'] = this;
    }

    start() {
        // Initialization code here
    }

    createCoinToTip(targetNode: Node, endCallBack: Function, gold: number, parent: Node) {
        const node = instantiate(this.m_itemCoin);
        node.setScale(new Vec3(0, 0, 0));

        let startPos: Vec3;
        if (targetNode == null) {
            startPos = node.getPosition();
        } else {
            startPos = targetNode.convertToWorldSpaceAR(new Vec3(0, 0, 0));
            startPos = this.node.convertToNodeSpaceAR(startPos);
        }

        const targetWorldPos = this.m_targetCoin.convertToWorldSpaceAR(new Vec3(0, 0, 0));

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

        const moveList: Vec3[] = [];
        moveList.push(startPos);

        const endPos = this.node.convertToNodeSpaceAR(targetWorldPos);
        let angle = getAngle(startPos, endPos);

        const offset = randomNum(25, 65);
        if (left == -1) {
            angle += offset;
        } else {
            angle -= offset;
        }
        const dis = randomNum(120, 180);

        const x = Math.cos(angle * (Math.PI / 180)) * dis;
        const y = Math.sin(angle * (Math.PI / 180)) * dis;

        moveList.push(new Vec3(startPos.x + x, startPos.y + y, startPos.z));
        moveList.push(endPos);

        const spline = tween(node).to(1, { position: moveList }, { easing: 'cubicOut' });

        const callBack = () => {
            if (!this.m_targetCoin['scaleToBig']) {
                this.m_targetCoin['scaleToBig'] = true;
                const seq = tween(this.m_targetCoin)
                    .to(0.1, { scale: new Vec3(1.5, 1.5, 1.5) }, { easing: 'quadOut' })
                    .to(0.1, { scale: new Vec3(1, 1, 1) }, { easing: 'quadIn' })
                    .call(() => {
                        this.m_targetCoin['scaleToBig'] = false;
                    })
                    .start();

                this.m_targetCoinLight.opacity = 0;
                tween(this.m_targetCoinLight)
                    .to(0.1, { opacity: 255 }, { easing: 'quadOut' })
                    .to(0.1, { opacity: 0 }, { easing: 'quadIn' })
                    .start();
            }

            if (endCallBack != null) {
                endCallBack(gold);
            }
            node.destroy();
        };

        const seq = tween(node)
            .sequence(spline, tween().call(callBack))
            .start();

        tween(node)
            .parallel(
                tween().sequence(tween().to(0.2, { scale: new Vec3(1, 1, 1) }), tween().to(0.8, { scale: new Vec3(0.3, 0.3, 0.3) })),
                seq
            )
            .start();
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
