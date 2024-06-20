import { _decorator, Component } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BulletBuild')
export class BulletBuild extends Component {

    onLoad() {
        window['g_bulletBuild'] = this;
    }

    start() {
        // Initialization code here
    }

    update(dt: number) {
        // Update code here
    }
}

export default BulletBuild;
