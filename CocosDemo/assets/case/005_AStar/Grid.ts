export enum GridType {
    //正常类型
    Normal,
    //障碍物类型
    Obstacle,
    //起点类型
    Start,
    //终点类型
    End
}


export default class Grid {

    //格子坐标x-y
    public x: number;
    public y: number;

    //格子A*三属性f-g-h
    public f: number;
    public g: number;
    public h: number;

    //格子类型
    public type: GridType;

    //格子的归属（父格子）
    public parent: Grid;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public CompareTo (grid: Grid): number {
        if (this.f < grid.f) {
            return -1;  //升序
        }

        if (this.f > grid.f) {
            return 1;   //降序
        }
        return 0;
    }
}
