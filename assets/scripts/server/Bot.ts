import { PLAYER_RADIUS, EGG_RADIUS, PLAYER_SPEED, BOT_SIGHT } from "../Defines";
import { GetRandomPosition } from "./utils";
import Egg from "./Egg";

export default class Bot {
    target: cc.Vec2 = new cc.Vec2(0, 0);
    position: cc.Vec2 = new cc.Vec2(0, 0);
    direction: cc.Vec2 = new cc.Vec2(0, 0);
    eggsList: Egg[] = [];

    update(dt) {
        let nearestDistance = BOT_SIGHT;
        this.eggsList.forEach((egg: Egg) => {
            let distance = egg.position.sub(this.position).len();
            if (distance <= nearestDistance) {
                nearestDistance = distance;
                this.target = egg.position;
            }
        });

        let direction: cc.Vec2 = this.target.sub(this.position);
        if (direction.len() <= PLAYER_RADIUS + EGG_RADIUS) {
            this.target = GetRandomPosition();
            direction = this.target.sub(this.position);
        }
        direction.normalizeSelf();
        this.direction = direction;
    }
}