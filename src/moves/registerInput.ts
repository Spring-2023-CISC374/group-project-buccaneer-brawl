import Phaser, {Physics} from "phaser";

export default class registerInput extends Phaser.Scene{
     
    constructor(){
        super("Input Registered")
        const keys: string[] = ["walk_forward", "walk_back", "jump_forward", "kick", "punch", "uppercut", "crhook", "roundhouse"];
    }

    private registerInput(input: string[]){
        return
    }

}