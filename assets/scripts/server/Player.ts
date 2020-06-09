import Entity from "./Entity";
import Bot from "./Bot";
import { GetRandomPosition } from "./utils";
import { PLAYER_SPEED } from "../Defines";
import Egg from "./Egg";

export default class Player extends Entity {
    isBot: boolean = false;
    bot: Bot = null;
    direction: cc.Vec2 = new cc.Vec2(0, 0);
    score: number = 0;
    eggsList: Egg[] = [];

    update(dt) {
        if (this.isBot) {
            this.bot.eggsList = this.eggsList;
            this.bot.update(dt);
            this.direction = this.bot.direction;
        }

        this.direction.normalizeSelf();
        this.position = this.position.add(this.direction.mul(dt * PLAYER_SPEED));

        if (this.isBot) {
            this.bot.position = this.position
        }
    }

    SetupBot() {
        this.bot = new Bot();
        this.bot.position = this.position;
        this.bot.target = GetRandomPosition();
        this.isBot = true;
    }
}