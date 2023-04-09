import Phaser from "phaser";
import Player from "./player";
export default class registerInput extends Phaser.Scene{
    private keys_to_choose: string[] = ["walk_forward", "walk_back", "jump_forward", "kick", "punch", "uppercut", "crhook", "roundhouse"];
    private key_index = 0;
    private key_timer = 0;
    constructor(){
        super("Input Registered")
        this.key_index = 0;
        this.key_timer = 0;
    }


    //Calls the players registers input first
    public validInput(input: string[], spaces: number, delta: number, player?: Player){
        //Check if the input is considered a non-fighting move for loop, reset to start!!!
        this.key_timer += delta;

        while(this.key_timer > 500) {
            this.key_timer = 0;
            console.log(input[this.key_index]);

            if(input[this.key_index].startsWith("walk") || input[this.key_index].startsWith("jump")){
                player?.movePlayer(260, input[this.key_index]);
            }
            else{
                player?.playerAttack(spaces, input[this.key_index]);
            }
            this.key_index++;
            if(this.key_index === input.length){
                this.key_index = 0;
            }

        }

    }
    

    

}
