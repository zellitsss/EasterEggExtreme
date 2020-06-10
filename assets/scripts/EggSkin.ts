const {ccclass, property} = cc._decorator;

@ccclass
export default class EggSkin extends cc.Component {
    start() {
        // silly way to get random sprite
        let min: number = 1;
        let max: number = 3;
        let i: number = Math.round(Math.random() * (max - min) + min);
        let spriteName: string = 'egg' + i.toString();
        cc.loader.loadRes(spriteName, cc.SpriteFrame, (error: Error, spriteFrame: cc.SpriteFrame) => {
            this.node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        });
    }
}
