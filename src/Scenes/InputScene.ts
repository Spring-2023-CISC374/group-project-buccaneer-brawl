import Phaser from 'phaser';
import available_moves from '../Types/available_moves';


export default class InputScene extends Phaser.Scene {
  private savedTextP1: string;
  private savedTextP2: string;
  private p1_responseText: string[];
  private p2_responseText: string[];
  private moveMap: Map<string, string>;
  private player1Ready: boolean;
  private player2Ready: boolean;

  constructor() {
    super({ key: 'InputScene' });
    this.savedTextP1 = '';
    this.savedTextP2 = '';
    this.p1_responseText = ['random'];
    this.p2_responseText = ['random'];
    this.player1Ready = false;
    this.player2Ready = false;

    this.moveMap = available_moves.reduce((accumulator, curr) => {
      accumulator.set(curr, 'true');
      return accumulator;
    }, new Map<string, string>());
  }

  init(data: {
    savedTextP1: string;
    savedTextP2: string;
  }) {
    this.savedTextP1 = data.savedTextP1;
    this.savedTextP2 = data.savedTextP2;
  }

  create() {
    //this.cameras.main.setBackgroundColor('#ffffff');
    const { width, height } = this.scale;
    const titlescreen = this.add.sprite(400, 330, 'titlescreen');
    
    titlescreen.scaleX = 3.5;
    titlescreen.scaleY = 1.5;
    document.getElementById(
      'myText1'
    ) as HTMLInputElement;
    document.getElementById(
      'myText2'
    ) as HTMLInputElement;

    this.add.text(10, 10, 'Enter your PirateScript:', {
      fontSize: '32px',
      color: '#ffffff',
      backgroundColor: '#000000',
    });

    const movelist_text = available_moves.join('\n');

    this.add.text(240, 100, `Available Moves:\n${movelist_text}`, {
      fontSize: '10px',
      color: '#ffffff',
      backgroundColor: '#000000',
    });

    this.add.text(50, 60, 'Player 1', {
      fontSize: '24px',
      color: '#ffffff',
      backgroundColor: '#000000',
    });
    
    const instructionsButton = this.add.text(width / 2, (height / 5), 'Instructions', {
      fontSize: '48px',
      fontFamily: 'Arial',
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: { left: 10, right: 10, top: 5, bottom: 5 },
    });
    instructionsButton.setScale(0.5, 0.5);

    const backButton = this.add.text((width / 2), (height / 5), 'Back', {
      fontSize: '48px',
      fontFamily: 'Arial',
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: { left: 10, right: 10, top: 5, bottom: 5 },
    });
    backButton.setScale(0.5, 0.5);

    this.input.keyboard.clearCaptures();

    const input = document.createElement('textarea');
    input.id = 'myText1';
    input.className = 'css-class-name';
    input.style.position = 'absolute';
    input.style.left = '50px';
    input.style.top = '90px';
    input.style.width = '150px';
    input.style.height = '200px';
    input.style.backgroundColor = "black";
    input.style.color = "white";
    document.body.appendChild(input);
    if (this.savedTextP1 != undefined){
      input.innerText = this.savedTextP1;
    }
    this.add.text(350, 60, 'Player 2', {
      fontSize: '24px',
      color: '#ffffff',
      backgroundColor: '#000000',
    });

    const inputP2 = document.createElement('textarea');
    inputP2.id = 'myText2';
    inputP2.className = 'css-class-name';
    inputP2.style.position = 'absolute';
    inputP2.style.left = '350px';
    inputP2.style.top = '90px';
    inputP2.style.width = '150px';
    inputP2.style.height = '200px';
    inputP2.style.backgroundColor = "black";
    inputP2.style.color = "white";
    document.body.appendChild(inputP2);
    if (this.savedTextP2 != undefined){
      inputP2.innerText = this.savedTextP2;
    }

const submitButton = this.add.text(300, 300, 'Submit', {
  fontSize: '48px',
  fontFamily: 'Arial',
  color: '#ffffff',
  backgroundColor: '#000000',
  padding: { left: 10, right: 10, top: 5, bottom: 5 },
});
submitButton.setVisible(false);
submitButton.setX(200)
submitButton.setY(350)

    const p1DoneButton = this.add.text(70, 300, 'Ready?', {
      fontSize: '32px',
      color: 'white',
      backgroundColor: '#00000',
      padding: { left: 10, right: 10, top: 5, bottom: 5 },
    });
    
    p1DoneButton.setInteractive({ useHandCursor: true });

    p1DoneButton.on('pointerdown', () => {
      const inputElement1 = document.getElementById(
        'myText1'
        ) as HTMLInputElement;

        const submitted_array = this.formatRequest(inputElement1.value);

        //there is an invalid command
        if (submitted_array.find(element => element === 'random')){
          uniqueErrorMessage.setVisible(false);
          moveAtkErrorMessage.setVisible(false);
          invalidErrorMessage.setVisible(true);
        }
        //you dont have one attack and one movement command
        else if (!submitted_array.some(this.checkForAttacks) || !submitted_array.some(this.checkForMoves)){
          console.log("moves", submitted_array.some(this.checkForMoves))
          console.log("attacks", submitted_array.some(this.checkForAttacks))

          uniqueErrorMessage.setVisible(false);
          invalidErrorMessage.setVisible(false);
          moveAtkErrorMessage.setVisible(true);

        }
        //you don't have at least 3 unique moves 
        else if(Array.from(new Set(submitted_array)).length < 3){
          invalidErrorMessage.setVisible(false);
          moveAtkErrorMessage.setVisible(false);
          uniqueErrorMessage.setVisible(true);
        }

        else{
          invalidErrorMessage.setVisible(false);
          uniqueErrorMessage.setVisible(false);
          moveAtkErrorMessage.setVisible(false);
          this.saveInputP1();
          if(this.player1Ready && this.player2Ready){
            submitButton.setVisible(true);
            submitButton.setInteractive({useHandCursor: true});
          }
        }
    });

    const p2DoneButton = this.add.text(380, 300, 'Ready?', {
      fontSize: '32px',
      color: '#ffffff',
      backgroundColor: '#00000',
      padding: { left: 10, right: 10, top: 5, bottom: 5 },
    });
    p2DoneButton.setInteractive({ useHandCursor: true });
    
    if(p1DoneButton.setInteractive({useHandCursor: true}) && p2DoneButton.setInteractive({ useHandCursor: true })){
      submitButton.setInteractive({ useHandCursor: true });
    }
    p2DoneButton.on('pointerdown', () => {
      const inputElement2 = document.getElementById(
      'myText2'
      ) as HTMLInputElement;

      const submitted_array = this.formatRequest(inputElement2.value);

      //there is an invalid command
      if (submitted_array.find(element => element === 'random')){
        uniqueErrorMessage.setVisible(false);
        moveAtkErrorMessage.setVisible(false);
        invalidErrorMessage.setVisible(true);
      }
      //you dont have one move and one attack
      else if (!submitted_array.some(this.checkForAttacks) || !submitted_array.some(this.checkForMoves)){
        console.log("moves", submitted_array.some(this.checkForMoves))
        console.log("attacks", submitted_array.some(this.checkForAttacks))

        uniqueErrorMessage.setVisible(false);
        invalidErrorMessage.setVisible(false);
        moveAtkErrorMessage.setVisible(true);

      }
      //you don't have at least 3 unique moves 
      else if(Array.from(new Set(submitted_array)).length < 3){
        invalidErrorMessage.setVisible(false);
        moveAtkErrorMessage.setVisible(false);
        uniqueErrorMessage.setVisible(true);
      }
      else{
        invalidErrorMessage.setVisible(false);
        uniqueErrorMessage.setVisible(false);
        moveAtkErrorMessage.setVisible(false);

        this.saveInputP2();
        if(this.player1Ready && this.player2Ready){
        submitButton.setVisible(true);
        submitButton.setInteractive({useHandCursor: true});
        }
      }
    });
    //Button finally appears goshdanit
    console.log(this.player1Ready && this.player2Ready)
    
    const invalidErrorMessage = this.add.text(10, 500, 'Failed to save code. \n Make sure you have spelled all the commands correctly\nand that your list of commands is seperated by commas', {
      fontSize: '20px',
      color: '#ff0000',
      backgroundColor: '#00000',
    });
    const moveAtkErrorMessage = this.add.text(10, 500, 'Failed to save code. \nYou need to have at least 1 move command (walk_forward, jump, etc)\n and one attack command (punch, roundhosue, etc.)', {
      fontSize: '20px',
      color: '#ff0000',
      backgroundColor: '#00000',
    });
    const uniqueErrorMessage = this.add.text(10, 500, 'Failed to save code. \nYou need to have at least 3 unique commands', {
      fontSize: '20px',
      color: '#ff0000',
      backgroundColor: '#00000',
    });

    invalidErrorMessage.setVisible(false);
    uniqueErrorMessage.setVisible(false);
    moveAtkErrorMessage.setVisible(false);

    submitButton.on('pointerdown', () => {
      console.log("submit button clicked");
      this.startGame();
    });

    instructionsButton.setOrigin(0.2, -0.5);
    instructionsButton.setX(530)
    instructionsButton.setY(0)
    instructionsButton.setInteractive({ useHandCursor: true });
    instructionsButton.on("pointerdown", ()=>{
      this.transitionToInstructions();
    })

    backButton.setOrigin(0.2, -0.5);
    backButton.setX(680)
    backButton.setY(0)
    backButton.setInteractive({ useHandCursor: true });
    backButton.on("pointerdown", ()=>{
      const inputElement1 = document.getElementById(
        'myText1'
      ) as HTMLInputElement;
      const inputElement2 = document.getElementById(
        'myText2'
      ) as HTMLInputElement;

      inputElement1.remove();
      inputElement2.remove();
      
      this.scene.start('GamemodeScene');    
    })

  }
  checkForMoves(command: string){
    const valid_moves = ["walk_forward", "walk_back", "jump_forward", "jump_back", "jump", "roll_forward", "roll_back"] 
    return valid_moves.indexOf(command) != -1;
  }
  checkForAttacks(command: string){
    const valid_moves = ["kick", "punch", "hook", "uppercut", "crhook", "roundhouse", "dashkick", "rising_uppercut", "fire_cannon"] 
    return valid_moves.indexOf(command) != -1;
  }
  transitionToInstructions(){
    const inputElement1 = document.getElementById(
      'myText1'
    ) as HTMLInputElement;
    const inputElement2 = document.getElementById(
      'myText2'
    ) as HTMLInputElement;

    //incase one of the players submitted
    if (inputElement1 != null){
      this.savedTextP1 = inputElement1.value;
      inputElement1.remove();
      inputElement1.value = '';
    }
    if (inputElement2 != null){
      this.savedTextP2 = inputElement2.value;
      inputElement2.remove();
      inputElement2.value = '';
    }
  
    this.scene.start('InstructionScene', {
       savedTextP1: this.savedTextP1,
       savedTextP2: this.savedTextP2,
     });
  }

  

  saveInputP1() {
    const inputElement1 = document.getElementById(
      'myText1'
    ) as HTMLInputElement;

    this.savedTextP1 = inputElement1.value;

    inputElement1.remove();

    inputElement1.value = '';
  
    this.p1_responseText = this.formatRequest(this.savedTextP1);
    
    this.player1Ready = true;

  }

  saveInputP2() {
    const inputElement2 = document.getElementById(
      'myText2'
    ) as HTMLInputElement;

    this.savedTextP2 = inputElement2.value;

    inputElement2.remove();

    inputElement2.value = '';

    this.p2_responseText = this.formatRequest(this.savedTextP2);

    this.player2Ready = true;

  }

  startGame() {
    if(this.player1Ready && this.player2Ready) {
      this.player2Ready = false;
      this.player1Ready = false;
      this.scene.start('FightScene', {
        savedTextP1: this.savedTextP1,
        savedTextP2: this.savedTextP2,
        p1_responseText: this.p1_responseText,
        p2_responseText: this.p2_responseText,
      });
    }
  }

  formatRequest(responseText: string): string[] {
    
    const map = this.moveMap;
    //console.log('map', map);

    const splitText = responseText.split(',').map(function (item) {
      if (map.has(item.trim())) {
        return item.trim();
      }

      return 'random';
    });
   // console.log('splitText', splitText);
    return splitText;
  }
}
