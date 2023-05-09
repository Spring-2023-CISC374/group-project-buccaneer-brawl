import Phaser from 'phaser';

export default class Photo1Scene extends Phaser.Scene {
    constructor() {
        super({ key: 'Photo1Scene' });
      }
      preload() {
        //Photo 1
        this.load.image('Photo 1', 'assets/InstructionPhotos/Photo 1.jpg');
      }
      create() {
      const { width, height } = this.scale;
      // Add Next Button
      const NextButton = this.add.text(width / 2, height / 2, 'Next', {
        fontSize: '48px',
        fontFamily: 'Arial',
        color: '#ffffff',
        backgroundColor: '#FFFFFF',
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