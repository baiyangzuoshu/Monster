import { tween } from 'cc';
import { UIComponent } from '../../../Framework/Scripts/UI/UIComponent';
import { _decorator, Component, Node } from 'cc';
import { v3 } from 'cc';
import { ProgressBar } from 'cc';
import { Sprite } from 'cc';
import { UITransform } from 'cc';
import { CircleCollider2D } from 'cc';
import { SpriteAtlas } from 'cc';
import { ResManager } from '../../../Framework/Scripts/Managers/ResManager';
import { BundleName } from '../Constants';
import { Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Monster')
export class Monster extends UIComponent {
    private m_type: number = 0;
    private m_index: number = 0;

    m_itemNode: Node = null;
    m_scaleItem: Node = null;
    m_itemSprite: Node[] = [];
    m_HpBar: ProgressBar = null;
    m_diamond: Node = null;
    m_slow: Node = null;
    m_monsterTexture:SpriteAtlas[]=[];

    onLoad() {
        this.m_itemNode=this.ViewNode("item");
        this.m_scaleItem=this.ViewNode("item/scale");
        this.m_itemSprite[0]=this.ViewNode("item/scale/right");
        this.m_itemSprite[1]=this.ViewNode("item/scale/left");
        this.m_HpBar=this.ViewNode("item/hp/bar").getComponent(ProgressBar);
        this.m_diamond=this.ViewNode("diamond");
        this.m_slow=this.ViewNode("ui_enemy_slow");

        this.scaleAction();
    }

    public async init(){
        for(let i=0;i<4;i++){
            let spriteAtlas=await ResManager.Instance.IE_GetAsset(BundleName.Atlas,"monster_"+i,SpriteAtlas) as SpriteAtlas;
            this.m_monsterTexture.push(spriteAtlas);
        }
    }

    public updateDir(start: Vec3, end: Vec3) {
        if (end.x > start.x) {
            this.m_itemSprite[0].active = true;
            this.m_itemSprite[1].active = false;
        } else if (end.x < start.x) {
            this.m_itemSprite[0].active = false;
            this.m_itemSprite[1].active = true;
        }
    }

    setImage(type: number, index: number) {
        if (type < 0 || type >= this.m_monsterTexture.length) {
            return;
        }
        const frame = this.m_monsterTexture[type].getSpriteFrame('' + index);
        if (!frame) {
            console.log('setImage:', type, ' index:', index);
            return;
        }
        this.m_type = type;
        this.m_index = index;
        let width: number;
        let height: number;
        for (let i = 0; i < this.m_itemSprite.length; i++) {
            const sprite = this.m_itemSprite[i].getComponent(Sprite);
            sprite.spriteFrame = frame;
            width = sprite.node.getComponent(UITransform).width;
            height = sprite.node.getComponent(UITransform).height;
        }

        this.updateCollider(width, height);
        this.updateHpSize(width, height);
    }

    updateHpSize(width: number, height: number) {
        this.m_HpBar.node.getComponent(UITransform).width = width;
        this.m_HpBar.node.getComponent(UITransform).height = height;
        this.m_HpBar.totalLength = width;
    }

    updateCollider(width: number, height: number) {
        const box = this.m_itemNode.getComponent(CircleCollider2D);
        box.radius = width * 0.8 / 2;
        box.offset.y = height / 2;
    }

    scaleAction() {
        const moveList = [];
        const scale = tween().to(0.5, { scale: v3(0.8, 1.2) });
        const move = tween().by(0.5, { position: v3(0, 80) });
        const sp = tween().parallel(scale, move);
        moveList.push(sp);

        const scale2 = tween().to(0.5, { scale: v3(1, 1) });
        const move2 = tween().by(0.5, { position: v3(0, -80) });
        const sp2 = tween().parallel(scale2, move2);
        moveList.push(sp2);

        const callFunc = tween().call(() => {
            if (this.m_type > 0) {
                tween(this.m_scaleItem)
                    .repeatForever(
                        tween().sequence(
                            tween().to(0.5, { scale: v3(1.1, 0.9) }),
                            tween().to(0.5, { scale: v3(0.9, 1.1) })
                        )
                    )
                    .start();
            } else {
                tween(this.m_itemNode)
                    .repeatForever(
                        tween().sequence(
                            tween().by(0.2, { position: v3(0, 30) }),
                            tween().by(0.2, { position: v3(0, -30) })
                        )
                    )
                    .start();
            }
        });
        moveList.push(callFunc);
        tween(this.m_itemNode).sequence(...moveList).start();
    }
}

