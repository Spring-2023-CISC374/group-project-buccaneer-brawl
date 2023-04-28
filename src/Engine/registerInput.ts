import Phaser from "phaser";
import Player from "../Classes/player";
import available_moves from "../Types/available_moves";

export default class registerInput extends Phaser.Scene{
    private key_index = 0;
    private key_timer = 0;
    constructor(){
        super("Input Registered")
        this.key_index = 0;
        this.key_timer = 0;
    }


    //Calls the players registers input first
    public validInput(input: string[], delta: number, player?: Player, opponent?: Player){
        //Check if the input is considered a non-fighting move for loop, reset to start!!!
        this.key_timer += delta;
        console.log("playerName", player?.invulnerable);

        let nextMoveTime = 500;
        if(player?.action === "attack/punch" || input[this.key_index]=== "attack/kick" || input[this.key_index] === "attack/hook") nextMoveTime = 250;

        while(this.key_timer > nextMoveTime) {

            if(player) {
                player.action = "nothing";
                player.invulnerable = false;
            }
            
            this.key_timer = 0;
            if(input[this.key_index] === "random") {
                const randomIndex = Math.floor(Math.random() * (available_moves.length));
                input[this.key_index] = available_moves[randomIndex];
            }

            if(input[this.key_index].startsWith("walk") || input[this.key_index].startsWith("jump") || 
            input[this.key_index].startsWith("roll") || input[this.key_index].startsWith("dodge")){
                player?.movePlayer(260, input[this.key_index], opponent);
            }
            else{
                console.log("going to attack ", input[this.key_index]);
                player?.playerAttack(input[this.key_index]);
            }
            this.key_index++;
            if(this.key_index === input.length){
                this.key_index = 0;
            }

        }

    }
    

}
