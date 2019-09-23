import MySchedule from "./MySchedule";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TestSchedule extends cc.Component {

    @property(cc.Node)
    target: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        MySchedule.create(() => {
            console.log("###########");
        }, 1000, 10);

        this.schedule(() => {
            console.log("@@@@@@@@@@");
        }, 1, 10);
    }

    update (dt) {
        // console.log("update =====", dt);
    }
}
