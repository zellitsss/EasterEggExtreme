import InterpolationBuffer from "./InterpolationBuffer";

const {ccclass, property} = cc._decorator;

@ccclass
export default class RemotePlayer extends cc.Component {

    update (dt) {
        let position: cc.Vec2 = this.node.getComponent(InterpolationBuffer).lerpPosition;
        this.node.setPosition(position);
    }
}
