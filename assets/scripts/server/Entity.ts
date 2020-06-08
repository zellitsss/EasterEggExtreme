export default class Entity {
    position: cc.Vec2;
    id: string;

    setPosition(pos: cc.Vec2) {
        this.position = pos;
    }

    getPosition(): cc.Vec2 {
        return this.position;
    }

    setID(id: string) {
        this.id = id;
    }
}