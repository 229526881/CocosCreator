
//自定义对象池
var Pool = cc.Class({
    name: 'Pool',
    properties: {
        prefab: cc.Prefab,
        size: 0,
    },
});

cc.Class({
    extends: cc.Component,

    properties: {
        pools: {
            default: [],
            type: [Pool],
            tooltip: '对象池',
        },
        nodePools: [],
    },

    onLoad() {
        Global.poolManage=this;
        cc.game.addPersistRootNode(this.node);
        for (let i = 0; i < this.pools.length; i++) {
            let nodePool = new cc.NodePool();
            for (let j = 0; j < this.pools[i].size; j++) {
                let prefab = cc.instantiate(this.pools[i].prefab);
                nodePool.put(prefab);
            }
            this.nodePools.push(nodePool);
        }
    },

    //可在start里进行测试，之后注释此方法
    start() {
        var obj = this.spawnObjFromPool(0, this.node);
        obj.setPosition(new cc.Vec2(Math.random() * 200 - 100, Math.random() * 350));
        obj.setScale(Math.random() * 0.7 + 0.3);
    },

    spawnObjFromPool(poolID, parentNode) {
        let obj = null;
        if (this.nodePools[poolID].size() > 0) {
            obj = this.nodePools[poolID].get();
        }
        else {
            obj = cc.instantiate(this.pools[poolID].prefab);
        }

        obj.parent = parentNode;
        return obj;
    },

    recycleObj(poolID, obj) {
        this.nodePools[poolID].put(obj);
    }
});
