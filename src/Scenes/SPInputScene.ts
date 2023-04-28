import Phaser from 'phaser';
import available_moves from '../Types/available_moves';

export default class SPInputScene extends Phaser.Scene {
  private savedTextP1: string;
  private p1_responseText: string[];
  private p1_understandAmt: number;
  private moveMap: Map<string, string>;
  private currentLevel: number;

  constructor() {
    super({ key: 'SPInputScene' });
    this.savedTextP1 = '';
    this.p1_responseText = ['random'];
    this.p1_understandAmt = 0;

    this.moveMap = available_moves.reduce((accumulator, curr) => {
      accumulator.set(curr, 'true');
      return accumulator;
    }, new Map<string, string>());

    this.currentLevel = 1;
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

    this.p1_understandAmt = 0;
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

    this.checkPlayerUnderstanding();

    this.incrementLevel();

    this.scene.start(`SPFightSceneLevel${this.currentLevel}`, {
      p1_responseText: this.p1_responseText,
      p1_understandAmt: this.p1_understandAmt,
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

  checkPlayerUnderstanding() {
    this.p1_responseText.forEach((s: string) => {
      if (s !== 'random') {
        console.log('understood a command!');
        this.p1_understandAmt++;
      }
    });

    this.p1_understandAmt =
      (this.p1_understandAmt / this.p1_responseText.length) * 100;

    console.log('understandAmount: ', this.p1_understandAmt + '%');
  }
  incrementLevel() {
    this.currentLevel++;
  }
}
