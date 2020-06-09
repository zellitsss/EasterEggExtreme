import Entity from "./Entity";
import Bot from "./Bot";

export default class Player extends Entity {
    isBot: boolean = false;
    bot: Bot = null;

    update(dt) {
        if (this.isBot) {
            this.bot.update(dt);
            this.position = this.bot.position;
        }
    }

    SetupBot() {
        this.bot = new Bot();
        this.bot.position = this.position;
        this.isBot = true;
    }
}