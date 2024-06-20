interface IntensifyDataItem {
    title: string;
    value: number[];
    diamond: number[];
    icon: string;
    showPer: boolean;
}

interface IntensifyData {
    data: IntensifyDataItem[];
    getData(): IntensifyDataItem[];
    getIntensifyDataByID(ID: number): IntensifyDataItem | null;
    getTitle(ID: number): string | null;
    getIcon(ID: number): string | null;
    getValue(ID: number, index: number): number | null;
    getDiamond(ID: number, index: number): number | null;
}

class IntensifyDataManager implements IntensifyData {
    data: IntensifyDataItem[] = [
        {
            title: '补给站容量扩充',
            value: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
            diamond: [5, 15, 20, 30, 50, 80, 120, 160, 200, 250, 320, 500],
            icon: 'ui_g_libraryCount',
            showPer: false,
        },
        {
            title: '炮台暴击提升',
            value: [1, 2, 3, 3.5, 4],
            diamond: [5, 15, 20, 30, 50],
            icon: 'ui_g_crit',
            showPer: true,
        },
    ];

    getData(): IntensifyDataItem[] {
        return this.data;
    }

    getIntensifyDataByID(ID: number): IntensifyDataItem | null {
        if (ID < 0 || ID >= this.data.length) {
            return null;
        }
        return this.data[ID];
    }

    getTitle(ID: number): string | null {
        const data = this.getIntensifyDataByID(ID);
        return data ? data.title : null;
    }

    getIcon(ID: number): string | null {
        const data = this.getIntensifyDataByID(ID);
        return data ? data.icon : null;
    }

    getValue(ID: number, index: number): number | null {
        const data = this.getIntensifyDataByID(ID);
        if (!data || index < 0 || index >= data.value.length) {
            return null;
        }
        return data.value[index];
    }

    getDiamond(ID: number, index: number): number | null {
        const data = this.getIntensifyDataByID(ID);
        if (!data || index < 0 || index >= data.diamond.length) {
            return null;
        }
        return data.diamond[index];
    }
}

// 将 IntensifyDataManager 实例化为单例并导出
export const g_intensifyData = new IntensifyDataManager();
