//游戏内容初始化 关卡分享等各种信息
let len;
let Share = cc.Class({
    name: 'Share',
    properties: {
        title: '分享',
        image: '',
    },
});
let gateClass = cc.Class({
    name: 'bottle1',
    properties:
    {
        type: 0,
        rotation: 30,
    },
    ctor() {
        //构造函数
    }
})
let propClass = cc.Class({
    name: 'prop',
    properties: {
        prop: cc.SpriteFrame,
        name: cc.SpriteFrame,
        gun:cc.SpriteFrame,
        des:cc.SpriteFrame,
    }
})
let GameInfo = cc.Class({
    properties: {
        icon_url: "",
        appid: ""
    }
});
const url = 'https://www.7cgames.cn/GameRes/7CGamesBoxWX/';

cc.Class({
    extends: cc.Component,
    properties: {
        audioArray:
        {
            //音频
            type: cc.AudioClip,
            default: [],
        },
        //特定的属性初始化比如颜色贴图等
        colorArray: [cc.SpriteFrame],
        propArray: [propClass],
        partiCleArray: [],

        shareArray: [], //分享信息
        shareMes: cc.TextAsset, //分享的文本信息
        gateArray: [gateClass],
        sGateArray: [gateClass],
        gateMes:
        {
            default: null,
            type: cc.JsonAsset
        },
        bulletArray:[],


    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        Global.resource = this;
        //常驻节点
        cc.game.addPersistRootNode(this.node); 
        //初始化关卡信息
        this.RestGateArray(); 
        //初始化分享信息
        this.ResetShare();
        //初始化更多游戏的二维码
        this.RestMoreList();
    },

    start() {
        var self = this;
        if (CC_WECHATGAME) {           
            //初始化转发菜单
            var shareMes = self.GetShare();
            wx.showShareMenu();
            cc.loader.loadRes(shareMes.image, function (err, path) {
                wx.onShareAppMessage(function () {
                    return {
                        title: shareMes.title,
                        imageUrl: path.url
                    }
                })
            });
        }
    },
    ResetShare() {
        //初始化分享信息
        var shareArr = this.shareArray;
        var shareAr = this.shareMes.text.split('|');
        len = shareAr.length - 1;
        for (let i = 0; i < len; i++) {
            var mes = shareAr[i].split('%');
            var share = new Share();
            //console.log(mes[0]===2);   
            share.title = mes[0];
            share.image = mes[1]
            shareArr.push(share);
        }
    },
    GetShare() {
        let ran = Math.floor(Math.random() * len);
        return this.shareArray[ran];
    },
    RestMoreList() {
        if (CC_WECHATGAME) {
            wx.request({
                url: url + 'QRCode/WXGameCode.json',
                headers: {
                    'Content-Type': 'application/json'
                },
                success: function (res) {
                    Global.moreGameList = res.data.data;
                }
            })
        }
        if (CC_WECHATGAME) {

            wx.request({
                url: url + 'JumpIcons/7cgamesJump.json',
                headers: {
                    'Content-Type': 'application/json'
                },
                success: function (res) {
                    Global.navigatorList = res.data.data;
                }
            })
        }
    },
    RestGateArray() {
        {
            let json = this.gateMes.json.data;
            let len = json.length;

            for (let i = 0; i < len; i++) {
                let types = json[i].type.split('|');
                let jsons = json[i].rotation.split('|');
                let sTypes = json[i].sType.split('|');
                let sJsons = json[i].sRotation.split('|');
                let bullet= json[i].bullet;
                let lens = types.length;
                let len2 = sTypes.length;
                if (sTypes[0] == '') {
                    len2 = 0;
                }
                let sGateMes = [];
                let gateMesArray = [];
                for (let j = 0; j < lens; j++) {
                    let gate = new gateClass();
                    gate.type = parseInt(types[j]);
                    gate.rotation = parseInt(jsons[j]);
                    gateMesArray[j] = gate;
                }
                for (let k = 0; k < len2; k++) {
                    let gate = new gateClass();
                    gate.type = parseInt(sTypes[k]);
                    gate.rotation = parseInt(sJsons[k]);
                    sGateMes[k] = gate;
                }
                this.gateArray[i] = gateMesArray;
                this.sGateArray[i] = sGateMes;
                this.bulletArray[i]=parseInt(bullet);
            }
        }
    },


    ResetColor() {
        let color1 = cc.color(229, 45, 39, 255);
        let color2 = cc.color(28, 255, 97, 255);
        let color3 = cc.color(160, 68, 255, 255);
        let color4 = cc.color(231, 233, 62, 255);
        this.partiCleArray.push(color1)
        this.partiCleArray.push(color2)
        this.partiCleArray.push(color3)
        this.partiCleArray.push(color4)
        //  红绿紫黄
        //  红黄紫绿
    },
    // update (dt) {},
    PlayEffect(id) {
        //播放音效
        if (Global.isQuiet == false) {
            let au = this.audioArray[id];
            this.scheduleOnce(function () {
                cc.audioEngine.playEffect(au, false);
            })
        }
    },


});
