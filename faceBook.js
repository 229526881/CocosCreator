var gameStatic = require('GameStatic');
var Interstitial_Ad_Placement_Id = '788762644798446_797061480635229';
var RewardedVideo_Ad_Placement_Id = '788762644798446_797061820635195';
let width = 0;
let AD = cc.Class({
    extends: cc.Component,
    properties: {
    },
    statics: {
        _instance: null
    },
    onLoad() {
        gameStatic.ad = this;
        AD._instance = this;
        cc.game.addPersistRootNode(this.node);
        this.InitWechatBanner();


        if (Global.isFaceBook) {
            //确定为facebook下
            AD._instance.preLoadInterstitial()
                .then(preloadedInterstitial => AD._instance.preloadedInterstitial = preloadedInterstitial)
                .catch(err => console.log(err.code + 'Interstitial'));
            AD._instance.preLoadRewarded()
                .then(preloadedRewardedVideo => AD._instance.preloadedRewardedVideo = preloadedRewardedVideo)
                .catch(err => console.log(err.code + 'Rewarded'));
        }
    },



    //微信端广告代码
    InitWechatBanner() {
        var self = this;
        if (CC_WECHATGAME) {
            if (wx.getSystemInfoSync().SDKVersion >= '2.0.4') {
                let windowSize = cc.view.getVisibleSize();//获得屏幕尺寸
                width = windowSize.height / windowSize.width < 1.4 ? 550 : wx.getSystemInfoSync().windowWidth * 43 / 52;//计算广告在相同高度下应有宽度      
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
                    self.setBannerADHeight(res);
                })
                this.bannerAd.onError(function () {
                    console.log('error');
                })
            }
        }
    },
    showad: function () {
        if (CC_WECHATGAME && wx.getSystemInfoSync().SDKVersion >= '2.0.4') {
            AD._instance.bannerAd.show();
        }
    },
    closead: function () {
        if (CC_WECHATGAME && wx.getSystemInfoSync().SDKVersion >= '2.0.4') {
            AD._instance.bannerAd.hide();
        }
    },
    setBannerADHeight: function (res) {
        //保持相同高度生成不同宽度的广告条
        if ((res.height / res.width) > 0.346) {
            AD._instance.bannerAd.style.width = width * 43 / 52;
            //AD._instance.bannerAD.style.width = wx.getSystemInfoSync().windowWidth * 43 / 52;
            // AD._instance.bannerAD.style.top = wx.getSystemInfoSync().windowHeight - this.bannerAD.style.realHeight;
            AD._instance.bannerAd.style.left = (wx.getSystemInfoSync().windowWidth - AD._instance.bannerAd.style.realWidth) / 2;
        } else {
            // this.bannerAD.style.top = wx.getSystemInfoSync().windowHeight - this.bannerAD.style.realHeight;
            AD._instance.bannerAd.style.width = width;
            AD._instance.bannerAd.style.left = (wx.getSystemInfoSync().windowWidth - AD._instance.bannerAd.style.realWidth) / 2;
        }
    },


    //facebook分享代码
    ShareForFace() {
        let self = this;
        //获得分享图的路径
        let shareMes = gameStatic.resource.GetShare();
        var url = shareMes.image._textureFilename;
        //获得当前玩家名    
        // let playerName=FBInstant.player.getName();
        let playerName = Global.playerName;
        //获得分享图的base64格式图片
        var image = new Image();
        image.src = url;
        image.onload = function () {
            let base64 = self.getBase64Image(image);
            //console.log(base64)
            FBInstant.shareAsync({
                intent: 'SHARE',
                image: base64,
                text: playerName + ' is asking for your help!',
                data: { myReplayData: '...' },
            }).then(function () {
                // continue with the game.
                //分享回调函数可以写这
            });
        }
    },
    GetBase64Image(img) {
        //解析图片
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, img.width, img.height);
        var ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
        var dataURL = canvas.toDataURL("image/" + ext);
        return dataURL;
    },

    //facebook广告代码
    preLoadInterstitial() {
        //预加载插页广告
        return new Promise(function (resolve, reject) {
            if (typeof FBInstant === 'undefined')
                reject({ code: 'FBINSTANT_IS_UNDEFINED', message: 'FBInstant is undefined' });
            else {
                let supportedAPIs = FBInstant.getSupportedAPIs();
                if (supportedAPIs.includes('getInterstitialAdAsync')) {
                    var preloadedInterstitial = null;
                    FBInstant.getInterstitialAdAsync(Interstitial_Ad_Placement_Id)
                        .then(interstitial => { preloadedInterstitial = interstitial; return preloadedInterstitial.loadAsync() })
                        .then(() => resolve(preloadedInterstitial))
                        .catch(err => reject(err));
                }
                else
                    reject({ code: 'ADS_NOT_SUPPORTED', message: 'Ads not supported in this session' });
            }
        })
    },
    preLoadRewarded() {
        //预加载激励广告
        return new Promise(function (resolve, reject) {
            if (typeof FBInstant === 'undefined')
                reject({ code: 'FBINSTANT_IS_UNDEFINED', message: 'FBInstant is undefined' });
            else {
                let supportedAPIs = FBInstant.getSupportedAPIs();
                if (supportedAPIs.includes('getRewardedVideoAsync')) {
                    var preloadedRewardedVideo = null;
                    FBInstant.getRewardedVideoAsync(RewardedVideo_Ad_Placement_Id)
                        .then(rewarded => { preloadedRewardedVideo = rewarded; return preloadedRewardedVideo.loadAsync() })
                        .then(() => resolve(preloadedRewardedVideo))
                        .catch(err => reject(err));

                    console.log('success');
                }
                else
                    reject({ code: 'ADS_NOT_SUPPORTED', message: 'Ads not supported in this session' });
            }
        })
    },
    showInterstitial() {
        //展示插页广告
        return new Promise(function (resolve, reject) {
            if (typeof FBInstant === 'undefined' || !AD._instance.preloadedInterstitial)
                reject({ code: 'INTERSTITIAL_NOT_LOADED', message: 'Interstitial is not loaded' });
            else
                resolve(AD._instance.preloadedInterstitial.showAsync());

        })
    },
    showRewardedVideo() {
        //展示激励广告
        return new Promise(function (resolve, reject) {
            if (typeof FBInstant === 'undefined' || !AD._instance.preloadedRewardedVideo)
                reject({ code: 'REWARDVIDEO_NOT_LOADED', message: 'RewardedVideo is not loaded' });
            else
                resolve(AD._instance.preloadedRewardedVideo.showAsync());
        })
    },

    //广告展示方法
    ShowReward(){
        let self=this;
        this.showRewardedVideo()
        .then(ad =>self.Test()) //ad随意命名，后面为广告后要执行的回调函数
        .catch(err => console.log(err.code))
    },
    ShowInterstitial(){
        let self=this;
        this.showInterstitial()
        .then(ad =>self.Test())  //ad随意命名，后面为广告后要执行的回调函数
        .catch(err => console.log(err.code))
    },
    Test(){
        console.log('test');
    },
    //跳转其他游戏方法
    JumpToOther(msg, id) {
        //跳转游戏 id 为其他游戏facebook id
        if (Global.isFaceBook) {
            console.log(id)
            FBInstant.switchGameAsync(id)
                .catch(err => console.log(err));
        }
    },
});