const {ccclass, property} = cc._decorator;

@ccclass
export default class InterpolationBuffer extends cc.Component {
    buffer: any[] = [];

    lastPosition: cc.Vec2 = new cc.Vec2(0, 0);
    lastTime: number = 0;

    markedTime: number = 0;
    currentTime: number = 0;

    lerpPosition: cc.Vec2;

    delayedTime: number = 0; // delayed time for interpolating (second)

    update(dt) {
        // delete expired buffer
        while (this.buffer.length > 0 && this.markedTime > this.buffer[0].time + this.delayedTime) {
            this.lastPosition = this.buffer[0].position;
            this.lastTime = this.buffer[0].time;
            this.markedTime = this.lastTime;
            this.buffer.splice(0, 1);
        }

        if (this.buffer.length > 0 && this.buffer[0].time > 0) {
            let factor: number = (this.markedTime - this.lastTime) / (this.buffer[0].time - this.lastTime);
            this.lerpPosition = this.LerpVec2(this.lastPosition, this.buffer[0].position, factor);
        }
        this.markedTime += dt;

        this.currentTime += dt;
    }

    SetOriginPosition(position: cc.Vec2) {
        this.lerpPosition = position;
        this.node.setPosition(position);
        this.lastPosition = position;
        this.lastTime = this.currentTime;
        this.markedTime = this.currentTime;
    }

    PushState(position: cc.Vec2) {
        this.buffer.push({
            position: position,
            time: this.currentTime + this.delayedTime
        });
    }

    /**
     * Linear interpolate from v1, v2, t1, t2 to get Vec2 at time t
     * @param v1 Vec2 at time t1
     * @param v2 Vec2 at time t2
     * @param factor (t - t1) / (t2 - t1)
     */
    LerpVec2(v1: cc.Vec2, v2: cc.Vec2, factor: number): cc.Vec2 {
        return v1.mul(1 - factor).add(v2.mul(factor));
    }
}
