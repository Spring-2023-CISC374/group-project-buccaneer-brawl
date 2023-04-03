import Phaser from 'phaser';

export default class InputScene extends Phaser.Scene {
  private savedText: string;

  constructor() {
    super('input-scene');
    this.savedText = '';
  }

  create() {
    this.cameras.main.setBackgroundColor('#ffffff');

    this.add.text(10, 10, 'Enter your text:', {
      fontSize: '32px',
      color: '#000',
    });

    const inputForm = document.getElementById('inputForm') as HTMLFormElement;
    inputForm.style.display = 'block';

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
      'nameField'
    ) as HTMLInputElement;
    this.savedText = inputElement.value;
    console.log('Saved text: ', this.savedText);

    inputElement.value = '';

    const inputForm = document.getElementById('inputForm') as HTMLFormElement;
    inputForm.style.display = 'none';

    this.scene.start('hello-world-scene');
  }
}
