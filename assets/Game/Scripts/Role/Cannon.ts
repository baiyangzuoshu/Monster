import { g_GlobalData } from '../../../script/data/data';
import { UIComponent } from '../../../Framework/Scripts/UI/UIComponent';
import { _decorator, Component, Node } from 'cc';
import { v3 } from 'cc';
import { tween } from 'cc';
import { instantiate } from 'cc';
import { Sprite } from 'cc';
import { Label } from 'cc';
import { SpriteAtlas } from 'cc';
import { Prefab } from 'cc';
import { ResManager } from '../../../Framework/Scripts/Managers/ResManager';
import { BundleName } from '../Constants';
import { ECSWorld } from '../ECS/ECSWorld';
const { ccclass, property } = _decorator;

@ccclass('Cannon')
export class Cannon extends UIComponent {

    m_gunNode: Node = null;
    m_padNode: Node = null;
    m_hintNode: Node = null;
    m_rangeNode: Node = null;
    m_labLevel:Label = null;
    
    m_isFlying: boolean = true;
    m_isCanLockEnemy: boolean = false;
    m_gunSprite: Node = null;
    m_type: number = 0;
    m_levelData: number = -1;

    m_gunAtlas: SpriteAtlas = null;
    m_padAtlas: SpriteAtlas = null;

    m_gunPrefab: Prefab[] = [];

    protected onLoad(): void {
        this.m_labLevel=this.ViewComponent("ui_towerLevel/lv",Label);
        this.m_gunNode=this.ViewNode("gun");
        this.m_padNode=this.ViewNode("pad");
        this.m_hintNode=this.ViewNode("ui_mergeRemind");
        this.m_rangeNode=this.ViewNode("range");
    }

    async init(){

        this.m_gunAtlas=await ResManager.Instance.IE_GetAsset(BundleName.Atlas,"gun",SpriteAtlas) as SpriteAtlas;
        this.m_padAtlas=await ResManager.Instance.IE_GetAsset(BundleName.Atlas,"pad",SpriteAtlas) as SpriteAtlas;

        for(let i=0;i<7;i++){
            this.m_gunPrefab[i]=await ResManager.Instance.IE_GetAsset(BundleName.Role,"gun/gun_"+i,Prefab) as Prefab;
        }
    }

    setRot(rot: number) {
        this.m_gunNode.angle = rot;
    }

    setFlying(fly: boolean) {
        this.m_isFlying = fly;
    }

    openLockEnemy() {
        this.m_isCanLockEnemy = true;
    }

    effectAction() {
        const self = instantiate(this.node);
        this.node.addChild(self);
        self.setPosition(v3(0, 0));
        tween(self)
            .to(0.1, { scale: v3(4, 4,0) })
            .destroySelf()
            .start();
    }

    updateStyle() {
        const lvData = g_GlobalData.cannonUpLevel[this.m_levelData];
        const type = lvData.type;
        const level = lvData.level;

        this.m_type = type;
        const name = '' + type + '_' + level;
        const frame = this.m_gunAtlas.getSpriteFrame(name);
        this.m_gunSprite.getComponent(Sprite).spriteFrame = frame;

        const index = Math.floor(level / 3);
        const padName = '' + type + '_' + index;
        const padFrame = this.m_padAtlas.getSpriteFrame(padName);
        this.m_padNode.getComponent(Sprite).spriteFrame = padFrame;

        this.m_labLevel.string = '' + (this.m_levelData + 1);
    }

    createGun(curlevel: number) {
        const lvData = g_GlobalData.cannonUpLevel[curlevel];
        const type = lvData.type;
        const level = lvData.level;
        const ATK = lvData.atk;
        
        this.m_type = type;
        this.m_levelData = curlevel;

        this.m_gunSprite = instantiate(this.m_gunPrefab[type]);
        this.m_gunNode.addChild(this.m_gunSprite);
        this.updateStyle();
        if (!this.m_isFlying) {
            this.openLockEnemy();
        }
    }

    showHint() {
        this.m_hintNode.active = true;
    }

    hideHint() {
        this.m_hintNode.active = false;
    }

    showRange() {
        this.m_rangeNode.active = true;
    }

    hideRange() {
        this.m_rangeNode.active = false;
    }

    setTarget(target: Node) {
        
    }

    compare(cannon: Cannon): boolean {
        return this.m_levelData === cannon.m_levelData;
    }

    levelUp() {
        this.setLevel(this.m_levelData + 1);
        this.updateStyle();
    }

    setLevel(lv: number) {
        if (this.m_levelData != lv) {
            this.setTarget(null);
            if (this.m_gunSprite == null) {
                this.createGun(lv);
            } else {
                
            }
        }
        this.m_levelData = lv;
        this.updateStyle();
    }

    async beginFire(target:Node) {
        await ECSWorld.instance.createBullet(target,this.node.getPosition(), this.m_type);
    }
}


