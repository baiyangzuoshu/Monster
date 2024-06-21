import { _decorator, Component } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('BulletManager')
export class BulletManager extends Component {
    private static _instance: BulletManager = null;

    static get instance(): BulletManager {
        if (!BulletManager._instance) {
            BulletManager._instance = new BulletManager();
        }
        return BulletManager._instance;
    }

    onLoad() {
        BulletManager._instance = this;
    }

    start() {
        // Initialization code here
    }

    update(dt: number) {
        // Update code here
    }
}

export default BulletManager;
