// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class IntensifyDataManager extends cc.Component {

    private static _instance:IntensifyDataManager=null
    public static getInstance():IntensifyDataManager{
        return IntensifyDataManager._instance
    }

    onLoad () {
        if(null===IntensifyDataManager._instance){
            IntensifyDataManager._instance=this
        }
        else{
            this.destroy()
            return
        }
    }

    public data:Array<any> = [
        {//0
            title:'补给站容量扩充',
            value:[10,11,12,13,14,15,16,17,18,19,20,21],
            diamond:[5,15,20,30,50,80,120,160,200,250,320,500],
            icon:'ui_g_libraryCount',
            showPer:false,
        },
        {//1
            title:'炮台暴击提升',
            value:[1,2,3,3.5,4],
            diamond:[5,15,20,30,50],
            icon:'ui_g_crit',
            showPer:true,
        },

    ]

    public getData (){
        return  this.data;
    }

    public getIntensifyDataByID (ID){
        if(ID >= this.data.length ){
            return null;
        }
        return this.data[ID];
        
    }
    public getTitle(ID,index){
        var data = this.getIntensifyDataByID(ID);
        if( data == null  ){
            return null;
        }
        return data.title;
        
    }
    public getIcon(ID){
        var data = this.getIntensifyDataByID(ID);
        if( data == null  ){
            return null;
        }
        return data.icon;
        
    }
    public getValue(ID,index):number{
        var data = this.getIntensifyDataByID(ID);
        if( data == null ){
            return null;
        }
        return data.value[index];
    }
    public getDiamond(ID,index){
        var data = this.getIntensifyDataByID(ID);
        if( data == null ){
            return null;
        }
        return data.diamond[index];
    }

}
