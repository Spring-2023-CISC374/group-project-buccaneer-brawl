import Phaser from 'phaser';

export default class InputScene extends Phaser.Scene {
  constructor() {
    super('InputScene');
  }

  preload() {
    this.load.image('background', 'assets/background.png');
    this.load.image('logo', 'assets/logo.png');
    this.load.image('play-button', 'assets/play-button.png');
  }

  create() {
    const centerX = this.cameras.main.centerX;

    // Add background
    const background = this.add.image(0, 0, 'background').setOrigin(0);

    // Add logo
    const logo = this.add.image(centerX, 150, 'logo').setScale(0.5);

    // Add input field
    const inputField = this.add.dom(centerX, 350, 'input', {
      type: 'text',
      name: 'nameField',
      placeholder: 'Enter your name',
      fontSize: '32px',
      backgroundColor: '#ffffff',
      borderColor: '#000000',
      padding: '10px',
      width: '300px',
      borderRadius: '10px'
    });

    // Add play button
    const playButton = this.add.image(centerX, 500, 'play-button').setScale(0.5).setInteractive();
    playButton.on('pointerdown', () => {
      const name = inputField.getChildByName('nameField').value.trim();
      if (name !== '') {
        this.scene.start('GameScene', { name });
      }
    });

    // Add text
  }
}
