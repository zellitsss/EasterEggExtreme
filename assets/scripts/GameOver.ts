const {ccclass, property} = cc._decorator;

@ccclass
export default class GameOver extends cc.Component {

    OnPlayAgainBtnPressed() {
        cc.director.loadScene('play_scene');
    }
}
