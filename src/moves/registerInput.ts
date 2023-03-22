import Phaser from "phaser";
import Player from "../Classes/player";
export default class registerInput extends Phaser.Scene{

    constructor(){
        super("Input Registered")
        const avaliable_keys: string[] = ["walk", "walk_back", "jump_forward", "kick", "punch", "uppercut", "crhook", "roundhouse"];
        const p1Keys: string[] = ["walk", "jump_forward", "punch", "crhook"]
        const p2Keys: string[] = ["walk_back","kick","uppercut","roundhouse"]
        const current_key = avaliable_keys[0];
    }


    //Calls the players registers input first
    public registerCurrentInput(input: string, spaces:number, player1: Player, player2: Player){

        console.log("Punch called");
        
        player1?.playerAttack(spaces, input)
        player2?.playerAttack(spaces, input)
        return
    }

}