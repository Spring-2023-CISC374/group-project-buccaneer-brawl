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
    public validInput(input: string, spaces: number, player1?: Player, player2?: Player){
        //Check if the input is considered a non-fighting move
        if(input === "walk" || input === "walk_back" || input === "jump_forward"){
            player1?.movePlayer(spaces, input);
            player2?.movePlayer(spaces, input);
        }
        //Otherwise check if the input is a fighting input!!
        else if(input === "kick" || input === "punch" || input === "uppercut" || input === "crhook" || input === "roundhouse"){
            player1?.playerAttack(spaces, input);
            player2?.playerAttack(spaces, input);
        }
        return
    }
    

}