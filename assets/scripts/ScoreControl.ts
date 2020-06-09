const {ccclass, property} = cc._decorator;

@ccclass
export default class ScoreControl extends cc.Component {

    @property(cc.Label)
    scoreLabel: cc.Label = null;

    score: number = 0;

    update(dt) {
        this.scoreLabel.string = this.score.toString();
    }

    SetScore(score: number) {
        this.score = score;
    }
}
