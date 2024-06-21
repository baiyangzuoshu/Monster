import { _decorator, Component, Node, Prefab, instantiate, Vec2, Vec3, tween } from 'cc';
import { GameManager } from './game';
const { ccclass, property } = _decorator;

@ccclass('CrownManager')
export class CrownManager extends Component {

    @property(Prefab)
    m_crown: Prefab = null;

    private static _instance: CrownManager = null;
    private m_curCrown: Node = null;
    private m_nextCrown: Node = null;

    public static get instance(): CrownManager {
        return this._instance;
    }

    onLoad() {
        CrownManager._instance = this;
        this.buildEndPoint();
    }

    start() {
        // Initialization code here
    }

    buildEndPoint() {
        const list = GameManager.instance.getCurPahtList();
        const lastPos = list[list.length - 1];

        const pos = new Vec2(0, 0);
        pos.x = lastPos.x * 106 + 106 / 2;
        pos.y = -lastPos.y * 106 - 106 / 2;

        if (this.m_curCrown == null) {
            this.m_curCrown = instantiate(this.m_crown);
            this.node.addChild(this.m_curCrown);
        }
        pos.y += 25;
        this.m_curCrown.setPosition(new Vec3(pos.x, pos.y, 0));
    }

    show() {
        this.node.active = true;
    }

    hide() {
        this.node.active = false;
    }

    setNextCrownPos(pos: Vec2) {
        if (this.m_nextCrown == null) {
            this.m_nextCrown = instantiate(this.m_crown);
            this.node.addChild(this.m_nextCrown);
        }
        pos.y += 25;
        this.m_nextCrown.setPosition(new Vec3(pos.x, pos.y, 0));
    }

    moveToNextMap() {
        const moveTo = { position: new Vec3(-640, 0, 0) };
        const callFunc = () => {
            this.node.setPosition(new Vec3(-320, 310, 0));
            this.buildEndPoint();
        };

        tween(this.node)
            .by(0.5, moveTo)
            .call(callFunc)
            .start();
    }
}
