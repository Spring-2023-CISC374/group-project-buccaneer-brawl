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


  constructor() {
    super({ key: 'InputScene' });
    this.savedTextP1 = '';
    this.savedTextP2 = '';
    this.p1_responseText = ['random'];
    this.p2_responseText = ['random'];

    this.p1_understandAmt = 0;
    this.p2_understandAmt = 0;
    
    this.moveMap = available_moves.reduce((accumulator, curr) => {
      accumulator.set(curr, 'true');
      return accumulator;
    }, new Map<string, string>());
  }

  create() {
    
    this.add.text(50, 60, 'Player 1', {
      fontSize: '24px',
      color: '#000',
    });

    const input = document.createElement('input');
    input.id = 'myText1';
    input.type = 'text';
    input.className = 'css-class-name';
    input.style.position = 'absolute';
    input.style.left = '50px';
    input.style.top = '90px';
    document.body.appendChild(input);

    this.add.text(350, 60, 'Player 2', {
      fontSize: '24px',
      color: '#000',
    });

    const inputP2 = document.createElement('input');
    inputP2.id = 'myText2';
    inputP2.type = 'text';
    inputP2.className = 'css-class-name';
    inputP2.style.position = 'absolute';
    inputP2.style.left = '350px';
    inputP2.style.top = '90px';
    document.body.appendChild(inputP2);
    
    const submitButton = this.add.text(200, 700, 'Submit', {
      fontSize: '32px',
      color: '#000',
      backgroundColor: '#fff',
      padding: { left: 10, right: 10, top: 5, bottom: 5 },
    });
 

    submitButton.setInteractive({ useHandCursor: true });

    submitButton.on('pointerdown', () => {
      this.saveInput();
    });

    this.p1_understandAmt = 0;
    this.p2_understandAmt = 0;
  }

  saveInput() {
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

      this.checkPlayerUnderstanding();

      this.scene.start('FightScene', {
        p1_responseText: this.p1_responseText,
        p2_responseText: this.p2_responseText,
        p1_understandAmt: this.p1_understandAmt,
        p2_understandAmt: this.p2_understandAmt
      });
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

    const select = document.createElement('select');
    const movements = ['wait', 'walk_forward', 'walk_back', 'jump', 'jump_forward', 'jump_back'];
    movements.forEach((movement) => {
      const option = document.createElement('option');
      option.value = movement;
      option.text = movement;
      select.appendChild(option);
    });
    const player1Input = document.getElementById('player1') as HTMLInputElement;
    const player2Input = document.getElementById('player2') as HTMLInputElement;
    
    select.addEventListener('change', () => {
      const selectedMovement = select.value;
      player1Input.value = `Player 1: ${selectedMovement}`;
      player2Input.value = `Player 2: ${selectedMovement}`;
    });
        

  }
}
