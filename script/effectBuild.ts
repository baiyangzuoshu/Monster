import { _decorator, Component, Node, instantiate, Animation, Label, v2, Vec3, sequence, scaleTo, fadeOut, callFunc } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('EffectBuild')
export class EffectBuild extends Component {

    @property(Node)
    m_deadEffect: Node = null;

    @property(Node)
    m_deadHp: Node = null;

    onLoad() {
        // @ts-ignore
        window.g_effectBuild = this;
    }

    createDeadEffect(pos: Vec3) {
        const effect = instantiate(this.m_deadEffect);
        this.node.addChild(effect);
        effect.active = true;
        effect.setPosition(pos);

        const anim = effect.getComponent(Animation);
        anim.on('finished', () => {
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

        const seq = sequence(
            scaleTo(0.1, 1.3, 1.3),
            scaleTo(0.1, 1, 1),
            fadeOut(0.5),
            callFunc(() => {
                hp.removeFromParent();
                hp.destroy();
            })
        );
        hp.runAction(seq);
    }
}
