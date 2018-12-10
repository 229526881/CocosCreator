//广告条加载
var gameStatic = require('GameStatic');
let width=0;
let AD = cc.Class({
    extends: cc.Component,
    properties: {
    
    },
    statics: {
        _instance: null
    },
    onLoad() {

        gameStatic.ad = this;

        var self=this;
        let windowSize = cc.view.getVisibleSize();//获得屏幕尺寸
        if(CC_WECHATGAME)
        {
            width= windowSize.height / windowSize.width <1.4?550:wx.getSystemInfoSync().windowWidth * 43 / 52;
        }
      
        cc.game.addPersistRootNode(this.node);
        if (CC_WECHATGAME) {
            if (wx.getSystemInfoSync().SDKVersion >= '2.0.4') {
                AD._instance = this;
                this.bannerAd = wx.createBannerAd({
                    adUnitId: 'adunit-9b57a8421542313e',  
                    style: {
                        left: 0,
                        top: wx.getSystemInfoSync().windowHeight - 120,// - 118,
                        width: 300,
                        height: 60,
                    }
                });
                this.bannerAd.onResize(res => {
                    //this.bannerAd.style.top = wx.getSystemInfoSync().windowHeight - this.bannerAd.style.realHeight;
                    self.setBannerADHeight(res);
                })
                this.bannerAd.onError(function(){
                    console.log('error');
                })
            }  //cc.game.addPersistRootNode(this.node);


        }

        // bannerAd.onResize(res => {
        //     console.log(res.width, res.height)
        //     console.log(bannerAd.style.realWidth, bannerAd.style.realHeight)
        //     })
        // console.log(this.bannerAd.height)

    },
 start(){
   
 },

    showad: function () {
        if (CC_WECHATGAME) {

            if (wx.getSystemInfoSync().SDKVersion >= '2.0.4') {
                AD._instance.bannerAd.show();
                AD._instance.bannerAd.onResize(res => {
                    AD._instance.bannerAd.style.top = wx.getSystemInfoSync().windowHeight - AD._instance.bannerAd.style.realHeight;
                });
            }
        }
    },


    closead: function () {
        if (CC_WECHATGAME) {
            if (wx.getSystemInfoSync().SDKVersion >= '2.0.4') {
                AD._instance.bannerAd.hide();
            }
        }

    },
    setBannerADHeight: function (res) { 
        if ((res.height / res.width) > 0.346) {
            AD._instance.bannerAd.style.width=width* 43 / 52;
           
            //AD._instance.bannerAD.style.width = wx.getSystemInfoSync().windowWidth * 43 / 52;
           // AD._instance.bannerAD.style.top = wx.getSystemInfoSync().windowHeight - this.bannerAD.style.realHeight;
            AD._instance.bannerAd.style.left = (wx.getSystemInfoSync().windowWidth -  AD._instance.bannerAd.style.realWidth) / 2;
        } else {
            // this.bannerAD.style.top = wx.getSystemInfoSync().windowHeight - this.bannerAD.style.realHeight;
            AD._instance.bannerAd.style.width=width;
            AD._instance.bannerAd.style.left = (wx.getSystemInfoSync().windowWidth -  AD._instance.bannerAd.style.realWidth) / 2;
        }
    },

});