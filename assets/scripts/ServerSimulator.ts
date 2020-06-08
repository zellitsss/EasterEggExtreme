import { PLAY_TIME, MIN_SPAWN_TIME, MAX_SPAWN_TIME, MAX_PLAYERS, CANVAS_WIDTH, PLAYER_RADIUS, CANVAS_HEIGHT, MAX_EGGS, EGG_RADIUS, PLAYER_SPEED } from "./Defines";
import Player from "./server/Player";
import LocalClient from "./LocalClient";
import { GetSpawnTime, UniqueID, GetRandomPosition, GetRandomUpdateTime } from "./server/utils";
import Egg from "./server/Egg";
import RivalAI from "./RivalAI";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ServerSimulator extends cc.Component {

    @property(cc.Prefab)
    rivalPrefab: cc.Prefab = null;

    minUpdateTime: number = 0.1;
    maxUpdateTime: number = 0.5;

    updateCountdown: number = 0;
    playTimeCountdown: number = 0;

    spawnTime: number;

    // server will directly control the rivals
    rivalsList = {};
    playersList = {};
    eggsList: Egg[] = [];

    inputBuffer = {};

    localClients: LocalClient;

    onLoad() {
        // simulate the connection between server-client
        this.localClients = this.node.getComponent(LocalClient);

        this.playTimeCountdown = PLAY_TIME;
        this.spawnTime = GetSpawnTime();

        // create players with random position
        for (let i = 0; i < MAX_PLAYERS; i++) {
            let player: Player = new Player();
            let id = UniqueID()
            player.setID(id);
            player.setPosition(GetRandomPosition());
            this.playersList[id] = player;

            if (i == 0) {
                // send initial message to local with the first created player
                this.localClients.GetInitMessage({
                    id: id,
                    x: player.position.x,
                    y: player.position.y
                });
            } else {
                // create other rivals
                let rival: cc.Node = cc.instantiate(this.rivalPrefab)
                rival.getComponent(RivalAI).id = id;
                rival.getComponent(RivalAI).server = this;
                rival.parent = this.node;
                rival.setPosition(this.node.convertToNodeSpaceAR(new cc.Vec2(player.position.x, player.position.y)));
                this.rivalsList[id] = rival;
            }
        }
    }

    update (dt) {
        if (this.spawnTime <= 0 && this.eggsList.length < MAX_EGGS) {
            this.SpawnNewEgg();
            this.spawnTime = GetSpawnTime();
        } else {
            this.spawnTime -= dt;
        }

        // update player position
        Object.values(this.playersList).forEach((player: Player) => {
            if (this.inputBuffer.hasOwnProperty(player.id)) {
                let directions: cc.Vec2[] = this.inputBuffer[player.id];
                directions.forEach((dir: cc.Vec2) => {
                    player.setPosition(player.getPosition().add(dir.normalize().mul(dt * PLAYER_SPEED)));
                });
                delete this.inputBuffer[player.id];
                if (this.rivalsList.hasOwnProperty(player.id)) {
                    let rival: cc.Node = this.rivalsList[player.id];
                    rival.setPosition(rival.parent.convertToNodeSpaceAR(player.getPosition()));
                }
            }
        });

        // collision detection
        Object.values(this.playersList).forEach((player: Player) => {
            this.eggsList.forEach((egg, eggIndex) => {
                let distance: number = player.getPosition().sub(egg.getPosition()).len();
                if (distance <= EGG_RADIUS + PLAYER_RADIUS) {
                    // increase score for player

                    // remove egg
                    this.localClients.RemoveEgg({
                        id: egg.id
                    })
                    this.eggsList.splice(eggIndex, 1);
                }
            });
        });

        this.UpdateEggsListToAI();

        if (this.updateCountdown <= 0) {
            // send update to client
            this.updateCountdown = GetRandomUpdateTime();
        } else {
            this.updateCountdown -= dt;
        }
    }

    SpawnNewEgg() {
        let egg: Egg = new Egg();
        egg.setID(UniqueID());
        egg.setPosition(GetRandomPosition());
        let eggData: any = {
            id: egg.id,
            x: egg.getPosition().x,
            y: egg.getPosition().y
        }
        this.localClients.AddNewEgg(eggData);
        this.eggsList.push(egg);
    }

    UpdateEggsListToAI() {
        let eggsPack: any[] = [];
        this.eggsList.forEach((egg: Egg) => {
            let d = {
                id: egg.id,
                x: egg.position.x,
                y: egg.position.y
            };
            eggsPack.push(d);
        });
        Object.values(this.rivalsList).forEach((rival: cc.Node) => {
            rival.getComponent(RivalAI).UpdateEggsList(eggsPack);
        })
    }

    OnPlayerMove(id: string, direction: cc.Vec2) {
        this.inputBuffer[id] = [];
        this.inputBuffer[id].push(direction);
    }
}