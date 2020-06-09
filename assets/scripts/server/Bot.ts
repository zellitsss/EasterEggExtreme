import { PLAYER_RADIUS, EGG_RADIUS, PLAYER_SPEED } from "../Defines";
import { GetRandomPosition } from "./utils";

export default class Bot {
    target: cc.Vec2 = new cc.Vec2(0, 0);
    position: cc.Vec2 = new cc.Vec2(0,0);

    update(dt) {
        let direction: cc.Vec2 = this.target.sub(this.position);
        if (direction.len() <= PLAYER_RADIUS + EGG_RADIUS) {
            this.target = GetRandomPosition();
            direction = this.target.sub(this.position);
        }
        direction.normalizeSelf();
        this.position.add(direction.mul(dt * PLAYER_SPEED));
    }
}