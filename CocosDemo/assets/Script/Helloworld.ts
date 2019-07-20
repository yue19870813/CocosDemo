const {ccclass, property} = cc._decorator;

@ccclass
export default class Helloworld extends cc.Component {

    onClick(event, custom): void {
        console.log(custom);
        cc.director.loadScene(custom);
    }
}
