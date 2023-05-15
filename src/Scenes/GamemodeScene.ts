import Phaser from 'phaser';

export default class GamemodeScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GamemodeScene' });
  }

  create() {
    const { width, height } = this.scale;

    // Add background image
    const bg = this.add.image(width / 2, height / 2, 'background');
    bg.setScale(2);

    const titlescreen = this.add.sprite(400, 330, 'titlescreen');
    titlescreen.scaleX = 2.5;
    titlescreen.scaleY = 1.5;
    //music.setLoop(true);
    //titlescreen.setScale(2);

    // Add title text
    const title = this.add.text(width / 2, height / 4, 'Buccaneer Brawl', {
      fontSize: '64px',
      fontFamily: 'Arial',
      color: '#ffffff',
      backgroundColor: '#000000',
    });
    title.setOrigin(0.5);

    // Add start button
    const startButton = this.add.text(width / 2, height / 2 + 100, '2-Player', {
      fontSize: '48px',
      fontFamily: 'Arial',
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: {
        x: 16,
        y: 8,
      },
    });

    const SPButton = this.add.text(
      width / 2,
      height / 2,
      '1-Player',
      {
        fontSize: '48px',
        fontFamily: 'Arial',
        color: '#ffffff',
        backgroundColor: '#000000',
        padding: {
          x: 16,
          y: 8,
        },
      }
    );

    startButton.setOrigin(0.5);
    startButton.setInteractive({ useHandCursor: true });
    startButton.on('pointerdown', () => {
      this.scene.start('InstructionScene');
      
    });

    SPButton.setOrigin(0.5);
    SPButton.setInteractive({ useHandCursor: true });
    SPButton.on('pointerdown', () => {
      this.scene.start('SPInputScene');
    });
  }
}
