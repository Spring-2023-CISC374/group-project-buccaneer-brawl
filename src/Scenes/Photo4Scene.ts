import Phaser from 'phaser';
export default class Photo4Scene extends Phaser.Scene {
    constructor() {
        super({ key: 'Photo4Scene' });
    }
        preload() {
        //Photo 1
        this.load.image('Photo4', 'assets/InstructionPhotos/Photo4.png');
      }
      create() {
        this.add.image(400, 300, 'Photo4');
        const { width, height } = this.scale;
        // Add Next Button
        const NextButton = this.add.text(width / 2, height / 2, 'Next', {
          fontSize: '30px',
          fontFamily: 'Arial',
          color: '#ffffff',
          backgroundColor: '#000000',
          padding: {
            x: 16,
            y: 8,
          },
        });
        NextButton.setOrigin(-3,-4);
        NextButton.setInteractive({ useHandCursor: true });
        NextButton.on('pointerdown', () => {
          this.scene.start('InputScene');
        });
      }
  }