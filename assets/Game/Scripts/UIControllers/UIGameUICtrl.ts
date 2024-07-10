import { _decorator, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

import { UIComponent } from '../../../Framework/Scripts/UI/UIComponent';
import { PhysicsSystem2D } from 'cc';
import { EPhysics2DDrawFlags } from 'cc';
import { v2 } from 'cc';
import { SpriteAtlas } from 'cc';
import { Vec2 } from 'cc';
import { Sprite } from 'cc';
import { GameManager } from '../Manager/GameManager';
import { BundleName, GUI, UIEventName } from '../Constants';
import { ResManager } from '../../../Framework/Scripts/Managers/ResManager';
import { tween } from 'cc';
import { v3 } from 'cc';
import { CrownManager } from '../../../script/crownBuild';
import { Prefab } from 'cc';
import { instantiate } from 'cc';
import { Vec3 } from 'cc';
import { BottomUIManager } from '../../../script/gameUI/bottom';
import { TopUIManager } from '../../../script/gameUI/topUI';
import { g_GlobalData } from '../../../script/data/data';
import { DataManager } from '../../../script/data/dataManager';
import { UIManager } from '../../../Framework/Scripts/Managers/UIManager';
import { UIMapUICtrl } from './UIMapUICtrl';
import { UISettlementUICtrl } from './UISettlementUICtrl';
import { UITransform } from 'cc';
import { INTENSIFY_KUORONG } from '../../../script/define';
import { g_intensifyData } from '../../../script/data/intensifyData';
import { CannonManager } from '../../../script/cannonBuild';
import { numberToString } from '../../../script/utlis';
import { ECSFactory } from '../ECS/ECSFactory';
import { DataModelManager, ModelName } from '../Data/DataModelManager';
import { GameModel, GameState } from '../Data/Model/GameModel';

@ccclass('UIGameUICtrl')
export class UIGameUICtrl extends UIComponent {
    private m_imageAtlas: SpriteAtlas = null;

    private startPos: Vec2[] = [];
    private m_mapBlockItem: Sprite[][][] = [];
    //bottom
    m_hammer: Node = null;
    m_makeNumberLabel: Label = null;
    m_water: Node = null;
    m_destroyNode: Node = null;
    private m_canMakeCount: number = 10;
    private m_maxMakeCount: number = 10;
    private m_hammerAction: boolean = false;
    private m_waterAction: boolean = false;
    //end
    //top
    m_labGold: Label = null;
    m_diamond: Label = null;
    m_labCheckPoint: Label = null;
    //end
    private blockMaps:Node=null;
    private m_curCrown: Node = null;
    private m_nextCrown: Node = null;
    private m_crown: Prefab = null;
    private crownBuild:Node=null;
    
    protected onLoad(): void {
        this.blockMaps=this.ViewNode("blockMaps");
        this.crownBuild=this.ViewNode("crownBuild");
        //bottom
        this.m_hammer=this.ViewNode("gameUI/bottom/make/ui_build_hammer/m_hammer");
        this.m_makeNumberLabel=this.ViewComponent("gameUI/bottom/make/num",Label);
        this.m_water=this.ViewNode("gameUI/bottom/make/ui_build_water");
        this.m_destroyNode=this.ViewNode("gameUI/bottom/destroy");
        this.updateGameBottomUI();
        this.setShowDestroy('',false);

        this.AddButtonListener("gameUI/bottom/make/make",this,this.onClickMake);
        this.AddButtonListener("gameUI/bottom/make/autoMake",this,this.onClickAutoMake);
        this.AddButtonListener("gameUI/bottom/task/bt",this,this.showTaskView);
        this.AddButtonListener("gameUI/bottom/intensify",this,this.showIntensifyView);
        //end

        //top
        this.m_labGold=this.ViewComponent("gameUI/top/glod/btGlod/ui_coin_rect/gold",Label);
        this.m_diamond=this.ViewComponent("gameUI/top/glod/btDiamond/ui_coin_rect/diamond",Label);
        this.m_labCheckPoint=this.ViewComponent("gameUI/top/checkPoint",Label);
        this.updateGameTopUI();
        //end

        this.AddEventListener(UIEventName.updateGameUI, this.updateGameUI,this);
        this.AddEventListener(UIEventName.showSucceed, this.showSucceed,this);
        this.AddEventListener(UIEventName.showFaild, this.showFaild,this);
        this.AddEventListener(UIEventName.changeMapViewActive, this.changeMapViewActive,this);
        this.AddEventListener(UIEventName.updateGameBottomUI, this.updateGameBottomUI,this);
        this.AddEventListener(UIEventName.setShowDestroy, this.setShowDestroy,this);
        this.AddEventListener(UIEventName.isInDestroy, this.isInDestroy,this);

        ECSFactory.init(this.ViewNode("monsterNode"),this.ViewNode("cannonBuild"));
    }
    
    start(): void {
        //
        PhysicsSystem2D.instance.enable = true;

        PhysicsSystem2D.instance.debugDrawFlags = EPhysics2DDrawFlags.Aabb |
        EPhysics2DDrawFlags.Pair |
        EPhysics2DDrawFlags.CenterOfMass |
        EPhysics2DDrawFlags.Joint |
        EPhysics2DDrawFlags.Shape;

        PhysicsSystem2D.instance.debugDrawFlags = EPhysics2DDrawFlags.None;
        //end
        this.startPos.push(v2(0, 0));
        this.startPos.push(v2(640, 0));

        this.Init();
    }

    async Init() {
        this.m_imageAtlas=await ResManager.Instance.IE_GetAsset(BundleName.Atlas,"block-1",SpriteAtlas) as SpriteAtlas;

        const blockMapData = GameManager.instance.getCurBlockData();
        this.buildBlockMap(0, blockMapData);
        //
        this.m_crown=await ResManager.Instance.IE_GetAsset(BundleName.Prefabs,"crown",Prefab) as Prefab;
        this.buildEndPoint();
    }
    //gameui
    updateGameUI() {
        this.updateGameBottomUI();
        this.updateGameTopUI();
    }

    async createBossSettlement() {
        return await this.showMapView();
    }

    async showSucceed() {
        const checkPoint = g_GlobalData.getCurCheckPoint();
        DataManager.addGold(checkPoint.succedGold);
        DataManager.addDiamond(checkPoint.diamond);
        this.updateGameUI();


        let view;
        let delayTime = 0;
        if (g_GlobalData.isCurBossAttack()) {
            delayTime = 6;
            view = this.createBossSettlement();
            view.showSucceed(checkPoint.succedGold, checkPoint.diamond);
        } else {
            delayTime = 2;
            view=await UIManager.Instance.IE_ShowUIView(GUI.UISettlement);
            view.showSucceed(checkPoint.succedGold, checkPoint.diamond);
        }

        this.scheduleOnce(async () => {
            let isBoss = false;
            if (g_GlobalData.isCurBossAttack()) {
                const view = await this.createBossSettlement() as UIMapUICtrl;
                view.hideBossView();
                isBoss = true;
            } else {
                view.node.destroy();
            }

            this.updateGameUI();
            GameManager.instance.playGame(isBoss);
            let gameModel=DataModelManager.instance.getModel(ModelName.Game) as GameModel;
            gameModel.state=GameState.Playering;
        }, delayTime);
    }

    async showFaild() {
        const view =await UIManager.Instance.IE_ShowUIView(GUI.UISettlement) as UISettlementUICtrl;

        const checkPoint = g_GlobalData.getCurCheckPoint();
        DataManager.addGold(checkPoint.faildGold);
        this.updateGameUI();

        view.showFaild(checkPoint.faildGold);

        this.scheduleOnce(() => {
            g_GlobalData.previousCheckPoint();
            view.node.destroy();

            this.updateGameUI();
            GameManager.instance.playGame();
            let gameModel=DataModelManager.instance.getModel(ModelName.Game) as GameModel;
            gameModel.state=GameState.Playering;
        }, 2);
    }

    async showMapView() {
        return await UIManager.Instance.IE_ShowUIView(GUI.UIMap);
    }

    hideMapView() {
        UIManager.Instance.DestroyUIView(GUI.UIMap);
    }

    changeMapViewActive() {
        let view = UIManager.Instance.GetUIComponent(GUI.UIMap) as UIMapUICtrl;
        
        if(view){
            this.hideMapView();
        }
        else{
            this.showMapView();
        }
    }
    //
    buildBlockNextMap(blockMapData: number[][]) {
        if (blockMapData == null) {
            return;
        }
        this.buildBlockMap(1, blockMapData);
    }

    buildBlockMap(index: number, blockMapData: number[][]) {
        if (this.m_mapBlockItem[index] == null) {
            this.m_mapBlockItem[index] = [];
        }

        for (let j = 0; j < 6; j++) {
            const y = j * 106;
            if (this.m_mapBlockItem[index][j] == null) {
                this.m_mapBlockItem[index][j] = [];
            }
            for (let i = 0; i < 6; i++) {
                const x = i * 106;
                let block: Node;
                if (this.m_mapBlockItem[index][j][i] == null) {
                    block = new Node();
                    this.blockMaps.addChild(block);
                } else {
                    block = this.m_mapBlockItem[index][j][i].node;
                }
                const startX=x + 106 / 2 + this.startPos[index].x;
                const startY=-y - 106 / 2 + this.startPos[index].y
                block.setPosition(startX, startY);

                const com = block.getComponent(Sprite) || block.addComponent(Sprite);
                com['_selfIndex'] = v2(i, j);

                this.m_mapBlockItem[index][j][i] = com;
                const name = '' + blockMapData[j][i];
                const frame = this.m_imageAtlas.getSpriteFrame(name);
                com.spriteFrame = frame;
            }
        }
    }

    moveToNextMap(data: number[][]) {
        tween(this.node)
            .by(0.5, { position: v3(-640, 0) })
            .call(() => {
                this.node.setPosition(v3(-320, 310));
                this.buildBlockMap(0, data);
            })
            .start();
        
        
        CrownManager.instance.moveToNextMap();
    }
    //crown
    buildEndPoint() {
        const list = GameManager.instance.getCurPahtList();
        const lastPos = list[list.length - 1];

        const pos = new Vec2(0, 0);
        pos.x = lastPos.x * 106 + 106 / 2;
        pos.y = -lastPos.y * 106 - 106 / 2;

        if (this.m_curCrown == null) {
            this.m_curCrown = instantiate(this.m_crown);
            this.crownBuild.addChild(this.m_curCrown);
        }
        pos.y += 25;
        this.m_curCrown.setPosition(new Vec3(pos.x, pos.y, 0));
    }

    showCrownBuild() {
        this.crownBuild.active = true;
    }

    hideCrownBuild() {
        this.crownBuild.active = false;
    }

    setNextCrownPos(pos: Vec2) {
        if (this.m_nextCrown == null) {
            this.m_nextCrown = instantiate(this.m_crown);
            this.crownBuild.addChild(this.m_nextCrown);
        }
        pos.y += 25;
        this.m_nextCrown.setPosition(new Vec3(pos.x, pos.y, 0));
    }

    crownBuildmoveToNextMap() {
        const moveTo = { position: new Vec3(-640, 0, 0) };
        const callFunc = () => {
            this.crownBuild.setPosition(new Vec3(-320, 310, 0));
            this.buildEndPoint();
        };

        tween(this.crownBuild)
            .by(0.5, moveTo)
            .call(callFunc)
            .start();
    }
    //
    //bottom
    onClickMake() {
        let gameModel=DataModelManager.instance.getModel(ModelName.Game) as GameModel;
        if (gameModel.state!=GameState.Playering) {
            return;
        }

        const index = CannonManager.instance.getCanMakeIndex();
        if (index == null) {
            return;
        }
        if (this.m_canMakeCount == 0) {
            return;
        }
        if (!this.m_hammerAction) {
            this.m_hammerAction = true;
            tween(this.m_hammer)
                .to(0.2, { eulerAngles: new Vec3(-90, 0, 0) })
                .to(0.2, { eulerAngles: new Vec3(0, 0, 0) })
                .call(() => {
                    this.m_hammerAction = false;
                })
                .start();
        }
        this.subMakeNumber();

        CannonManager.instance.cannonBuild(index); 
    }

    addMakeNumber() {
        this.m_canMakeCount++;
        if (this.m_canMakeCount > this.m_maxMakeCount) {
            this.m_canMakeCount = this.m_maxMakeCount;
        }
        this.updateMakeCount();
    }

    subMakeNumber() {
        this.m_canMakeCount--;
        if (this.m_canMakeCount < 0) {
            this.m_canMakeCount = 0;
        }
        if (!this.m_waterAction) {
            this.m_water.getComponent(UITransform).setContentSize(0, 0);
        }
        this.updateMakeCount();
    }

    updateMakeCount() {
        this.m_makeNumberLabel.string = `${this.m_canMakeCount}/${this.m_maxMakeCount}`;
    }

    updateBottom(dt: number) {
        if (this.m_canMakeCount < this.m_maxMakeCount) {
            const newHeight = this.m_water.getComponent(UITransform).height + dt * 50;
            this.m_water.getComponent(UITransform).setContentSize(133, newHeight);
            this.m_waterAction = true;
            if (newHeight >= 133) {
                this.addMakeNumber();
                if (this.m_canMakeCount == this.m_maxMakeCount) {
                    this.m_water.getComponent(UITransform).setContentSize(133, 133);
                    this.m_waterAction = false;
                } else {
                    this.m_water.getComponent(UITransform).setContentSize(133, 0);
                }
            }
        }
    }

    onClickAutoMake() {
        let gameModel=DataModelManager.instance.getModel(ModelName.Game) as GameModel;
        if (gameModel.state!=GameState.Playering) {
            return;
        }
        CannonManager.instance.autoMerge();
    }

    updateGameBottomUI() {
        if (!this.m_waterAction) {
            this.m_water.getComponent(UITransform).setContentSize(133, 0);
        }

        const lv = DataManager.getInternsifLevel(INTENSIFY_KUORONG);
        this.m_maxMakeCount = g_intensifyData.getValue(INTENSIFY_KUORONG, lv);
        this.updateMakeCount();
    }

    showTaskView() {
        UIManager.Instance.IE_ShowUIView(GUI.UITask);
    }

    showIntensifyView() {
        UIManager.Instance.IE_ShowUIView(GUI.UIIntensify);
    }

    setShowDestroy(_,bShow: boolean) {
        console.log("setShowDestroy",_,bShow);
        this.m_destroyNode.active = bShow;
    }

    isInDestroy(_,world_pos: Vec2) {
        console.log("isInDestroy",_,world_pos);
        const pos = this.m_destroyNode.getComponent(UITransform).convertToNodeSpaceAR(v3(world_pos.x, world_pos.y));
        return pos.x < 50 && pos.x > -50 && pos.y < 50 && pos.y > -50;
    }
    //top
    updateGameTopUI() {
        const gold = DataManager.getGold();
        const diamond = DataManager.getDiamond();
        this.m_labGold.string = numberToString(gold);
        this.m_diamond.string = numberToString(diamond);
        this.updateCheckPoint();
    }

    updateCheckPoint() {
        const checkPoint = DataManager.getCheckPoint();
        const data = g_GlobalData.getData(checkPoint.big, checkPoint.small);
        this.m_labCheckPoint.string = '关卡';
        this.m_labCheckPoint.string += `${checkPoint.big + 1}-`;
        this.m_labCheckPoint.string += `${checkPoint.small + 1}`;
        if (!data.haveData) {
            this.m_labCheckPoint.string += '*';
        }
    }

    onClickMap() {
        this.changeMapViewActive();
    }
    //end
    protected update(dt: number): void {
        this.updateBottom(dt);
    }
}
