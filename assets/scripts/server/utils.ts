import { MIN_SPAWN_TIME, MAX_SPAWN_TIME, PLAYER_RADIUS, CANVAS_WIDTH, CANVAS_HEIGHT, EGG_RADIUS } from "../Defines";

export function UniqueID(): string {
    let num = Date.now() + Math.random();
    return num.toString(36);
}

export function RandomBetween(min: number, max: number, precision: number = 1): number {
    return Math.floor(Math.random() * (max * precision - min * precision) + min * precision) / precision;
}

export function GetRandomUpdateTime(): number {
    return this.RandomBetween(0.1, 0.5, 100);
}

export function GetSpawnTime(): number {
    return this.RandomBetween(MIN_SPAWN_TIME, MAX_SPAWN_TIME);
}

export function GetRandomPosition(): cc.Vec2 {
    return new cc.Vec2(
        this.RandomBetween(PLAYER_RADIUS, CANVAS_WIDTH - PLAYER_RADIUS),
        this.RandomBetween(PLAYER_RADIUS, CANVAS_HEIGHT - PLAYER_RADIUS));
}

export function Clamp(num: number, min: number, max: number): number {
    return Math.min(Math.max(num, min), max);
}