import { PLAY_TIME, MAX_PLAYERS, PLAYER_RADIUS, MAX_EGGS, EGG_RADIUS} from "./Defines";
import Player from "./server/Player";
import LocalClient from "./LocalClient";
import { GetSpawnTime, UniqueID, GetRandomPosition, GetRandomUpdateTime } from "./server/utils";
import Egg from "./server/Egg";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ServerSimulator extends cc.Component {

    minUpdateTime: number = 0.1;
    maxUpdateTime: number = 0.5;

    updateCountdown: number = 0;
    playTimeCountdown: number = 0;

    spawnTime: number;

    playersList = {}; // list of server objects
    eggsList: Egg[] = [];

    localPlayerID: string;

    localClient: LocalClient;

    onLoad() {
        // simulate the connection between server-client
        this.localClient = this.node.getComponent(LocalClient);

        this.playTimeCountdown = PLAY_TIME;
        this.spawnTime = GetSpawnTime();

        let data: any[] = [];
        // create players with random position
        for (let i = 0; i < MAX_PLAYERS; i++) {
            let id = UniqueID();
            let player: Player = new Player();
            player.setID(id);
            player.setPosition(GetRandomPosition());
            let d = {
                id: id,
                x: player.position.x,
                y: player.position.y,
                score: 0,
                self: false
            };
            if (i == 0) {
                // let's first created player be a local player
                this.localPlayerID = id;
                d.self = true;
            } else {
                player.SetupBot();
            }
            this.playersList[id] = player;

            data.push(d);
        }

        this.localClient.GetInitMessage(data);
    }

    update (dt) {
        if (this.playTimeCountdown <= 0) {
            let maxScore: number = 0;
            let winner = {};
            Object.values(this.playersList).forEach((player: Player) => {
                if (player.score >= maxScore) {
                    maxScore = player.score
                    winner = {
                        score: player.score,
                        id: player.id
                    }
                }
            });
            this.localClient.GameOver(winner);
        } else {
            if (this.spawnTime <= 0 && this.eggsList.length < MAX_EGGS) {
                this.SpawnNewEgg();
                this.spawnTime = GetSpawnTime();
            } else {
                this.spawnTime -= dt;
            }
    
            let data: any[] = [];
            // update player
            Object.values(this.playersList).forEach((player: Player) => {
                player.update(dt);
    
                let d = {
                    id: player.id,
                    x: player.position.x,
                    y: player.position.y,
                    score: player.score,
                    self: player.id === this.localPlayerID
                };
                data.push(d);
            });
    
            // collision detection
            Object.values(this.playersList).forEach((player: Player) => {
                this.eggsList.forEach((egg, eggIndex) => {
                    let distance: number = player.getPosition().sub(egg.getPosition()).len();
                    if (distance <= EGG_RADIUS + PLAYER_RADIUS) {
                        // increase score for player
                        player.score += egg.score;
                        // remove egg
                        this.localClient.RemoveEgg({
                            id: egg.id
                        })
                        this.eggsList.splice(eggIndex, 1);
                    }
                });
            });

            // update eggs list to players
            Object.values(this.playersList).forEach((player: Player) => {
                player.eggsList = this.eggsList;
            })
    
            if (this.updateCountdown <= 0) {
                this.SendUpdateToClient(data);
                this.updateCountdown = GetRandomUpdateTime();
            } else {
                this.updateCountdown -= dt;
            }
            this.playTimeCountdown -= dt;
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
        this.localClient.AddNewEgg(eggData);
        this.eggsList.push(egg);
    }

    SendUpdateToClient(data: any[]) {
        this.localClient.GetUpdateFromServer(data);
    }

    OnPlayerMove(id: string, direction: cc.Vec2) {
        let player: Player = this.playersList[id];
        player.direction = direction.normalize();
    }
}