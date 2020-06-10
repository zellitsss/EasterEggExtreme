import LocalClient from "./LocalClient";
import InterpolationBuffer from "./InterpolationBuffer";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Player extends cc.Component {
    horizontalMovement: number = 0;
    verticalMovement: number = 0;

    @property(cc.Node)
    localClient: cc.Node = null;

    onLoad() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    update(dt) {
        let position: cc.Vec2 = this.node.getComponent(InterpolationBuffer).lerpPosition;
        this.node.setPosition(position);
    }

    onKeyDown(event: cc.Event.EventKeyboard) {
        switch (event.keyCode) {
            case cc.macro.KEY.w:
                this.verticalMovement = 1;
                break;
            case cc.macro.KEY.s:
                this.verticalMovement = -1;
                break;
            case cc.macro.KEY.a:
                this.horizontalMovement = -1;
                break;
            case cc.macro.KEY.d:
                this.horizontalMovement = 1;
                break;
            default:
                break;
        }
        this.SendDirectionToServer();
    }

    onKeyUp(event: cc.Event.EventKeyboard) {
        switch (event.keyCode) {
            case cc.macro.KEY.w:
                if (this.verticalMovement == 1) {
                    this.verticalMovement = 0;
                }
                break;
            case cc.macro.KEY.s:
                if (this.verticalMovement == -1) {
                    this.verticalMovement = 0
                }
                break;
            case cc.macro.KEY.a:
                if (this.horizontalMovement == -1) {
                    this.horizontalMovement = 0;
                }
                break;
            case cc.macro.KEY.d:
                if (this.horizontalMovement == 1) {
                    this.horizontalMovement = 0;
                }
                break;
            default:
                break;
        }
        this.SendDirectionToServer();
    }

    SendDirectionToServer() {
        let direction: cc.Vec2 = new cc.Vec2(this.horizontalMovement, this.verticalMovement);
        this.localClient.getComponent(LocalClient).SendDirectionToServer(direction);
    }
}
