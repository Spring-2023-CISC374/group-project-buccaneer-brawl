import Phaser from 'phaser';

export default class ResultScene extends Phaser.Scene {
  constructor() {
    super({ key: 'ResultScene' });
  }


  create() {
    const { width, height } = this.scale;

    // Add background image
    const bg = this.add.image(width / 2, height / 2, 'background');
    bg.setScale(2);

   

    const titlescreen = this.add.sprite(400, 330, 'titlescreen');
    titlescreen.scaleX = 2.5;
    titlescreen.scaleY = 1.5;
    
    const music = this.sound.add('resultmusic');

    this.sound.stopAll();
    music.play();
    music.setLoop(true);
    //titlescreen.setScale(2);
    

     // Add title text
     const title = this.add.text(width / 2, height / 4, 'Results:', {
      fontSize: '64px',
      fontFamily: 'Arial',
      color: '#ffffff',
      backgroundColor: '#000000',
    });
    title.setOrigin(0.5);

    const pirate1Text = this.add.text(width / 1.2, height / 2.5, 'RedBeard: W, 100% understanding', {
        fontSize: '32px',
        fontFamily: 'Arial',
        color: '#FF0000',
        backgroundColor: '#000000',
      });
      pirate1Text.setOrigin(1, 0.7);

      const pirate2Text = this.add.text(width / 1.2, height / 2, 'BluBeard: L, 50% understanding', {
        fontSize: '32px',
        fontFamily: 'Arial',
        color: '#0000FF',
        backgroundColor: '#000000',
      });
      pirate2Text.setOrigin(1, 0.3);

    // Add start button
    const startButton = this.add.text(width / 2, height / 1.5, 'Brawl Again', {
      fontSize: '48px',
      fontFamily: 'Arial',
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: {
        x: 16,
        y: 8,
      },
    });
    startButton.setScale(0.5);
    startButton.setOrigin(0.5, 0.1);
    startButton.setInteractive({ useHandCursor: true });
    startButton.on('pointerdown', () => {
      this.scene.start('InputScene');
    });
  }
}

