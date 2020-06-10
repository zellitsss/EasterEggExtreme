import Entity from "./Entity";
import Bot from "./Bot";
import { GetRandomPosition, Clamp } from "./utils";
import { PLAYER_SPEED, PLAYER_RADIUS, CANVAS_WIDTH, CANVAS_HEIGHT } from "../Defines";
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

        this.position.x = Clamp(this.position.x, PLAYER_RADIUS, CANVAS_WIDTH - PLAYER_RADIUS);
        this.position.y = Clamp(this.position.y, PLAYER_RADIUS, CANVAS_HEIGHT - PLAYER_RADIUS);

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