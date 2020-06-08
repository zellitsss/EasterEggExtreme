import RivalAI from "./RivalAI";

const {ccclass, property} = cc._decorator;

@ccclass
export default class LocalClient extends cc.Component {
    @property(cc.Prefab)
    rivalPrefab: cc.Prefab = null;

    @property(cc.Node)
    player: cc.Node = null;

    playerID: string = null;
    
    GetInitMessage(playersPack: any) {
        let entries = Object.entries(playersPack);
        // get first entry for local player;
        this.playerID = entries[0][0];
        let data: any = entries[0][1];
        this.player.setPosition(this.node.convertToNodeSpaceAR(new cc.Vec2(data.x, data.y)));

        // create rival instance
        for (let i = 1; i < entries.length; i++) {
            let rival: cc.Node = cc.instantiate(this.rivalPrefab)
            rival.getComponent(RivalAI).id = entries[i][0];
            rival.parent = this.node;
            let data: any = entries[i][1];
            rival.setPosition(this.node.convertToNodeSpaceAR(new cc.Vec2(data.x, data.y)));
        }
    }
}
