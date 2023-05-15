import Phaser from 'phaser';
import Player from '../Classes/player';
import available_moves from '../Types/available_moves';

export default class registerInput extends Phaser.Scene {
    private key_index = 0;
    private key_timer = 0;



    constructor() {
        super('Input Registered');
        this.key_index = 0;
        this.key_timer = 0;

    }



    //Calls the players registers input first
    public validInput(input: string[], delta: number, player?: Player, opponent?: Player): number {
        //Check if the input is considered a non-fighting move for loop, reset to start!!!
        this.key_timer += delta;
        const nextMoveTime = 500;


        //if (player?.action === "attack/punch" || input[this.key_index] === "attack/kick" || input[this.key_index] === "attack/hook") nextMoveTime = 250;

        while (this.key_timer > nextMoveTime) {

            if (player) {
                player.action = "nothing";
                player.invulnerable = false;
            }

            this.key_timer = 0;
            if (input[this.key_index] === "random") {
                const randomIndex = Math.floor(Math.random() * (available_moves.length));
                input[this.key_index] = available_moves[randomIndex];
            }

            if (input[this.key_index].startsWith("walk") || input[this.key_index].startsWith("jump") ||
                input[this.key_index].startsWith("roll") || input[this.key_index].startsWith("dodge") || input[this.key_index].startsWith("wait")) {
                if (player) {
                    player.attackType = "none";
                    player.movePlayer(260, input[this.key_index], opponent);
                }
            }
            else if (input[this.key_index].startsWith("rest")) {
                if (player) {
                    player.attackType = "none";
                    player.playerRest();
                }
            }
            else {
                if (player) {
                    player?.playerAttack(input[this.key_index], opponent);
                }
            }

            // console.log("SpamCount:", player?.spamCounter);
            this.key_index++;
            if (this.key_index === input.length) {
                this.key_index = 0;
            }

            /*
            if(player?.player1) {
                this.P1_HPText?.setText(`Player 1 HP: ${this.key_index}`);
            } else {
                this.P2_HPText?.setText(`Player 2 HP:${this.key_index}`);
            }
            */
        }
        // console.log("OPEN HOT SAUCE BE LIKE: NOT HELPING >:(((");

        if(this.key_index === undefined) return 0;
        return this.key_index;

    }


}
