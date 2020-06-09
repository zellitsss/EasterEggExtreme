const {ccclass, property} = cc._decorator;

@ccclass
export default class GameOver extends cc.Component {
    @property(cc.Label)
    score: cc.Label = null;

    @property(cc.Label)
    result: cc.Label = null;

    start() {
        this.score.string = Global.score.toString();
        if (Global.win) {
            this.result.string = 'You win!';
        } else {
            this.result.string = 'Better luck next time!';
        }
    }

    OnPlayAgainBtnPressed() {
        cc.director.loadScene('play_scene');
    }
}
