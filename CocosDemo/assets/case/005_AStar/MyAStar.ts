
export class AS_Vec2 {
    public parent: cc.Vec2 = cc.v2(-1, -1);
    public F: number = 0;
    public H: number = 0;
    public G: number = 0;
    public X: number = 0;
    public Y: number = 0;

    public constructor(x: number, y: number) {
        this.X = x;
        this.Y = y;
    }

    public setParent(p: cc.Vec2): void {
        this.parent.x = p.x;
        this.parent.y = p.y;
    }

    public getCoord(): cc.Vec2 {
        return cc.v2(this.X, this.Y);
    }

    public calcF(): void{
        this.F = this.G + this.H;
    }

    public setCoord(v: cc.Vec2) {
        this.X = v.x;
        this.Y = v.y;
    }

    public equals(a: AS_Vec2){
        return (this.X == a.X && this.Y == a.Y);
    }
}

export default class AStarFindPath {

    // 地图数据
    public mapData: Map<string, number>;

    //关闭列表
    private p_closeVec: AS_Vec2[];
    //开启列表
    private p_openVec:AS_Vec2[];
    
    //地图的宽和高
    private MAP_WIDTH: number;
    private MAP_HEIGHT: number;
    
    //起始点于结束点
    private a_start: AS_Vec2;
    private a_end: AS_Vec2;

    public constructor(mapData: Map<string, number>, mWidth: number, mHeight: number) {
        this.p_openVec = [];
        this.p_closeVec = [];

        this.mapData = mapData;
        this.MAP_HEIGHT = mHeight;
        this.MAP_WIDTH = mWidth;
    }

    //移动到指定点
    public findPath(start: cc.Vec2, end: cc.Vec2): cc.Vec2[] {
        //起始点或者终点为空则路径为空
        if (!this.isInMap(this.toAS(start)) || !this.isInMap(this.toAS(end)) 
            || (start.x == end.x && start.y == end.y)) {
            return null;
        }

        this.p_openVec = [];
        this.p_closeVec = [];
        this.a_start = this.toAS(start);
        this.a_end = this.toAS(end);

        //开始寻路
        this.p_openVec.push(this.a_start);

        while (this.p_openVec.length > 0) {
            //找出F值最小的点
            let tempStart = this.getMinF(this.p_openVec);
            this.removeAS(this.p_openVec, tempStart);
            this.p_closeVec.push(tempStart);

            //找出它相邻的点
            let vec = this.getNearVec(tempStart);
            for (let av of vec) {
                //开启列表是否包含
                if (this.isExist(this.p_openVec, av)) {
                    this.foundPoint(tempStart, av);
                } else {
                   this. notFoundPoint(tempStart, this.a_end, av);
                }
            }
            let path = this.getAS(this.p_openVec, end);
            if (path.getCoord().x != -1) {
                return this.getPath(path);
            }
        }
        let path = this.getAS(this.p_closeVec, end);
        if (path.getCoord().x != -1) {
            return this.getPath(path);
        }
        return null;
    }


    //// 内部调用函数 ////
    //判断一个点 是否在地图内
    private isInMap(v: AS_Vec2): boolean {
        let data = this.mapData.get(v.X + "_" + v.Y);
        if (data) {
            return true;
        }
        return false;
    }

    //判断一个点，是否可以行走
    private canMove(v: AS_Vec2): boolean {
        let data = this.mapData.get(v.X + "_" + v.Y);
        if (data) {
            return true;
        }
        return false;
    }
    
    //将Vec2转换成AS_Vec2
    private toAS(v: cc.Vec2): AS_Vec2 {
        return new AS_Vec2(v.x, v.y);
    }

    //获得最小F值的点
    private getMinF(vec: AS_Vec2[]): AS_Vec2 {
        vec.sort((a: AS_Vec2, b: AS_Vec2) => {
            return a.F - b.F;
        });
        return vec[0];
    }

    // 移除指定点
    private removeAS(vec: AS_Vec2[], tv: AS_Vec2): void {
        for (let i = 0; i < vec.length; i++) {
            let v = vec[i];
            if (v.X == tv.X && v.Y == tv.Y) {
                vec.splice(i, 1);
                break;
            }
        }
    }

    //获取相邻格
    private getNearVec(v: AS_Vec2): AS_Vec2[] {
        let vec: AS_Vec2[] = [];
        let up = this.toAS(cc.v2(v.getCoord().x, v.getCoord().y - 1));
        let down = this.toAS(cc.v2(v.getCoord().x, v.getCoord().y + 1));
        let left = this.toAS(cc.v2(v.getCoord().x - 1, v.getCoord().y));
        let right = this.toAS(cc.v2(v.getCoord().x + 1, v.getCoord().y));

        if (this.isInMap(up) && this.canMove(up)) {
            vec.push(up);
        }
        if (this.isInMap(down) && this.canMove(down)) {
            vec.push(down);
        }
        if (this.isInMap(left) && this.canMove(left)) {
            vec.push(left);
        }
        if (this.isInMap(right) && this.canMove(right)) {
            vec.push(right);
        }
        return vec;
    }

    //比较AS_Vec2
    private isExist(vec: AS_Vec2[], av: AS_Vec2): boolean {
        for (let v of vec) {
            if (v.getCoord().x == av.getCoord().x && v.getCoord().y == av.getCoord().y) {
                return true;
            }
        }
        return false;
    }

    //获取
    private getAS(vec: AS_Vec2[], av: cc.Vec2): AS_Vec2 {
        for (let v of vec) {
            if (v.getCoord().x == av.x && v.getCoord().y == av.y) {
                return v;
            }
        }
        return new AS_Vec2(-1, -1);
    }

    private calcG(temp: AS_Vec2, v: AS_Vec2): number {
        let G = Math.abs(v.X - temp.X) + Math.abs(v.Y - temp.Y);
        let nulV = cc.v2(-1, -1);
        if (v.parent == nulV) {
            return G;
        } else {
            let pa = this.getAS(this.p_openVec, v.parent);
            return pa.G + G;
        }
    }

    private calcH(end: AS_Vec2, curr: AS_Vec2): number {
        return Math.abs(curr.X - end.X) + Math.abs(curr.Y - end.Y);
    }

    private foundPoint(tmp: AS_Vec2, curr: AS_Vec2): void {
        let G = this.calcG(tmp, curr);
        if (G < curr.G) {
            curr.parent = tmp.getCoord();
            curr.G = G;
            curr.calcF();
        }
    }

    private notFoundPoint(tmp: AS_Vec2, end: AS_Vec2, curr: AS_Vec2): void {
        curr.parent = tmp.getCoord();
        curr.G = this.calcG(tmp, curr);
        curr.H = this.calcH(end, curr);
        curr.calcF();
        this.p_openVec.push(curr);
    }

    //获取最终路径
    private getPath(asv: AS_Vec2): cc.Vec2[] {
        let pathVec: cc.Vec2[] = [];
        if (asv.getCoord().x != -1) {
            pathVec.push(asv.getCoord());
            while (asv.parent.x != -1) {
                asv = this.getAS(this.p_closeVec, asv.parent);
                pathVec.push(asv.getCoord());
            }
        }
        return pathVec.reverse();
    }
}