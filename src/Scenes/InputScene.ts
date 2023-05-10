import Phaser from 'phaser';
import available_moves from '../Types/available_moves';


export default class InputScene extends Phaser.Scene {
  private savedTextP1: string;
  private savedTextP2: string;
  private p1_responseText: string[];
  private p2_responseText: string[];
  private p1_understandAmt: number;
  private p2_understandAmt: number;
  private moveMap: Map<string, string>;
  private player1Ready: boolean;
  private player2Ready: boolean;

  constructor() {
    super({ key: 'InputScene' });
    this.savedTextP1 = '';
    this.savedTextP2 = '';
    this.p1_responseText = ['random'];
    this.p2_responseText = ['random'];

    this.p1_understandAmt = 0;
    this.p2_understandAmt = 0;
    this.player1Ready = false;
    this.player2Ready = false;

    this.moveMap = available_moves.reduce((accumulator, curr) => {
      accumulator.set(curr, 'true');
      return accumulator;
    }, new Map<string, string>());
  }

  create() {
    this.cameras.main.setBackgroundColor('#ffffff');
    const { width, height } = this.scale;
    document.getElementById(
      'myText1'
    ) as HTMLInputElement;
    document.getElementById(
      'myText2'
    ) as HTMLInputElement;

    this.add.text(10, 10, 'Enter your text:', {
      fontSize: '32px',
      color: '#000',
    });

    const movelist_text = available_moves.join('\n');

    this.add.text(240, 100, `Available Moves:\n${movelist_text}`, {
      fontSize: '10px',
      color: '#000',
    });

    this.add.text(50, 60, 'Player 1', {
      fontSize: '24px',
      color: '#000',
    });
    
    const instructionsButton = this.add.text(width / 2, (height / 5), 'Instructions', {
      fontSize: '48px',
      fontFamily: 'Arial',
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: { left: 10, right: 10, top: 5, bottom: 5 },
    });
    instructionsButton.setScale(0.5, 0.5);

    this.input.keyboard.clearCaptures();

    const input = document.createElement('textarea');
    input.id = 'myText1';
    input.className = 'css-class-name';
    input.style.position = 'absolute';
    input.style.left = '50px';
    input.style.top = '90px';
    input.style.width = '150px';
    input.style.height = '200px';
    document.body.appendChild(input);

    this.add.text(350, 60, 'Player 2', {
      fontSize: '24px',
      color: '#000',
    });

    const inputP2 = document.createElement('textarea');
    inputP2.id = 'myText2';
    inputP2.className = 'css-class-name';
    inputP2.style.position = 'absolute';
    inputP2.style.left = '350px';
    inputP2.style.top = '90px';
    inputP2.style.width = '150px';
    inputP2.style.height = '200px';
    document.body.appendChild(inputP2);

const submitButton = this.add.text(300, 300, 'Submit', {
  fontSize: '48px',
  fontFamily: 'Arial',
  color: '#ffffff',
  backgroundColor: '#000000',
  padding: { left: 10, right: 10, top: 5, bottom: 5 },
});
submitButton.setX(200)
submitButton.setY(350)

    const p1DoneButton = this.add.text(70, 300, 'Ready?', {
      fontSize: '32px',
      color: '#000',
      backgroundColor: '#fff',
      padding: { left: 10, right: 10, top: 5, bottom: 5 },
    });
    
    p1DoneButton.setInteractive({ useHandCursor: true });

    p1DoneButton.on('pointerdown', () => {
      this.saveInputP1();
    });

    const p2DoneButton = this.add.text(380, 300, 'Ready?', {
      fontSize: '32px',
      color: '#000',
      backgroundColor: '#fff',
      padding: { left: 10, right: 10, top: 5, bottom: 5 },
    });
    p2DoneButton.setInteractive({ useHandCursor: true });
    
    if(p1DoneButton.setInteractive({useHandCursor: true}) && p2DoneButton.setInteractive({ useHandCursor: true })){
      console.log("You can start the game!")
      submitButton.setInteractive({ useHandCursor: true });
    }
    p2DoneButton.on('pointerdown', () => {
      this.saveInputP2();
    });
    
   

    submitButton.on('pointerdown', () => {
      this.startGame();
    });

    this.p1_understandAmt = 0;
    this.p2_understandAmt = 0;

    instructionsButton.setOrigin(0.2, -0.5);
    instructionsButton.setX(530)
    instructionsButton.setY(0)
    instructionsButton.setInteractive({ useHandCursor: true });
    instructionsButton.on("pointerdown", ()=>{
      this.transitionToInstructions();
      this.scene.start("InstructionScene");
    })

  }

  transitionToInstructions(){
    const inputElement1 = document.getElementById(
      'myText1'
    ) as HTMLInputElement;
    const inputElement2 = document.getElementById(
      'myText2'
    ) as HTMLInputElement;

    this.savedTextP1 = inputElement1.value;
    this.savedTextP2 = inputElement2.value;

    //console.log('Saved text Player 1: ', this.savedTextP1);
    //console.log('Saved text Player 2: ', this.savedTextP2);
    

    inputElement1.remove();
    inputElement2.remove();

    inputElement1.value = '';
    inputElement2.value = '';

    this.p1_responseText = this.formatRequest(this.savedTextP1);
    this.p2_responseText = this.formatRequest(this.savedTextP2);

      console.log(this.p1_responseText);
      console.log(this.p2_responseText);

      //this.checkPlayerUnderstanding();

      this.scene.start('InstructionScene', {
        p1_responseText: this.p1_responseText,
        p2_responseText: this.p2_responseText,
        p1_understandAmt: this.p1_understandAmt,
        p2_understandAmt: this.p2_understandAmt
      });
  }

  

  saveInputP1() {
    const inputElement1 = document.getElementById(
      'myText1'
    ) as HTMLInputElement;

    this.savedTextP1 = inputElement1.value;
    //console.log('Saved text Player 1: ', this.savedTextP1);
    //console.log('Saved text Player 2: ', this.savedTextP2);  

    inputElement1.remove();

    inputElement1.value = '';

    this.p1_responseText = this.formatRequest(this.savedTextP1);

    console.log(this.p1_responseText);

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

    console.log(this.p2_responseText);

    this.player2Ready = true;

  }

  startGame() {
    if(this.player1Ready && this.player2Ready) {
      this.scene.start('FightScene', {
        p1_responseText: this.p1_responseText,
        p2_responseText: this.p2_responseText,
        p1_understandAmt: this.p1_understandAmt,
        p2_understandAmt: this.p2_understandAmt
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

  /*
  checkPlayerUnderstanding() {
    this.p1_responseText.forEach((s:string)=> {
      if(s !== "random") {
        console.log("understood a command!");
        this.p1_understandAmt++;
      }
    });

    this.p2_responseText.forEach((s:string)=> {
      if(s !== "random") {
        console.log("understood a command!");
        this.p2_understandAmt++;
      }
    });

    this.p1_understandAmt = (this.p1_understandAmt / this.p1_responseText.length) * 100;
    this.p2_understandAmt = (this.p2_understandAmt / this.p2_responseText.length) * 100;

    console.log("understandAmount: ", this.p1_understandAmt + "%");
    console.log("understandAmount: ", this.p2_understandAmt + "%");

  }
  */
}
