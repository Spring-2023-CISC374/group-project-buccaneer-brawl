import Phaser from "phaser";

export default class InstructionScene extends Phaser.Scene{
    constructor(){
        super({ key: 'InstructionScene' });
    }


    //Setting up instructions
    create(){
       console.log("Instructions added");
       const { width, height } = this.scale;
      
       const titlescreen = this.add.sprite(400, 330, 'titlescreen');
       console.log(titlescreen);
       titlescreen.scaleX = 2.5;
       titlescreen.scaleY = 1.5
       //Adds instructions title
       this.add.text(width / 4, height / 4, 'Instructions', {
        fontSize: '64px',
        fontFamily: 'Arial',
        color: '#ffffff',
        backgroundColor: '#000000',
      });
      //Includes information from the instructions
      this.add.text(width / 2, height / 2, 'Ahoy, the pirates need your input.', {
        fontSize: '20px',
        fontFamily: 'Arial',
        color: '#ffffff',
        backgroundColor: '#000000',
      }).setOrigin(0.5, 3);
      
      //More descriptions
            //this.add.text("whether a word or a sentence and it will command the player!")
            this.add.text(width / 2, height / 2, 'RedBeard and BluBeard are fighting again. Pick a side and help them win!', {
              fontSize: '20px',
              fontFamily: 'Arial',
              color: '#ffffff',
              backgroundColor: '#000000',
            }).setOrigin(0.5, 2);

      this.add.text(width / 2, height / 2, 'Type in what you want the pirate to do, seperated by commas.', {
        fontSize: '20px',
        fontFamily: 'Arial',
        color: '#ffffff',
        backgroundColor: '#000000',
      }).setOrigin(0.5, 1);

      
      /*
      this.add.text(width / 2, height / 2, 'Here are the commands listed below: ', {
        fontSize: '20px',
        fontFamily: 'Arial',
        color: '#ffffff',
        backgroundColor: '#000000',}).setOrigin(0.62, -1);
        
       this.add.text(width / 2, height / 2, ' walk forward, walk back, jump forward,  kick, punch, uppercut, crhook, roundhouse',{
        fontSize: '18px',
        fontFamily: 'Arial',
        color: '#ffffff',
        backgroundColor: '#000000',}).setOrigin(0.59, -2);
        */


       this.add.text(width / 2, height / 2, 'For example.', {
            fontSize: '20px',
            fontFamily: 'Arial',
            color: '#ffffff',
            backgroundColor: '#000000',}).setOrigin(3.0, -3);

      this.add.text(width/2, height/2, "walk_forward, roundhouse, uppercut", {
        fontSize: '20px',
        fontFamily: 'Arial',
        color: '#ffffff',
        backgroundColor: '#000000',}).setOrigin(0.5, -4);

      const backToStartButton = this.add.text(width / 4, height / 2, 'Start', {
        fontSize: '48px',
        fontFamily: 'Arial',
        color: '#ffffff',
        backgroundColor: '#000000',
        padding: {
          x: 16,
          y: 8,
        },
      }).setOrigin(0, -2);
      backToStartButton.setScale(1, 1)
      backToStartButton.setInteractive({ useHandCursor: true });
      backToStartButton.on("pointerdown", ()=>{
      this.scene.start("InputScene");
    })

    const demoButton = this.add.text(width / 4, height / 2, 'Demo', {
      fontSize: "48px",
      fontFamily: "Arial",
      color: "#ffffff",
      backgroundColor: "#000000",
      padding : {
        x: 16,
        y: 8
      }
    }).setOrigin(-0.5, -3.5);
    demoButton.setScale(1, 1)
    demoButton.setInteractive({useHandCursor: true});
    demoButton.on("pointerdown", ()=>{
      this.scene.start("DemoScene")
    })
    
    }
}