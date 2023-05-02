import Phaser from "phaser";
import Player from "../Classes/player";
//import FightScene from "./FightScene";
import available_moves from '../Types/available_moves';
export default class DemoScene extends Phaser.Scene{
    constructor(){
        super({key: 'DemoScene'});
    }
    private player2?: Player;
    

    create(){
        const titlescreen = this.add.sprite(400, 330, 'titlescreen');
        titlescreen.scaleX = 2.5;
        titlescreen.scaleY = 1.5;
        console.log(titlescreen)
        console.log("Now on to demostrations within each move");
        const { width, height } = this.scale;
        // const bg = this.add.image(width / 2, height / 2, 'background');
        // bg.setScale(2);
        this.add.text(width / 4, height / 4, 'Examples', {
            fontSize: '64px',
            fontFamily: 'Arial',
            color: '#ffffff',
            backgroundColor: '#000000',
          }).setOrigin();


          this.player2 = new Player(
            this.physics.add
              .sprite(700, 350, "dude")
              .setSize(54, 108)
              .setOffset(70, 12)
              .setScale(2),
            0x0096ff
          ); 
          
        const waitButton = this.add.text(width / 4, height / 4, available_moves[0].toUpperCase(), {
            fontSize: '21px',
            fontFamily: 'Arial',
            color: '#ffffff',
            backgroundColor: '#000000',
            padding: {
            x: 16,
            y: 8,
        },
        })
        waitButton.setScale(1, 1).setOrigin(1.9, -1)
        waitButton.setInteractive({ useHandCursor: true });
        waitButton.on("pointerdown", ()=>{
          
          this.player2?.sprite.anims.play("turn");
          this.animationHandler();
        })

        const walk_forward_button = this.add.text(width / 4, height / 4, available_moves[1].toUpperCase(), {
          fontSize: '21px',
          fontFamily: 'Arial',
          color: '#ffffff',
          backgroundColor: '#000000',
          padding: {
          x: 16,
          y: 8,
          }
        })
        walk_forward_button.setScale(1, 1).setX(12).setY(235)
        walk_forward_button.setInteractive({useHandCursor: true});
        walk_forward_button.on("pointerdown", ()=>{
          this.player2?.sprite.anims.play("left");
          this.animationHandler();
        })
        const walk_back_button = this.add.text(width / 4, height / 4, available_moves[2].toUpperCase(), {
          fontSize: '21px',
          fontFamily: 'Arial',
          color: '#ffffff',
          backgroundColor: '#000000',
          padding: {
          x: 16,
          y: 8,
          }
        })
        walk_back_button.setScale(1, 1).setX(12).setY(285)
        walk_back_button.setInteractive({useHandCursor: true})
        walk_back_button.on("pointerdown", ()=>{
          this.player2?.sprite.anims.play("right")
          this.animationHandler();
        })
        //Need to figure out jumping issue, might want to ask Chris regarding the jumping move
        // const jump_button = this.add.text(width /4, height /2, available_moves[3].toUpperCase(), {
        //   fontSize: '21px',
        //   fontFamily: 'Arial',
        //   color: '#ffffff',
        //   backgroundColor: '#000000',
        //   padding: {
        //   x: 16,
        //   y: 8,
        //   }
        // })
        // jump_button.setScale(1, 1).setX(12).setY(335)
        // jump_button.setInteractive({useHandCursor: true})
        // jump_button.on("pointerdown", ()=>{
        //   this.player2?.sprite.anims.play("jump")
        //   this.animationHandler();
        // })

        const kick_button = this.add.text(width / 4, height / 4, available_moves[6].toUpperCase(), {
          fontSize: '21px',
          fontFamily: 'Arial',
          color: '#ffffff',
          backgroundColor: '#000000',
          padding: {
          x: 16,
          y: 8,
          }
        })
        kick_button.setScale(1, 1).setX(12).setY(375)
        kick_button.setInteractive({useHandCursor: true})
        kick_button.on("pointerdown", ()=>{
            this.player2?.sprite.anims.play("kick")
            this.animationHandler();
          })
        const punch_button = this.add.text(width / 4, height / 4, available_moves[7].toUpperCase(), {
            fontSize: '21px',
            fontFamily: 'Arial',
            color: '#ffffff',
            backgroundColor: '#000000',
            padding: {
            x: 16,
            y: 8,
            }
          })  


        const backToStartButton = this.add.text(width / 4, height / 2, 'Return to Input', {
            fontSize: '48px',
            fontFamily: 'Arial',
            color: '#ffffff',
            backgroundColor: '#000000',
            padding: {
              x: 16,
              y: 8,
            },
          }).setOrigin(0, -2);
          backToStartButton.setScale(1, 1)
          backToStartButton.setInteractive({ useHandCursor: true });
          backToStartButton.on("pointerdown", ()=>{
          this.scene.start("InputScene");
        })
        this.animationHandler();
    
    }

    private animationHandler() {
      this.anims.create({
        key: "left",
        frames: this.anims.generateFrameNumbers("dude", {
          start: 3,
          end: 5,
        }),
        frameRate: 20,
        repeat: -1, //-1 for infinite repeats
      });
  
      this.anims.create({
        key: "turn",
        frames: this.anims.generateFrameNumbers("dude", {
          start: 0,
          end: 3,
        }),
        frameRate: 10,
        repeat: -1, //-1 f
      });
  
      this.anims.create({
        key: "right",
        frames: this.anims.generateFrameNumbers("dude", {
          start: 3,
          end: 5,
        }),
        frameRate: 20,
        repeat: -1,
      });
  
      this.anims.create({
        key: "punch",
        frames: this.anims.generateFrameNumbers("dude", {
          start: 9,
          end: 10,
        }),
        frameRate: 10,
        repeat: -1, //-1 for infinite repeats
      });
  
      this.anims.create({
        key: "hook",
        frames: this.anims.generateFrameNumbers("dude", {
          start: 11,
          end: 12,
        }),
        frameRate: 10,
        repeat: -1, //-1 for infinite repeats
      });
  
      this.anims.create({
        key: "kick",
        frames: this.anims.generateFrameNumbers("dude", {
          start: 13,
          end: 14,
        }),
        frameRate: 10,
        repeat: -1, //-1 for infinite repeats
      });
  
      this.anims.create({
        key: "uppercut",
        frames: this.anims.generateFrameNumbers("dude", {
          start: 20,
          end: 24,
        }),
        frameRate: 10,
        repeat: -1, //-1 for infinite repeats
      });
  
      this.anims.create({
        key: "crhook",
        frames: this.anims.generateFrameNumbers("dude", {
          start: 25,
          end: 30,
        }),
        frameRate: 10,
        repeat: -1, //-1 for infinite repeats
      });
  
      this.anims.create({
        key: "roundhouse",
        frames: this.anims.generateFrameNumbers("dude", {
          start: 14,
          end: 19,
        }),
        frameRate: 10,
        repeat: -1, //-1 for infinite repeats
      });
      this.anims.create({
        key: "hit",
        frames: this.anims.generateFrameNumbers("dude", {
          start: 6,
          end: 6,
        }),
        frameRate: 10,
        repeat: -1, //-1 for infinite repeats
      });
      this.anims.create({
        key: "fall",
        frames: this.anims.generateFrameNumbers("dude", {
          start: 7,
          end: 7,
        }),
        frameRate: 10,
        repeat: -1, //-1 for infinite repeats
      });
      this.anims.create({
        key: "jump",
        frames: this.anims.generateFrameNumbers("dude", {
          start: 7,
          end: 7,
        }),
        frameRate: 10,
        repeat: -1,
      })
    }
}