
const {ccclass, property} = cc._decorator;

@ccclass
export default class Gradient extends cc.Component {

    @property(cc.Sprite)
    kitty: cc.Sprite = null;

    material;
    time = 0;

    start () {
        // 获取材质
        this.material = this.kitty.getMaterial(0);
        // 刷新函数
        this.schedule(this.upd, 0, cc.macro.REPEAT_FOREVER, 1);
    }

    upd() {
        this.time += 0.01;
        this.material.effect.setProperty('time', this.time);
    }

    // update (dt) {}
}
