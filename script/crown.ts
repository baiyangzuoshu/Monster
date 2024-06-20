import { _decorator, Component, Node, Vec2, Vec3, tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MyComponent')
export class MyComponent extends Component {

    @property(Node)
    m_crown: Node = null;

    @property(Node)
    m_diamond: Node = null;

    @property(Node)
    m_light: Node = null;

    onLoad() {
        this.moveUpDown(this.m_crown, 5);
        this.moveUpDown(this.m_diamond, -5);
        this.moveUpDown(this.m_light, -5);

        this.m_light.setScale(new Vec3(0.6, 0.6, 0.6));
        const scaleTo = { scale: new Vec3(1.2, 1.2, 1.2) };
        const fade = { opacity: 100 };

        tween(this.m_light)
            .to(0.5, scaleTo)
            .to(0.5, fade)
            .call(() => {
                this.m_light.setScale(new Vec3(0.6, 0.6, 0.6));
                this.m_light.opacity = 255;
            })
            .repeatForever()
            .start();
    }

    start() {
        // Initialization code here
    }

    moveUpDown(node: Node, offset: number) {
        const pos = node.getPosition();
        const moveUp = { position: new Vec3(pos.x, pos.y + offset, pos.z) };
        const moveDown = { position: new Vec3(pos.x, pos.y - offset, pos.z) };

        tween(node)
            .sequence(
                tween().to(1, moveUp),
                tween().to(1, moveDown)
            )
            .repeatForever()
            .start();
    }
}
