import { _decorator, Component, Node, UITransform, Vec3, v3, v2, instantiate, tween, Tween, Color, Sprite } from 'cc';
import { getAngle, randomNum } from './utlis';
const { ccclass, property } = _decorator;

@ccclass('DiamondFlyManager')
export class DiamondFlyManager extends Component {

    @property(Node)
    m_itemDiamond: Node = null;

    @property(Node)
    m_targetDiamond: Node = null;

    @property(Node)
    m_targetDiamondLight: Node = null;

    private static _instance: DiamondFlyManager;

    static get instance() {
        return this._instance;
    }

    onLoad() {
        if (DiamondFlyManager._instance) {
            this.destroy();
            return;
        }
        DiamondFlyManager._instance = this;
    }

    start() {
        // Initialization code here
    }

    createDiamondToTip(targetNode: Node, endCallBack: Function, diamond: number, parent: Node=null) {
        const node = instantiate(this.m_itemDiamond);
        node.setScale(v3(0, 0, 0));

        let startPos: Vec3;
        if (targetNode == null) {
            startPos = node.getPosition();
        } else {
            startPos = targetNode.getWorldPosition();
            startPos = this.node.getComponent(UITransform).convertToNodeSpaceAR(startPos);
        }

        const targetWorldPos = this.m_targetDiamond.getWorldPosition();

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

        const endPos = this.node.getComponent(UITransform).convertToNodeSpaceAR(targetWorldPos);
        const angle = getAngle(startPos, endPos);

        const offset = randomNum(25, 65);
        const adjustedAngle = left === -1 ? angle + offset : angle - offset;
        const dis = randomNum(120, 180);

        const x = Math.cos(adjustedAngle * (Math.PI / 180)) * dis;
        const y = Math.sin(adjustedAngle * (Math.PI / 180)) * dis;

        moveList.push(v3(startPos.x + x, startPos.y + y, 0));
        moveList.push(endPos);

        // 使用 tween 实现动画效果
        const diamondTween = tween(node)
            .to(0.2, { scale: v3(1, 1, 1) })
            .then(this.createSplineTween(node, moveList, 1))
            .call(() => {
                if (!this.m_targetDiamond['scaleToBig']) {
                    this.m_targetDiamond['scaleToBig'] = true;
                    tween(this.m_targetDiamond)
                        .to(0.1, { scale: v3(1.5, 1.5, 1.5) })
                        .to(0.1, { scale: v3(1, 1, 1) })
                        .call(() => {
                            this.m_targetDiamond['scaleToBig'] = false;
                        })
                        .start();

                    // 获取渲染组件并调整透明度
                    const sprite = this.m_targetDiamondLight.getComponent(Sprite);
                    if (sprite) {
                        sprite.color = new Color(255, 255, 255, 0);  // 设置透明度为0
                        tween(sprite)
                            .to(0.1, { color: new Color(255, 255, 255, 255) })  // 淡入
                            .to(0.1, { color: new Color(255, 255, 255, 0) })  // 淡出
                            .start();
                    }
                }

                if (endCallBack != null) {
                    endCallBack(diamond);
                }
                node.destroy();
            })
            .start();
    }

    createSplineTween(node: Node, points: Vec3[], duration: number): Tween<Node> {
        let totalLength = 0;
        for (let i = 1; i < points.length; i++) {
            totalLength += Vec3.distance(points[i - 1], points[i]);
        }

        const tweens: Tween<Node>[] = [];
        for (let i = 1; i < points.length; i++) {
            const segmentLength = Vec3.distance(points[i - 1], points[i]);
            const segmentDuration = duration * (segmentLength / totalLength);
            tweens.push(tween(node).to(segmentDuration, { position: points[i] }));
        }

        return tweens.reduce((prev, curr) => prev.then(curr));
    }
}

export default DiamondFlyManager;
