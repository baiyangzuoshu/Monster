import { _decorator, Component } from 'cc';
const { ccclass } = _decorator;

@ccclass('Test')
export class Test extends Component {

    onLoad () {
        // this.m_cannonText=[0,3,6,10,13,16,19,22]; 
        // this.m_cannonIndex=0; 
    }

    start () {
    }

    begin () {
        // g_monsterBuild.createTest(); 
    }

    clearCannon () {
        // g_cannonBuild.clearAllCannon(); 
    }

    createCannon () {
        // var index = g_cannonBuild.getCanMakeIndex(); 
        // if( index == null ){ 
            // return; 
        // } 
        // if( this.m_cannonIndex == this.m_cannonText.length ){ 
            // this.m_cannonIndex = 0; 
        // } 
        // g_cannonBuild.cannonBuild(index,this.m_cannonText[this.m_cannonIndex]); 
        // this.m_cannonIndex++; 
    }

    onClickHp () {
        // g_hpEffect.createHpEffect(cc.v2(319,-511)); 
    }

    onAddGold () {
        // g_dataManager.addGold(100); 
        // g_gameUI.updateGameUI(); 
    }

    onSubGold () {
        // g_dataManager.subGold(100); 
        // g_gameUI.updateGameUI(); 
    }

    onCoinFly () {
        // g_coinFly.createCoinToTip(); 
    }

    onJumpMap () {
        // var checkPoint = g_dataManager.getCheckPoint(); 
        // checkPoint.small = 0; 
        // checkPoint.big = 0; 
        // var curData = g_GlobalData.getData(0, 0); 
        // var nextData = g_GlobalData.getData(0, 1); 
        // g_GlobalData.nextCheckPoint(); 
        // g_game.jumpNextMap(curData,nextData); 
        // g_cannonBuild.jumpNextMap(); 
    }

}


/**
 * 注意：已把原脚本注释，由于脚本变动过大，转换的时候可能有遗落，需要自行手动转换
 */
// cc.Class({
//     extends: cc.Component,
// 
//     properties: {
//     },
// 
//     // LIFE-CYCLE CALLBACKS:
// 
//     onLoad () {
//         this.m_cannonText=[0,3,6,10,13,16,19,22];
//         this.m_cannonIndex=0;
//     },
// 
//     start () {
// 
//     },
// 
//     begin:function(){
//         g_monsterBuild.createTest();
//     },
//     clearCannon:function(){
//         g_cannonBuild.clearAllCannon();
//     },
//     createCannon(){
//         var index = g_cannonBuild.getCanMakeIndex();
//         if( index == null ){
//             return;
//         }
// 
//         if( this.m_cannonIndex == this.m_cannonText.length ){
//             this.m_cannonIndex = 0;
//         }
// 
//         g_cannonBuild.cannonBuild(index,this.m_cannonText[this.m_cannonIndex]);
//         this.m_cannonIndex++;
//     },
//     onClickHp(){
// 
//         g_hpEffect.createHpEffect(cc.v2(319,-511));
//     },
//     onAddGold(){
//         g_dataManager.addGold(100);
//         g_gameUI.updateGameUI();
//     },
//     onSubGold(){
//         g_dataManager.subGold(100);
//         g_gameUI.updateGameUI();
//     },
//     onCoinFly(){
//         g_coinFly.createCoinToTip();
//     },
//     onJumpMap(){
//         var checkPoint = g_dataManager.getCheckPoint();
//         checkPoint.small = 0;
//         checkPoint.big = 0;
//         var curData = g_GlobalData.getData(0, 0);
//         var nextData = g_GlobalData.getData(0, 1);
//         g_GlobalData.nextCheckPoint();
//         g_game.jumpNextMap(curData,nextData);
//         g_cannonBuild.jumpNextMap();
//     }
//     // update (dt) {},
// });
