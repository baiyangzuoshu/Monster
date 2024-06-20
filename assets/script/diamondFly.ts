import { _decorator, Component, Node, v2, instantiate, cardinalSplineTo, callFunc, sequence, scaleTo, fadeIn, fadeOut, spawn } from 'cc';
const { ccclass, property } = _decorator;

import { randomNum, getAngle } from './utils';  // 假设randomNum和getAngle是你定义的实用函数

@ccclass('DiamondFly')
export class DiamondFly extends Component {

    @property(Node)
    m_itemDiamond: Node = null;

    @property(Node)
    m_targetDiamond: Node = null;

    @property(Node)
    m_targetDiamondLight: Node = null;

    onLoad() {
        // @ts-ignore
        window.g_diamondFly = this;
    }

    createDiamondToTip(targetNode: Node, endCallBack: Function, diamond: number, parent: Node) {
        const node = instantiate(this.m_itemDiamond);
        node.setScale(v2(0, 0));

        let startPos: cc.Vec2;
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

        const moveList: cc.Vec2[] = [];

        moveList.push(startPos);

        const endPos = this.node.getComponent(UITransform).convertToNodeSpaceAR(targetWorldPos);
        const angle = getAngle(startPos, endPos);

        const offset = randomNum(25, 65);
        const adjustedAngle = left === -1 ? angle + offset : angle - offset;
        const dis = randomNum(120, 180);

        const x = Math.cos(adjustedAngle * (Math.PI / 180)) * dis;
        const y = Math.sin(adjustedAngle * (Math.PI / 180)) * dis;

        moveList.push(v2(startPos.x + x, startPos.y + y));
        moveList.push(endPos);

        const spline = cardinalSplineTo(1, moveList, 0);

        const callBack = callFunc(() => {
            if (!this.m_targetDiamond.scaleToBig) {
                this.m_targetDiamond.scaleToBig = true;
                const seq = sequence(
                    scaleTo(0.1, 1.5, 1.5),
                    scaleTo(0.1, 1, 1),
                    callFunc(() => {
                        this.m_targetDiamond.scaleToBig = false;
                    })
                );
                this.m_targetDiamond.runAction(seq);

                this.m_targetDiamondLight.opacity = 0;
                const seqLight = sequence(
                    fadeIn(0.1),
                    fadeOut(0.1)
                );
                this.m_targetDiamondLight.runAction(seqLight);
            }

            if (endCallBack != null) {
                endCallBack(diamond);
            }
            node.destroy();
        });

        const seq = sequence(spline, callBack);
        const scaleToBig = scaleTo(0.2, 1, 1);
        const scaleToSmall = scaleTo(0.8, 0.3, 0.3);
        const sp = spawn(seq, sequence(scaleToBig, scaleToSmall));

        node.runAction(sp);
    }
}
