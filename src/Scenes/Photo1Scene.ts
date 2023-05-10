import Phaser from 'phaser';
export default class Photo1Scene extends Phaser.Scene {
    constructor() {
        super({ key: 'Photo1Scene' });
    }
        preload() {
        //Photo 1
        this.load.image('Photo1', 'assets/InstructionPhotos/Photo1.png');
      }
      create() {
        const photo = this.add.image(400, 400, "Photo1");
        const desiredWidth = 800; // in pixels
        const desiredHeight = 600; // in pixels
        photo.setScale(desiredWidth / photo.width, desiredHeight / photo.height);

        const { width, height, } = this.scale;
        // Add Next Button
        const NextButton = this.add.text(width / 2, height / 2, 'Next', {
          fontSize: '48px',
          fontFamily: 'Arial',
          color: '#ffffff',
          backgroundColor: '#000000',
          padding: {
            x: 16,
            y: 8,
          },
        });
        NextButton.setOrigin(-2,-2);
        NextButton.setInteractive({ useHandCursor: true });
        NextButton.on('pointerdown', () => {
          this.scene.start('Photo2Scene');
        });
      }
  }

