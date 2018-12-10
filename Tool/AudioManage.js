//音效信息的初始化
let effectClass = cc.Class({
    name: 'effect',
    properties: {
        tag: '',
        sound: {
            default: null,
            type: cc.AudioClip,
        }
    },

});
cc.Class({
    extends: cc.Component,
    properties: {
        audioArray: {
            default: [],
            type: [effectClass],
        }
    },
    onLoad() {    
        Global.audioManage = this;
        //常驻节点
        cc.game.addPersistRootNode(this.node);

    },
    PlayEffect(id) {
        //播放音效一次
        if (!Global.isQuiet) {
            let au = this.audioArray[id];      
                cc.audioEngine.playEffect(au.sound, false);
        }
        
    },
    PlayBGM(id) {
        //播放背景音乐
        if (!Global.isQuiet) {
            let au = this.audioArray[id];
            this.scheduleOnce(function () {
               // console.log(au.sound)
                cc.audioEngine.playMusic(au.sound, true);
            })
        }
    },
    StopBGM() {
        cc.audioEngine.stopMusic();
    },
    StopOne(id) {
        let au = this.audioArray[id];
       // console.log(au.sound)
        cc.audioEngine.stopEffect(au.sound);
    },
    StopAll() {
        cc.audioEngine.stopAllEffects();
    }


});
