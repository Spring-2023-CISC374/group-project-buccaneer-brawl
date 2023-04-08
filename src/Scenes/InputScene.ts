import Phaser from 'phaser';


export default class InputScene extends Phaser.Scene {
  private savedText: string;

  constructor() {
    super({key: 'InputScene'});
    this.savedText = '';
  }

  create() {
    this.cameras.main.setBackgroundColor('#ffffff');

    this.add.text(10, 10, 'Enter your text:', {
      fontSize: '32px',
      color: '#000',
    });

    const input = document.createElement("input");
    input.id = "myText"
    input.type = "text";
    input.className = "css-class-name"; // set the CSS class
    document.body.appendChild(input);


   // const inputForm = document.getElementById('inputForm') as HTMLFormElement;
    //inputForm.style.display = 'block';



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
    const inputElement = document.getElementById(
      'myText'
    ) as HTMLInputElement;
    this.savedText = inputElement.value;
    console.log('Saved text: ', this.savedText);

    inputElement.value = '';

    const inputForm = document.getElementById('inputForm') as HTMLFormElement;
   // inputForm.style.display = 'none';

    this.scene.start('FightScene');
  }
}
