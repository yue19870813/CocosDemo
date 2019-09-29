
const {ccclass, property} = cc._decorator;

@ccclass
export default class ImageRetention extends cc.Component {

    @property(sp.Skeleton)
    boy: sp.Skeleton = null;

    @property(cc.Camera)
    camera: cc.Camera = null;

    // @property(cc.Button)
    // btn: cc.Button = null;
    // 角色初始位置
    private _startPos: cc.Vec2 = cc.v2(-375, -320);

    start () {
        setTimeout(() => {
            this.runAndJump();
        }, 1000);
    }

    restart() {
        this.runAndJump();
    }

    runAndJump() {
        this.boy.node.position = this._startPos;
        // 开始跑
        this.boy.setAnimation(0, 'run', true);

        let runAction = cc.moveBy(2, cc.v2(400, 0));
        let middFunc = cc.callFunc(()=>{
            this.boy.setAnimation(0, 'jump', false);
        });
        let jumpAction = cc.jumpBy(1.5, cc.v2(300, 200));
        let finishedFunc = cc.callFunc(()=>{
            this.boy.setAnimation(0, 'idle', false);
        });
        let seq = cc.sequence(runAction, middFunc, jumpAction, finishedFunc);
        this.boy.node.runAction(seq);

        this.setMultipleShadow(this.boy.node, 100);


        this.boy.getCurrent

    }

    setMultipleShadow(target: cc.Node, interval: number = 100) {
        // setTimeout(()=>{
            this.createShadow();
        // }, 1000);
    }

    createShadow() {
        let texture = new cc.RenderTexture();
        // 如果截图内容中不包含 Mask 组件，可以不用传递第三个参数
        texture.initWithSize(cc.visibleRect.width, cc.visibleRect.height);
        this.camera.targetTexture = texture;
        // 渲染一次摄像机，即更新一次内容到 RenderTexture 中
        this.camera.render();
        // 这样我们就能从 RenderTexture 中获取到数据了
        let data = texture.readPixels();
        let node = this.createNewSp(data);
        node.name = "ttttt";
        this.node.addChild(node);
        // let action = cc.fadeOut(0.8);
        // let func = cc.callFunc(()=>{
        //     // node.destroy();
        // });
        // let seq = cc.sequence(action, func);
        // node.runAction(seq);
    }

    createNewSp(texture) {
        let node = new cc.Node();
        let sp = node.addComponent(cc.Sprite);
        sp.spriteFrame = new cc.SpriteFrame(texture);
        node.scaleY = -1;
        return node;
    }
}
