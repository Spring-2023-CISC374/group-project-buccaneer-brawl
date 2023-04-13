import Phaser from 'phaser';

export default class ResultScene extends Phaser.Scene {
  private p1_understandAmt: number;
  private p2_understandAmt: number;
  private who_won: string;

  constructor() {
    super({ key: 'ResultScene' });

    this.p1_understandAmt = 0;
    this.p2_understandAmt = 0;
    this.who_won = "RedBeard";
  }

  init(data: { p1_understandAmtt: number, p2_understandAmt: number, who_won: string }) {
    this.p1_understandAmt = data.p1_understandAmtt;
	  this.p2_understandAmt = data.p2_understandAmt;
    this.who_won = data.who_won
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

    const pirate1Text = this.add.text(width / 1.2, height / 2.5, `RedBeard: ${this.who_won==="RedBeard"? "W":"L"} ${this.p1_understandAmt}% understanding`, {
        fontSize: '32px',
        fontFamily: 'Arial',
        color: '#FF0000',
        backgroundColor: '#000000',
      });
      pirate1Text.setOrigin(1, 0.7);

      const pirate2Text = this.add.text(width / 1.2, height / 2, `BluBeard: ${this.who_won==="BluBeard"? "W":"L"} ${this.p2_understandAmt}% understanding`, {
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

