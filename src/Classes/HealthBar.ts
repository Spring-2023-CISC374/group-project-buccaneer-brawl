import Phaser from "phaser";

enum HealthBarColor {
        Green = "green",
        Red = "red"
}

export default class HealthBar {
    //HealthBar: 3 images next to each other which will increase/decrease in size to mimic the way a health bar increases and decreases
 
    private scene: Phaser.Scene //scene used (fightscene)
    private x: number //x location of the health bar
    private y: number //y location of the health bar
    private color: HealthBarColor //color of health bar
    private width: number //width of health bar
    private leftCap?: Phaser.GameObjects.Image; //used to manipulate the health bar image
    private middle?: Phaser.GameObjects.Image; //used to manipulate the health bar image
    private rightCap?: Phaser.GameObjects.Image; //used to manipulate the health bar image

    constructor(scene: Phaser.Scene, x: number, y: number, width: number){
        this.scene = scene;
        this.color = HealthBarColor.Green;
        this.x = x;
        this.y = y;
        this.width = width;
    }
    
    //The following 3 methods are used to instantiate the health bar image
    withLeftCap(img: Phaser.GameObjects.Image){
        this.leftCap = img.setOrigin(0, 0.5);
        return this;
    }
    withMiddle(img: Phaser.GameObjects.Image){
        this.middle = img.setOrigin(0, 0.5);
        return this;
    }
    withRightCap(img: Phaser.GameObjects.Image){
        this.rightCap = img.setOrigin(0, 0.5);
        return this;
    }

    //function to support function chaining
    layout (){
        if (!this.leftCap || !this.middle || !this.rightCap){
            return;
        }
        this.middle.displayWidth = this.width
        this.layoutSegments()

        return this;
    }

    //Properly aligns the 3 health bar images to represent current HP
    layoutSegments(){
        if (!this.leftCap || !this.middle || !this.rightCap){
            return;
        }

        this.leftCap.x = this.x;
        this.leftCap.y = this.y;

        this.middle.x = this.leftCap.x + this.leftCap.width;
        this.middle.y = this.leftCap.y;

        this.rightCap.x = this.middle.x + this.middle.displayWidth;
        this.rightCap.y = this.middle.y;
    }

    //Animation to change health bar value to the percent set in fill. call this when you want to increase/decrease hp
    animate(fill: number, duration: number = 1000){
        if (!this.rightCap|| !this.leftCap || !this.middle){
            return;
        }
        //keeps it inbetween 0 and 1
        const percent = Phaser.Math.Clamp(fill, 0, 1);
        if (percent < 0.25 && this.color != HealthBarColor.Red){
            this.color = HealthBarColor.Red;
            this.leftCap.setTintFill(0xff0000);
            this.middle.setTintFill(0xff0000);
            this.rightCap.setTintFill(0xff0000);
        }

        else if (percent >= 0.26 && this.color != HealthBarColor.Green){
            this.color = HealthBarColor.Green;
            this.leftCap.clearTint();
            this.middle.clearTint();
            this.rightCap.clearTint();
        }
  
        this.scene.tweens.add({
            targets: this.middle,
            displayWidth: this.width * percent,
            duration,
            ease: Phaser.Math.Easing.Sine.Out,
            onUpdate: () => {
                this.layoutSegments()
            }
        })

    }
}