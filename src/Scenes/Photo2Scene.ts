import Phaser from 'phaser';
export default class Photo2Scene extends Phaser.Scene {
    constructor() {
        super({ key: 'Photo2Scene' });
    }
        preload() {
        //Photo 1
        this.load.image('Photo2', 'assets/InstructionPhotos/Photo2.png');
      }
      create() {
        this.add.image(0, 0, 'Photo2');
        const { width, height } = this.scale;
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
        NextButton.setOrigin(0.5);
        NextButton.setInteractive({ useHandCursor: true });
        NextButton.on('pointerdown', () => {
          this.scene.start('InputScene');
        });
      }
  }