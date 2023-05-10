import Phaser from 'phaser';
import available_moves from '../Types/available_moves';

export default class SPInputScene extends Phaser.Scene {
  private savedTextP1: string;
  private p1_responseText: string[];
  private moveMap: Map<string, string>;
  private levels: number;

  constructor() {
    super({ key: 'SPInputScene' });
    this.savedTextP1 = '';
    this.p1_responseText = ['random'];

    this.moveMap = available_moves.reduce((accumulator, curr) => {
      accumulator.set(curr, 'true');
      return accumulator;
    }, new Map<string, string>());

    this.levels = 0;
  }
  init(data: { levels: number, savedTextP1: string; }) {
    this.levels = data.levels;
    this.savedTextP1 = data.savedTextP1;
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

    const submitButton = this.add.text(300, 300, 'Submit', {
      fontSize: '48px',
      fontFamily: 'Arial',
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: { left: 10, right: 10, top: 5, bottom: 5 },
    });
    submitButton.setX(200)
    submitButton.setY(350)
    submitButton.setInteractive({ useHandCursor: true });
   

    submitButton.on('pointerdown', () => {
      this.saveInput();
    });

    instructionsButton.setOrigin(0.2, -0.5);
    instructionsButton.setX(530)
    instructionsButton.setY(0)
    instructionsButton.setInteractive({ useHandCursor: true });
    instructionsButton.on("pointerdown", ()=>{
      this.transitionToInstructions();
    })

  }

  saveInput() {
    const inputElement1 = document.getElementById(
      'myText1'
    ) as HTMLInputElement;

    this.savedTextP1 = inputElement1.value;

    inputElement1.remove();
    inputElement1.value = '';

    this.p1_responseText = this.formatRequest(this.savedTextP1);

    console.log(this.p1_responseText);


    this.scene.start("SPFightSceneLevel1", {
      p1_responseText: this.p1_responseText,
      levels: this.levels
    });
  }

  formatRequest(responseText: string): string[] {
    const map = this.moveMap;

    const splitText = responseText.split(',').map(function (item) {
      if (map.has(item.trim())) {
        return item.trim();
      }
      return 'random';
    });

    return splitText;
  }



  transitionToInstructions(){
    const inputElement1 = document.getElementById(
      'myText1'
    ) as HTMLInputElement;

    this.savedTextP1 = inputElement1.value;

    inputElement1.remove();

    inputElement1.value = '';

    this.scene.start('InstructionScene', {
       savedTextP1: this.savedTextP1,
     });
  }
}
