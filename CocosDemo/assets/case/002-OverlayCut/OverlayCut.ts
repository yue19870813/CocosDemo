
const {ccclass, property} = cc._decorator;

@ccclass
export default class OverlayCut extends cc.Component {

    @property(cc.Sprite)
    sp1: cc.Sprite = null;

    @property(cc.Sprite)
    sp2: cc.Sprite = null;

    start () {
        let camera = this.sp1.addComponent(cc.Camera);

        // 设置你想要的截图内容的 cullingMask
        camera.cullingMask = -2;

        // 新建一个 RenderTexture，并且设置 camera 的 targetTexture 为新建的 RenderTexture，这样 camera 的内容将会渲染到新建的 RenderTexture 中。
        let texture = new cc.RenderTexture();
        let gl = cc.game._renderContext;
        // 如果截图内容中不包含 Mask 组件，可以不用传递第三个参数
        texture.initWithSize(cc.visibleRect.width, cc.visibleRect.height, gl.STENCIL_INDEX8);
        camera.targetTexture = texture;

        // 渲染一次摄像机，即更新一次内容到 RenderTexture 中
        camera.render();

        // 这样我们就能从 RenderTexture 中获取到数据了
        let data = texture.readPixels();
        console.log(data);

        this.createNewSp(texture);
    }

    createNewSp(texture) {
        let node = new cc.Node();
        let sp = node.addComponent(cc.Sprite);
        sp.spriteFrame = new cc.SpriteFrame(texture);
        node.parent = this.node;
        node.scaleY = -1;
        node.x = 200;
    }


    /**
     * 实现aSp去裁剪bSp的功能
     * @param aSp 
     * @param bSp 
     */
    makeACutB(aSp: cc.Sprite, bSp: cc.Sprite): void {

    }



    // update (dt) {}
}
