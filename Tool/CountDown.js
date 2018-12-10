//倒计时方法
let label;
cc.Class({
    extends: cc.Component,
    properties: {
    },
    onLoad() {
        label = this.node.getComponent(cc.Label);
    },
    onEnable() {
    },
    Init(time, timer, callback) {
        //总时间,时间间隔，倒计时结束后执行的函数

        this.node.active=true;
        let self = this;
        let t = time;
        label.string = t + '';
        this.callback = callback;
        //倒计时的动画效果
        self.node.getComponent(cc.Animation).play();
        this.schedule(function () {
            self.node.getComponent(cc.Animation).play();
            t -= timer;
            label.string = t + '';
            if (t <=0 && self.callback) {        
                self.callback();              
                self.node.active=false;                          
            }
        }, timer, time / timer -1, 0);

        //总时间，时间间隔，回调方法

    },
    start() {




    },

    update(dt) { },

});
