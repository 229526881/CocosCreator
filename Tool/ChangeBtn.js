let index = -1;
const name = 'name'  //当前游戏
const appId = 'xxxxxx' //当前appid
cc.Class({
    extends: cc.Component,
    properties: {
        //icon2: cc.Node,
       // icon3: cc.Node,
    },
    // LIFE-CYCLE CALLBACKS:
    onLoad() {
        var self = this;
        this.node.on('click', this.callback, this);    
    },
    onEnable(){
        this.schedule(this.Funtion,3);
    },
    onDisable(){
        this.unschedule(this.Funtion);
    },
    start() {
        this.Funtion();
    },
    Funtion(){
        index++;
        let navigatorIcon = this.node;
        index = index % 9;
        if (Global.navigatorList[index].appid == appId) {
            //防止跳出自己游戏
            index = (index + 1) % 9;
        }
        cc.loader.load(Global.navigatorList[index].navigatorIcon, function (err, texture) {
            navigatorIcon.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
            //navigatorIcon2.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
            //navigatorIcon3.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
        })
        //this.id = navigatorList[index].appid;
      
    },
    callback() {
        let id = Global.navigatorList[index].appid;
        if (CC_WECHATGAME) {
            if (wx.getSystemInfoSync().SDKVersion > '2.0.9' ) {
                wx.navigateToMiniProgram({
                    appId:id,
                    path: '',
                    success(res) {
                        console.log("打开成功");
                        // 打开成功
                    }
                })
            }
            else {
                wx.previewImage({
                    urls: [Global.moreGameList[index].QRCode],
                    success: function () {
                        console.log(Global.moreGameList[index].QRCode);
                    }
                })
            }
        }
        else {
            console.log('打开盒子')
        }
    }
    // update (dt) {},
});
