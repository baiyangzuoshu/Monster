interface UserData {
    gold?: number;
    diamond?: number;
    bigCheckPointCount?: number;
    smallCheckPointCount?: number;
    taskData?: {
        [key: number]: {
            curCount?: number;
            maxIndex?: number;
        };
    };
    internsifLevel?: number[];
}

interface CheckPoint {
    big: number;
    small: number;
}

interface DataManager {
    userData: UserData;
    save(): void;
    load(): void;
    del(): void;
    getGold(): number;
    setGold(gold: number): void;
    subGold(subNum: number): void;
    addGold(addNum: number): void;
    getDiamond(): number;
    setDiamond(diamond: number): void;
    subDiamond(subNum: number): void;
    addDiamond(addNum: number): void;
    getBigCheckPointCount(): number;
    setBigCheckPointCount(big: number): void;
    addBigCheckPointCount(): number;
    subBigCheckPointCount(): number;
    getSmallCheckPointCount(): number;
    setSmallCheckPointCount(small: number): void;
    addSmallCheckPointCount(): number;
    subSmallCheckPointCount(): number;
    getCheckPoint(): CheckPoint;
    getTaskByID(taskID: number): any;
    addTaskCount(taskID: number): number | boolean;
    nextTask(taskID: number): number | boolean;
    getInternsifLevel(ID: number): number;
    addInternsifLevel(ID: number): number;
}

class DataManagerImpl implements DataManager {
    userData: UserData = {};

    private static instance: DataManagerImpl;

    private constructor() {
        this.load();
    }

    static getInstance(): DataManagerImpl {
        if (!DataManagerImpl.instance) {
            DataManagerImpl.instance = new DataManagerImpl();
        }
        return DataManagerImpl.instance;
    }

    save() {
        const str = JSON.stringify(this.userData);
        localStorage.setItem('userData', str);
    }

    load() {
        const str = localStorage.getItem('userData');
        if (str == null || str === '') {
            this.userData = {};
            return;
        }
        this.userData = JSON.parse(str);
    }

    del() {
        localStorage.removeItem('userData');
    }

    getGold() {
        if (this.userData.gold == null) {
            this.userData.gold = 0;
        }
        return this.userData.gold;
    }

    setGold(gold: number) {
        this.userData.gold = gold;
        this.save();
    }

    subGold(subNum: number) {
        if (this.userData.gold == null) {
            this.userData.gold = 0;
        }
        this.userData.gold -= subNum;
        this.save();
    }

    addGold(addNum: number) {
        if (this.userData.gold == null) {
            this.userData.gold = 0;
        }
        this.userData.gold += addNum;
        this.save();
    }

    getDiamond() {
        if (this.userData.diamond == null) {
            this.userData.diamond = 30;
        }
        return this.userData.diamond;
    }

    setDiamond(diamond: number) {
        this.userData.diamond = diamond;
        this.save();
    }

    subDiamond(subNum: number) {
        if (this.userData.diamond == null) {
            this.userData.diamond = 0;
        }
        this.userData.diamond -= subNum;
        this.save();
    }

    addDiamond(addNum: number) {
        if (this.userData.diamond == null) {
            this.userData.diamond = 0;
        }
        this.userData.diamond += addNum;
        this.save();
    }

    getBigCheckPointCount() {
        if (this.userData.bigCheckPointCount == null) {
            this.userData.bigCheckPointCount = 0;
        }
        return this.userData.bigCheckPointCount;
    }

    setBigCheckPointCount(big: number) {
        this.userData.bigCheckPointCount = big;
        this.save();
    }

    addBigCheckPointCount() {
        if (this.userData.bigCheckPointCount == null) {
            this.userData.bigCheckPointCount = 0;
        }
        this.userData.bigCheckPointCount++;
        this.save();
        return this.userData.bigCheckPointCount;
    }

    subBigCheckPointCount() {
        if (this.userData.bigCheckPointCount == null) {
            this.userData.bigCheckPointCount = 0;
        }
        if (this.userData.bigCheckPointCount === 0) {
            return 0;
        }
        this.userData.bigCheckPointCount--;
        this.save();
        return this.userData.bigCheckPointCount;
    }

    getSmallCheckPointCount() {
        if (this.userData.smallCheckPointCount == null) {
            this.userData.smallCheckPointCount = 0;
        }
        return this.userData.smallCheckPointCount;
    }

    setSmallCheckPointCount(small: number) {
        this.userData.smallCheckPointCount = small;
        this.save();
    }

    addSmallCheckPointCount() {
        if (this.userData.smallCheckPointCount == null) {
            this.userData.smallCheckPointCount = 0;
        }
        this.userData.smallCheckPointCount++;
        this.save();
        return this.userData.smallCheckPointCount;
    }

    subSmallCheckPointCount() {
        if (this.userData.smallCheckPointCount == null) {
            this.userData.smallCheckPointCount = 0;
        }
        if (this.userData.smallCheckPointCount === 0) {
            return 0;
        }
        this.userData.smallCheckPointCount--;
        this.save();
        return this.userData.smallCheckPointCount;
    }

    getCheckPoint() {
        const checkPoint: CheckPoint = {
            big: this.getBigCheckPointCount(),
            small: this.getSmallCheckPointCount(),
        };
        return checkPoint;
    }

    getTaskByID(taskID: number) {
        if (this.userData.taskData == null) {
            this.userData.taskData = {};
        }
        if (this.userData.taskData[taskID] == null) {
            this.userData.taskData[taskID] = {};
        }
        if (this.userData.taskData[taskID].curCount == null) {
            this.userData.taskData[taskID].curCount = 0;
        }

        if (this.userData.taskData[taskID].maxIndex == null) {
            this.userData.taskData[taskID].maxIndex = 0;
        }
        return this.userData.taskData[taskID];
    }

    addTaskCount(taskID: number) {
        const item = this.getTaskByID(taskID);
        if (item == null) {
            return false;
        }
        this.userData.taskData[taskID].curCount++;
        this.save();
        return this.userData.taskData[taskID].curCount;
    }

    nextTask(taskID: number) {
        const item = this.getTaskByID(taskID);
        if (item == null) {
            return false;
        }
        this.userData.taskData[taskID].curCount = 0;
        this.userData.taskData[taskID].maxIndex++;
        this.save();
        return this.userData.taskData[taskID].curCount;
    }

    getInternsifLevel(ID: number) {
        if (this.userData.internsifLevel == null) {
            this.userData.internsifLevel = [];
        }
        if (this.userData.internsifLevel[ID] == null) {
            this.userData.internsifLevel[ID] = 0;
        }

        return this.userData.internsifLevel[ID];
    }

    addInternsifLevel(ID: number) {
        if (this.userData.internsifLevel == null) {
            this.userData.internsifLevel = [];
        }
        if (this.userData.internsifLevel[ID] == null) {
            this.userData.internsifLevel[ID] = 0;
        }

        this.userData.internsifLevel[ID]++;
        this.save();
        return this.userData.internsifLevel[ID];
    }
}

export const DataManager = DataManagerImpl.getInstance();
