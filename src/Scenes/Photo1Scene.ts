import Phaser from 'phaser';

export default class Photo1Scene extends Phaser.Scene {
    constructor() {
        super({ key: 'Photo1Scene' });
      }
      preload() {
        //Photo 1
        this.load.image('Photo 1', 'assets/InstructionPhotos/Photo 1.jpg');
      }
    }