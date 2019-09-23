
export default class MySchedule {
    /** 是否在运行 */
    private static isRunning: boolean = false;
    /** 当前调度id */
    private static intervalId: number = 0;
    /** 默认帧率 */
    private static defaultTime: number = 10;
    /** 调度集合 */
    private static scheduleList: _Schedule_[] = [];
    /** 自增id */
    private static countId: number = 1;

    public static create(callback: Function, interval?: number, repeat?: number, delay?: number): number {
        let s = new _Schedule_(callback, interval, repeat, delay);
        MySchedule.scheduleList.push(s);
        let id = s.setId(MySchedule.countId++);
        MySchedule.start();
        return id;
    }

    private static start(): void {
        if (!MySchedule.isRunning) {
            MySchedule.isRunning = true;
            MySchedule.intervalId = setInterval(MySchedule.update, MySchedule.defaultTime);
        }
    }

    private static update(): void {
        let length = MySchedule.scheduleList.length;
        if (length <= 0) {
            clearInterval(MySchedule.intervalId);
            MySchedule.isRunning = false;
            return;
        }
        for (let i = MySchedule.scheduleList.length; i > 0; i--) {
            let schedule = MySchedule.scheduleList[i - 1];
            if (schedule.invalid) {
                MySchedule.scheduleList.splice(i - 1, 1);
            } else {
                schedule.updateStatus(MySchedule.defaultTime);
            }
        }
    }
}

export class _Schedule_ {
    // id
    public id: number;
    // 基本参数
    public cb: Function = null;
    public interval: number = 10;
    public repeat: number = -1;
    public delay: number = 0;

    // 状态
    /** 重复的次数 */
    public repeatNum: number = 0;
    /** 经过时间 */
    public during: number = 0;
    /** 当前帧时间 */
    public curDuring: number = 0;
    /** 无效了的 */
    public invalid: boolean = false;

    public constructor(callback: Function, interval?: number, repeat?: number, delay?: number) {
        this.cb = callback;
        this.interval = interval > 0 ? interval : 10;
        this.repeat = repeat > 0 ? repeat : -1;
        this.delay = delay > 0 ? delay : 0;

        // 处理延迟时间
        this.curDuring -= this.delay;
    }

    /** 更新状态 */
    public updateStatus(time: number): number {
        this.during += time;
        this.curDuring += time;
        // 根据时间计算是否到了执行时机
        if (this.curDuring >= this.interval) {
            this.curDuring = this.curDuring - this.interval;
            this.cb && this.cb();
            this.repeatNum++;
        }
        // 处理重复次数
        if (this.repeat > 0 && this.repeatNum >= this.repeat) {
            this.invalid = true;
            return -1;
        }
        return 1;
    }

    public setId(id: number): number {
        this.id = id;
        return this.id;
    }
}
