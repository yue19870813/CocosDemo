
const {ccclass, property} = cc._decorator;

@ccclass
export default class BackButton extends cc.Component {


    start () {

    }

    onBack() {
        cc.director.loadScene("helloworld");
    }

    // update (dt) {}
}
