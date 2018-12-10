//进度条加载 效果
let point=0;
let isLoading=false;
cc.Class({
    extends: cc.Component,

    properties: {
        pro: cc.ProgressBar,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

        cc.director.preloadScene('Game', () => {//预加载
        });
        this.pro.propgress=0;
    },

    start() {

    },

    update(dt) {
        if (this.pro.progress >= 1&&isLoading==false) {
            cc.director.loadScene("Game");
            isLoading=true;
            Global.wechatFun.showad();
        }
      this.Progress(dt);
    },

    Progress(dt) {
        point+=dt;      
        this.pro.progress=point/3;
    }
});
