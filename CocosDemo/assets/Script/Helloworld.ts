const {ccclass, property} = cc._decorator;

@ccclass
export default class Helloworld extends cc.Component {


    onClick(event, custom): void {
        switch (custom) {
            case "Gradient": 
                console.log("Gradient");
                cc.director.loadScene("Gradient");
                break;
        }
    }
}
