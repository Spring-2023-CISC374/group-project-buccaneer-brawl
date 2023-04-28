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
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('dude', 'assets/dude.png', {
			frameWidth: 128, frameHeight: 128
		});
    this.load.spritesheet('roll', 'assets/PirateRoll.png', {
			frameWidth: 128, frameHeight: 128
		});
    this.load.spritesheet('titlescreen', 'assets/piratetitlescreen.png', {
			frameWidth: 400, frameHeight: 400
		});
    this.load.image('pirateship', 'assets/pirateship.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('sky.png','assets/sky.png');
    this.load.image('star', 'assets/star.png');

    this.load.audio('piratemusic', 'assets/audio/Drunken Sailor_ (String Orchestra).mp3');
    this.load.audio('battlemusic', 'assets/audio/battle-ship-111902.mp3');
    this.load.audio('resultmusic', 'assets/audio/Cooper Canell - Drunken Sailor no intro.mp3');
  }

  create() {
    // Start menu scene
    this.scene.start('TitleScene');
  }
}
