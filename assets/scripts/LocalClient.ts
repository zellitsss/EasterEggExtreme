import RivalAI from "./RivalAI";

const {ccclass, property} = cc._decorator;

@ccclass
export default class LocalClient extends cc.Component {
    @property(cc.Prefab)
    eggPrefab: cc.Prefab = null;

    @property(cc.Node)
    player: cc.Node = null;

    playerID: string = null;

    rivalList = {};
    eggsList = {};
    
    GetInitMessage(data: any) {
        this.playerID = data.id;
        this.player.setPosition(this.node.convertToNodeSpaceAR(new cc.Vec2(data.x, data.y)));
    }

    AddNewEgg(eggData: any) {
        let egg: cc.Node = cc.instantiate(this.eggPrefab);
        egg.parent = this.node;
        egg.setPosition(this.node.convertToNodeSpaceAR(new cc.Vec2(eggData.x, eggData.y)));
        this.eggsList[eggData.id] = egg;
    }

    RemoveEgg(eggData: any) {
        if (this.eggsList.hasOwnProperty(eggData.id)) {
            delete this.eggsList[eggData.id];
        }
    }
}
