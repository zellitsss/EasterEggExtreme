const {ccclass, property} = cc._decorator;

@ccclass
export default class Player extends cc.Component {
    horizontalMovement: number = 0;
    verticalMovement: number = 0;
    speed: number = 150;

    onLoad() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    update(dt) {
        let direction: cc.Vec2 = new cc.Vec2(this.horizontalMovement, this.verticalMovement);
        direction.normalizeSelf();
        this.node.setPosition(this.node.getPosition().add(direction.mul(dt * this.speed)));
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
    }
}
