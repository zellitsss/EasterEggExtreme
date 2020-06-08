import { PLAY_TIME, MIN_SPAWN_TIME, MAX_SPAWN_TIME } from "./Defines";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ServerSimulator extends cc.Component {

    minUpdateTime: number = 0.1;
    maxUpdateTime: number = 0.5;

    updateCountdown: number = 0;
    playTimeCountdown: number = 0;

    spawnTime: number;

    playersList = {};

    onLoad() {
        this.playTimeCountdown = PLAY_TIME;
        this.spawnTime = this.GetSpawnTime();
    }

    update (dt) {

        if (this.updateCountdown <= 0) {
            // send update to client
            this.updateCountdown = this.GetRandomUpdateTime();
        } else {
            this.updateCountdown -= dt;
        }
    }

    UniqueID(): string {
        let num = Date.now() + Math.random();
        return num.toString(36);
    }

    RandomBetween(min: number, max: number, precision: number = 1): number {
        return Math.floor(Math.random() * (max * precision - min * precision) + min * precision) / precision;
    }

    GetRandomUpdateTime(): number {
        return this.RandomBetween(this.minUpdateTime, this.maxUpdateTime, 100);
    }

    GetSpawnTime(): number {
        return this.RandomBetween(MIN_SPAWN_TIME, MAX_SPAWN_TIME);
    }
}
