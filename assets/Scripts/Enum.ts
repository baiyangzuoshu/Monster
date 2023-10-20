export enum GameState{
    None=0,
    Active=1,
    Dead=2
}

export enum BulletState{
    None=0,
    Effect=1,
    Attack=2,
    Dead=3
}

export enum Task{//任务
    TASK_HEBING_FANGYUTA = 0, // 合并防御塔
    TASK_JIDAO_DIREN = 1, //击倒敌人
    TASK_QIANGHUA_JINENG = 2 //强化技能
}

export enum Intensify{//强化
    INTENSIFY_KUORONG = 0,//补给站扩容
    INTENSIFY_BAOJI = 1//暴击
}

export enum SkillBuffer{//buffer
    BUFFER_JINBIFANBEI = 0 ,// 金币翻倍
    BUFFER_GUAIWUJIANSHU = 1, // 怪物减速
    BUFFER_GONGJIFANBEI = 2,  //攻击翻倍
    BUFFER_QUANPINGGONGJI = 3 //全屏攻击
}

export enum Chengjiou{
    CHENGJIOU_QIANGHUA_JINENG = 3 //合并防御塔
}





