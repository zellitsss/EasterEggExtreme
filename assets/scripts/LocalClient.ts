import ServerSimulator from "./ServerSimulator";
import ScoreControl from "./ScoreControl";

const {ccclass, property} = cc._decorator;

@ccclass
export default class LocalClient extends cc.Component {
    @property(cc.Prefab)
    eggPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    rivalPrefab: cc.Prefab = null;

    @property(cc.Node)
    player: cc.Node = null;

    server: ServerSimulator = null;

    playerID: string = null;

    rivalList = {};
    eggsList = {};

    onLoad() {
        this.server = this.node.getComponent(ServerSimulator);
    }
    
    GetInitMessage(data: any[]) {
        data.forEach((playerData: any) => {
            if (playerData.self == true) {
                this.playerID = playerData.id;
                this.player.setPosition(this.node.convertToNodeSpaceAR(new cc.Vec2(playerData.x, playerData.y)));
            } else {
                let rival: cc.Node = cc.instantiate(this.rivalPrefab);
                rival.setPosition(this.node.convertToNodeSpaceAR(new cc.Vec2(playerData.x, playerData.y)));
                rival.parent = this.node;
                this.rivalList[playerData.id] = rival;
            }
        });
    }

    AddNewEgg(eggData: any) {
        let egg: cc.Node = cc.instantiate(this.eggPrefab);
        egg.parent = this.node;
        egg.setPosition(this.node.convertToNodeSpaceAR(new cc.Vec2(eggData.x, eggData.y)));
        this.eggsList[eggData.id] = egg;
    }

    RemoveEgg(eggData: any) {
        if (this.eggsList.hasOwnProperty(eggData.id)) {
            let egg: cc.Node = this.eggsList[eggData.id];
            egg.destroy();
            delete this.eggsList[eggData.id];
        }
    }

    SetPlayerPosition(position: cc.Vec2) {
        this.player.setPosition(this.node.convertToNodeSpaceAR(position));
    }

    GetUpdateFromServer(data: any[]) {
        data.forEach((playerData) => {
            if(playerData.self == true) {
                this.player.setPosition(this.node.convertToNodeSpaceAR(new cc.Vec2(playerData.x, playerData.y)));
                this.player.getComponent(ScoreControl).SetScore(playerData.score);
            } else {
                if (this.rivalList.hasOwnProperty(playerData.id)) {
                    let rival: cc.Node = this.rivalList[playerData.id];
                    rival.setPosition(this.node.convertToNodeSpaceAR(new cc.Vec2(playerData.x, playerData.y)));
                    rival.getComponent(ScoreControl).SetScore(playerData.score);
                }
            }
        })
    }

    SendDirectionToServer(direction: cc.Vec2) {
        this.server.OnPlayerMove(this.playerID, direction);
    }
}
