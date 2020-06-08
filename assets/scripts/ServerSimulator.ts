import { PLAY_TIME, MIN_SPAWN_TIME, MAX_SPAWN_TIME, MAX_PLAYERS, CANVAS_WIDTH, PLAYER_RADIUS, CANVAS_HEIGHT } from "./Defines";
import Player from "./server/Player";
import LocalClient from "./LocalClient";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ServerSimulator extends cc.Component {

    minUpdateTime: number = 0.1;
    maxUpdateTime: number = 0.5;

    updateCountdown: number = 0;
    playTimeCountdown: number = 0;

    spawnTime: number;

    playersList: Player[] = [];

    localClients: LocalClient;

    onLoad() {
        // simulate the connection between server-client
        this.localClients = this.node.getComponent(LocalClient);

        this.playTimeCountdown = PLAY_TIME;
        this.spawnTime = this.GetSpawnTime();

        // create players with random position
        for (let i = 0; i < MAX_PLAYERS; i++) {
            let player: Player = new Player();
            let id = this.UniqueID()
            player.setID(id);
            player.setPosition(this.GetRandomPosition());
            this.playersList.push(player);
        }
        
        // send initial message to local
        let playerPacks: any = {};
        this.playersList.forEach((player) => {
            playerPacks[player.id] = {
                x: player.getPosition().x,
                y: player.getPosition().y
            }
        })
        this.localClients.GetInitMessage(playerPacks);
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

    GetRandomPosition(): cc.Vec2 {
        return new cc.Vec2(
            this.RandomBetween(PLAYER_RADIUS / 2, CANVAS_WIDTH - PLAYER_RADIUS / 2),
            this.RandomBetween(PLAYER_RADIUS / 2, CANVAS_HEIGHT - PLAYER_RADIUS / 2));
    }
}
