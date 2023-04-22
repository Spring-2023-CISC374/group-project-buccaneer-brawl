import Phaser from "phaser";
import available_moves from '../Types/available_moves';
export default class DemoScene extends Phaser.Scene{
    constructor(){
        super({key: 'DemoScene'});
    }

    

    create(){
        console.log("Now on to demostrations within each move");
        const { width, height } = this.scale;
        const bg = this.add.image(width / 2, height / 2, 'background');
        bg.setScale(2);
        const titlescreen = this.add.sprite(400, 330, 'titlescreen');
        titlescreen.scaleX = 2.5;
        titlescreen.scaleY = 1.5;
        this.add.text(width / 4, height / 4, 'Examples', {
            fontSize: '64px',
            fontFamily: 'Arial',
            color: '#ffffff',
            backgroundColor: '#000000',
          });
        const waitButton = this.add.text(width / 2, height / 2, available_moves[0], {
            fontSize: '36px',
            fontFamily: 'Arial',
            color: '#ffffff',
            backgroundColor: '#000000',
            padding: {
            x: 16,
            y: 8,
        },
        })
        waitButton.setScale(2, 2)
    }
}