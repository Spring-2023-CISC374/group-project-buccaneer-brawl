import Phaser from 'phaser';

export default class WinScene extends Phaser.Scene {
  constructor() {
    super({ key: 'WinScene' });
  }

  create() {
    const { width, height } = this.scale;

    // Add background image
    const bg = this.add.image(width / 2, height / 2, 'winpic');
    bg.setScale(1);

    this.sound.stopAll();
    const music = this.sound.add('piratelyrics');
    music.play();
    //music.setLoop(true);
    //titlescreen.setScale(2);

    // Add start button
    const startButton = this.add.text(width / 2, height / 2 + 200, 'Back to Title', {
      fontSize: '48px',
      fontFamily: 'Arial',
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: {
        x: 16,
        y: 8,
      },
    });

    startButton.setOrigin(0.5);
    startButton.setInteractive({ useHandCursor: true });
    startButton.on('pointerdown', () => {
      this.scene.start('TitleScene');    
    });

  }
}
