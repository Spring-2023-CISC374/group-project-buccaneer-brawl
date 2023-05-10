import Phaser from 'phaser';
export default class Photo3Scene extends Phaser.Scene {
    constructor() {
        super({ key: 'Photo3Scene' });
    }
        preload() {
        //Photo 1
        this.load.image('Photo3', 'assets/InstructionPhotos/Photo3.png');
      }
      create() {
        this.add.image(400, 300, 'Photo3');
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
        NextButton.setOrigin(-3);
        NextButton.setInteractive({ useHandCursor: true });
        NextButton.on('pointerdown', () => {
          this.scene.start('Photo4Scene');
        });
      }
  }