import ServerSimulator from "./ServerSimulator";
import { GetRandomPosition } from "./server/utils";
import { PLAYER_RADIUS, EGG_RADIUS } from "./Defines";

const {ccclass, property} = cc._decorator;

@ccclass
export default class RivalAI extends cc.Component {
   
    id: string;
    server: ServerSimulator = null;
    eggsList: any[] = [];

    speed: number = 150;
    targetPosition: cc.Vec2;

    onLoad() {
        this.targetPosition = GetRandomPosition();
    }
    
    update(dt) {
        let direction: cc.Vec2 = this.node.convertToNodeSpaceAR(this.targetPosition).sub(this.node.getPosition());
        if (direction.len() <= PLAYER_RADIUS + EGG_RADIUS)  {
            this.targetPosition = GetRandomPosition();
            direction = this.targetPosition.sub(this.node.parent.convertToWorldSpaceAR(this.node.getPosition()));
        }
        direction.normalizeSelf();
        this.SendDirectionToServer(direction);
    }

    UpdateEggsList(eggsList: any) {
        this.eggsList = eggsList;
    }

    SendDirectionToServer(direction: cc.Vec2) {
        this.server.OnPlayerMove(this.id, direction);
    }
}
