//向子域发送排行榜请求方法

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        Global.rankView = this;
    },
    onEnable() {

     
    },
    start() {

    },
    friendButtonFunc(event) {
        if (CC_WECHATGAME) {
            // 发消息给子域
            window.wx.postMessage({
                messageType: 1,
                MAIN_MENU: "z1"
            });
        } else {
            cc.log("获取好友排行榜数据。x1");
        }
    },
    submitScoreButtonFunc(grade) {
        let score = grade;
        if (CC_WECHATGAME) {
            window.wx.postMessage({
                messageType: 3,
                MAIN_MENU: "z1",
                score: score,
            });
        } else {
            cc.log("提交得分: x1 : " + score)
        }
    },
    gameOverButtonFunc: function (event) {
        if (CC_WECHATGAME) {
            window.wx.postMessage({// 发消息给子域
                messageType: 4,
                MAIN_MENU: "z1"
            });
        } else {
            cc.log("获取死亡排行榜");
        }
    },
    removeRank() {
        if (CC_WECHATGAME) {
            window.wx.postMessage({// 发消息给子域
                messageType: 6,
                MAIN_MENU: "z1"
            });
        } else {
            cc.log("清除排行榜");
        }
    },
    onDisable(){
    
    },
    
});
