import { _decorator, Component, Node, instantiate, Animation, Label, Vec3, tween, v3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('EffectBuild')
export class EffectBuild extends Component {

    @property(Node)
    m_deadEffect: Node = null;

    @property(Node)
    m_deadHp: Node = null;

    private static _instance: EffectBuild = null;

    public static get instance(): EffectBuild {
        return this._instance;
    }

    onLoad() {
        EffectBuild._instance = this;
    }

    createDeadEffect(pos: Vec3) {
        const effect = instantiate(this.m_deadEffect);
        this.node.addChild(effect);
        effect.active = true;
        effect.setPosition(pos);

        const anim = effect.getComponent(Animation);
        anim.on(Animation.EventType.FINISHED, () => {
            effect.removeFromParent();
            effect.destroy();
        });
        anim.play('deadEffect');
    }

    createHpLabel(pos: Vec3, number: string) {
        const hp = instantiate(this.m_deadHp);
        this.node.addChild(hp);
        hp.active = true;
        hp.setPosition(pos);

        const hpLabel = hp.getComponent(Label);
        hpLabel.string = number;

        tween(hp)
            .to(0.1, { scale: v3(1.3, 1.3, 1) })
            .to(0.1, { scale: v3(1, 1, 1) })
            .call(() => {
                hp.removeFromParent();
                hp.destroy();
            })
            .start();
    }
}

export default EffectBuild;
