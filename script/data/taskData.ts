interface TaskDataItem {
    title: string;
    max: number[];
    award: number[];
    taskType: number;
}

interface TaskData {
    data: TaskDataItem[];
    getTaskDataByID(taskID: number): TaskDataItem | null;
    getAward(taskID: number, index: number): number | null;
    getTitle(taskID: number, index: number): string | null;
    getMaxCount(taskID: number, maxIndex: number): number | null;
    getData(): TaskDataItem[];
}

const g_taskData: TaskData = {
    data: [
        {
            title: '[合成]合成防御塔{0}次',
            max: [1, 5, 10, 20, 30, 60, 120, 150, 200, 280, 400],
            award: [10, 50, 110, 200, 300, 600, 1200, 1500, 2000, 2800, 4000],
            taskType: 0,
        },
        {
            title: '击败{0}个敌人',
            max: [1, 5, 10, 20, 30, 60, 120, 150, 200, 280, 400],
            award: [1, 5, 10, 20, 30, 60, 120, 150, 200, 280, 400],
            taskType: 0,
        },
        {
            title: '强化技能{0}次',
            max: [1, 5, 10, 20, 30, 60, 120, 150, 200, 280, 400],
            award: [1, 5, 10, 20, 30, 60, 120, 150, 200, 280, 400],
            taskType: 0,
        },
        {
            title: '合成{0}次防御塔',
            max: [1, 5, 10, 20, 30, 60, 120, 150, 200, 280, 400],
            award: [10, 50, 110, 200, 300, 600, 1200, 1500, 2000, 2800, 4000],
            taskType: 1,
        },
    ],

    getTaskDataByID(taskID: number): TaskDataItem | null {
        if (taskID >= this.data.length) {
            return null;
        }
        return this.data[taskID];
    },

    getAward(taskID: number, index: number): number | null {
        const taskData = this.getTaskDataByID(taskID);
        if (taskData == null) {
            return null;
        }
        const award = taskData.award;
        if (index >= award.length) {
            index = award.length - 1;
        }
        return award[index];
    },

    getTitle(taskID: number, index: number): string | null {
        const taskData = this.getTaskDataByID(taskID);
        if (taskData == null) {
            return null;
        }
        const title = taskData.title;
        if (index >= taskData.max.length) {
            index = taskData.max.length - 1;
        }
        return title.replace('{0}', taskData.max[index].toString());
    },

    getMaxCount(taskID: number, maxIndex: number): number | null {
        const taskData = this.getTaskDataByID(taskID);
        if (taskData == null) {
            return null;
        }
        if (maxIndex >= taskData.max.length) {
            maxIndex = taskData.max.length - 1;
        }
        return taskData.max[maxIndex];
    },

    getData(): TaskDataItem[] {
        return this.data;
    }
};

// 将 g_taskData 导出以便在其他文件中使用
export { g_taskData, TaskData, TaskDataItem };
