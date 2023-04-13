import Phaser from 'phaser';
import { generateResponse } from '../Classes/chatgptrequest';
import available_moves from '../Types/available_moves';

export default class InputScene extends Phaser.Scene {
  private savedTextP1: string;
  private savedTextP2: string;
  private p1_responseText: string[];
  private p2_responseText: string[];
  private moveMap: Map<string, string>;

  constructor() {
    super({ key: 'InputScene' });
    this.savedTextP1 = '';
    this.savedTextP2 = '';
    this.p1_responseText = ['random'];
    this.p2_responseText = ['random'];

    this.moveMap = available_moves.reduce((accumulator, curr) => {
      accumulator.set(curr, 'true');
      return accumulator;
    }, new Map<string, string>());
  }

  create() {
    this.cameras.main.setBackgroundColor('#ffffff');

    this.add.text(10, 10, 'Enter your text:', {
      fontSize: '32px',
      color: '#000',
    });

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

    const submitButton = this.add.text(200, 200, 'Submit', {
      fontSize: '32px',
      color: '#000',
      backgroundColor: '#fff',
      padding: { left: 10, right: 10, top: 5, bottom: 5 },
    });

    submitButton.setInteractive({ useHandCursor: true });

    submitButton.on('pointerdown', () => {
      this.saveInput();
    });
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

    console.log('Saved text Player 1: ', this.savedTextP1);
    console.log('Saved text Player 2: ', this.savedTextP2);

    this.p2_responseText = [inputElement2.value];

    inputElement1.remove();
    inputElement2.remove();

    inputElement1.value = '';
    inputElement2.value = '';
      
    Promise.all([
      generateResponse(this.savedTextP1),
      generateResponse(this.savedTextP2),
    ]).then(([generatedTextP1, generatedTextP2]) => {
      console.log(generatedTextP1);
      console.log(generatedTextP2);

      this.p1_responseText = this.formatRequest(generatedTextP1);
      this.p2_responseText = this.formatRequest(generatedTextP2);

      console.log(this.p1_responseText);
      console.log(this.p2_responseText);
      
      this.scene.start('FightScene', {
        p1_responseText: this.p1_responseText,
        p2_responseText: this.p2_responseText,
      });
    });
  }

  formatRequest(resposneText: string | undefined): string[] {
    if (resposneText == undefined) {
      return ['random'];
    }

    const beginSubstring = resposneText.indexOf('[');
    const endSubstring = resposneText.indexOf(']');

    if (beginSubstring == undefined || endSubstring == undefined) {
      return ['random'];
    }

    const subText = resposneText.substring(beginSubstring + 1, endSubstring);
    const map = this.moveMap;
    console.log('map', map);

    const splitText = subText.split(',').map(function (item) {
      if (map.has(item.trim())) {
        return item.trim();
      }
      return 'random';
    });
    console.log('splitText', splitText);
    return splitText;
  }
}