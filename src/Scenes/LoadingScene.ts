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
    this.load.spritesheet('dude', 'assets/dude.png', {
			frameWidth: 128, frameHeight: 128
		});
    this.load.spritesheet('roll', 'assets/PirateRoll.png', {
			frameWidth: 128, frameHeight: 128
		});
    this.load.spritesheet('rest', 'assets/PirateTired.png', {
			frameWidth: 128, frameHeight: 128
		});
    this.load.spritesheet('dash', 'assets/PirateDash.png', {
			frameWidth: 128, frameHeight: 128
		});
    this.load.spritesheet('specials', 'assets/PirateAttacks2.png', {
			frameWidth: 128, frameHeight: 128
		});
    this.load.spritesheet('titlescreen', 'assets/piratetitlescreen.png', {
			frameWidth: 400, frameHeight: 400
		});
    
    //images
    this.load.image('pirateship', 'assets/pirateship.png');
    this.load.image('winpic', 'assets/WinPicture.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('sky.png','assets/sky.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('left-cap-green', 'assets/barHorizontal_green_left.png');
    this.load.image('middle-green', 'assets/barHorizontal_green_mid.png');
    this.load.image('right-cap-green', 'assets/barHorizontal_green_right.png');
    this.load.image('left-cap-shadow', 'assets/barHorizontal_shadow_left.png');
    this.load.image('middle-shadow', 'assets/barHorizontal_shadow_mid.png');
    this.load.image('right-cap-shadow', 'assets/barHorizontal_shadow_right.png');
    this.load.image('cannonball', 'assets/bomb.png');
    //music
    this.load.audio('piratemusic', 'assets/audio/Drunken Sailor_ (String Orchestra).mp3');
    this.load.audio('battlemusic', 'assets/audio/battle-ship-111902.mp3');
    this.load.audio('resultmusic', 'assets/audio/Cooper Canell - Drunken Sailor no intro.mp3');
    this.load.audio('piratelyrics', 'assets/audio/drunken_sailor_lyrics.mp3');
  }

  create() {
    // Start menu scene
    this.scene.start('TitleScene');
  }
}
