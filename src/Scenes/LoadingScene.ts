import Phaser from 'phaser';

export default class LoadingScene extends Phaser.Scene {
  constructor() {
    super({ key: 'LoadingScene' });
  }

  preload() {
    // Add loading text
    const { width, height } = this.scale;
    const loadingText = this.add.text(width / 2, height / 2, 'Buccaneer Brawl', {
      fontSize: '32px',
      fontFamily: 'Arial',
      color: '#ffffff',
    });
    loadingText.setOrigin(0.5);

    // Load assets here
<<<<<<< HEAD
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('dude', 'assets/dude.png', {
			frameWidth: 128, frameHeight: 128
		});
=======
  
    this.load.image('bomb', 'assets/bomb.png');
    this.load.image('dude', 'assets/dude.png');
>>>>>>> 5dc2066b4e5eb0dd4d5bff20a484437c0da008ba
    this.load.image('pirateship', 'assets/pirateship.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('sky.png','assets/sky.png');
    this.load.image('star', 'assets/star.png');
  }

  create() {
    // Start menu scene
    this.scene.start('InputScene');
  }
}
