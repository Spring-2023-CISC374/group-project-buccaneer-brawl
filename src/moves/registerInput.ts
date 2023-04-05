import Phaser from "phaser";
import Player from "../Classes/player";
export default class registerInput extends Phaser.Scene{
    private keys_to_choose: string[] = ["walk", "walk_back", "jump_forward", "kick", "punch", "uppercut", "crhook", "roundhouse"];
    constructor(){
        super("Input Registered")
        const avaliable_keys: string[] = ["walk", "walk_back", "jump_forward", "kick", "punch", "uppercut", "crhook", "roundhouse"];
        
        const current_key = avaliable_keys[0];
    }


    //Calls the players registers input first
    public validInput(input: string[], spaces: number, player1?: Player, player2?: Player){
        //Check if the input is considered a non-fighting move for loop, reset to start!!!
        let index = 0;
        for(index = 0; index < input.length; index++){
            if(this.keys_to_choose[index] === "walk" || this.keys_to_choose[index] === "walk_back" || this.keys_to_choose[index] === "jump_forward"){
                player1?.movePlayer(spaces, input[index]);
                player2?.movePlayer(spaces, input[index]);
            }
            else{
                player1?.playerAttack(spaces, input[index]);
                player2?.playerAttack(spaces, input[index]);
            }
            if(index === input.length){
                index = 0;
            }
        }
        //Otherwise check if the input is a fighting input!!
        
        return
    }
    

}
