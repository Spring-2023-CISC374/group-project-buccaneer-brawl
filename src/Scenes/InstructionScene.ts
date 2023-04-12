import Phaser from "phaser";

export default class InstructionScene extends Phaser.Scene{
    constructor(){
        super({ key: 'InstructionScene' });
    }


    //Setting up instructions
    create(){
       console.log("Instructions added");
       const { width, height } = this.scale;
       const bg = this.add.image(width / 2, height / 2, 'background');
       bg.setScale(2);
       const titlescreen = this.add.sprite(400, 330, 'titlescreen');
       titlescreen.scaleX = 2.5;
       titlescreen.scaleY = 1.5
       //Adds instructions title
       const instructionsTitle = this.add.text(width / 4, height / 4, 'Instructions', {
        fontSize: '64px',
        fontFamily: 'Arial',
        color: '#ffffff',
        backgroundColor: '#000000',
      });
      //Includes information from the instructions
      const instructionsInfo = this.add.text(width / 2, height / 2, 'Ahoy, today in the game the pirates need your input.', {
        fontSize: '16px',
        fontFamily: 'Arial',
        color: '#ffffff',
        backgroundColor: '#000000',
      });
      instructionsInfo.setOrigin(0.5, -5);

      const instructionsInfoPt2 = this.add.text(width / 2, height / 2, 'Given two players, feed them string input whether a word or a sentence and it will command the player!', {
        fontSize: '16px',
        fontFamily: 'Arial',
        color: '#ffffff',
        backgroundColor: '#000000',
      });
      instructionsInfoPt2.setOrigin(0.5, -6);
      const twist = this.add.text(width / 2, height / 2, 'Be careful, only one winner will come out given the commands listed', {
        fontSize: '16px',
        fontFamily: 'Arial',
        color: '#ffffff',
        backgroundColor: '#000000',
      });
      twist.setOrigin(0.5, -7);

      const cmdList = this.add.text(width / 2, height / 2, 'walk forward, walk back, jump forward,  kick, punch, uppercut, crhook, roundhouse', {
        fontSize: '16px',
        fontFamily: 'Arial',
        color: '#ffffff',
        backgroundColor: '#000000',});
        cmdList.setOrigin(0.5, -8);

        const example = this.add.text(width / 2, height / 2, 'For example if you tell the player to walk forward the player will walk forward.', {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#ffffff',
            backgroundColor: '#000000',});
            example.setOrigin(0.5, -9);
            
      const backToStartButton = this.add.text(width / 4, height / 2, 'Return to start', {
        fontSize: '48px',
        fontFamily: 'Arial',
        color: '#ffffff',
        backgroundColor: '#000000',
        padding: {
          x: 16,
          y: 8,
        },
      });
      backToStartButton.setInteractive({ useHandCursor: true });
      backToStartButton.on("pointerdown", ()=>{
      this.scene.start("TitleScene");
    })
    }
}