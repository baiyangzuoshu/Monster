// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class TaskDataManager extends cc.Component {

    private static _instance:TaskDataManager=null
    public static getInstance():TaskDataManager{
        return TaskDataManager._instance
    }

    onLoad () {
        if(null===TaskDataManager._instance){
            TaskDataManager._instance=this
        }
        else{
            this.destroy()
            return
        }
    }

    public data:Array<any> = [
        {//0
            title:'[合成]合成防御塔{0}次',
            max:[1,5,10,20,30,60,120,150,200,280,400],
            award:[10,50,110,200,300,600,1200,1500,2000,2800,4000],
            taskType:0,
        },
        {//1
            title:'击败{0}个敌人',
            max:[1,5,10,20,30,60,120,150,200,280,400],
            award:[1,5,10,20,30,60,120,150,200,280,400],
            taskType:0,
        },
        {//2
            title:'强化技能{0}次',
            max:[1,5,10,20,30,60,120,150,200,280,400],
            award:[1,5,10,20,30,60,120,150,200,280,400],
            taskType:0,
        },
        {//3
            title:'合成{0}次防御塔',
            max:[1,5,10,20,30,60,120,150,200,280,400],
            award:[10,50,110,200,300,600,1200,1500,2000,2800,4000],
            taskType:1,
        },

    ]


    public getTaskDataByID(taskID){
        if(taskID >= this.data.length ){
            return null;
        }
        return this.data[taskID];
        
    }
    public getAward(taskID,index){
        var taskData = this.getTaskDataByID(taskID);
        if( taskData == null ){
            return null;
        }
        var award = taskData.award;
        if( index >= award.leight ){
            index = award.leight-1;
        }
        return award[index];
    }
    public getTitle(taskID,index){
        var taskData = this.getTaskDataByID(taskID);
        if( taskData == null ){
            return null;
        }
        var title = taskData.title;
        if( index >= taskData.max.leight ){
            index = taskData.max.leight-1;
        }
        return title.format(this.data[taskID].max[index]);
    }
    public getMaxCount(taskID,maxIndex){
        var taskData = this.getTaskDataByID(taskID);
        if( taskData == null ){
            return null;
        }
        if( maxIndex >= taskData.max.leight ){
            maxIndex = taskData.max.leight-1;
        }
        return this.data[taskID].max[maxIndex];
    }

    public getData(){
        return this.data;
    }

}
