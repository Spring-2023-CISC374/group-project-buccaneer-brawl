import Phaser from 'phaser'
import Player from '../Classes/player'

export default class KeyboardInput extends Phaser.Scene {

    handleKeyboardInput(player1: Player, player2: Player) {
        const keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        const keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        const keyUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    
        const keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        const keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        const keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    
        const keyI = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I);
        const keyO = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.O);
        const keyP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
    
        const keyJ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J);
        const keyK = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K);
        const keyL = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L);
    
        const keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        const keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        const keyT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.T);
    
        const keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        const keyG = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.G);
        const keyH = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.H);
    
        keyLeft.on('down', ()=> {
            if(player1?.sprite.body.touching.down) {
                player1?.movePlayer(260,"walk");
            }
    
        });
    
        keyA.on('down', ()=> {
            if(player2?.sprite.body.touching.down) {
                player2?.movePlayer(260,"walk");
            }
    
        });
    
        keyRight.on('down', ()=> {
            if(player1?.sprite.body.touching.down) {
                player1?.movePlayer(-260,"walk");
            }
        });
        keyD.on('down', ()=> {
            if(player2?.sprite.body.touching.down) {
                player2?.movePlayer(-260,"walk");
            }
        });
    
        keyUp.on('down', ()=> {
            if(player1?.sprite.body.touching.down) {
                player1?.movePlayer(-580,"jump");
            }
    
        });
    
        keyW.on('down', ()=> {
            if(player2?.sprite.body.touching.down) {
                player2?.movePlayer(-580,"jump");
            }
        });
    
        keyI.on('down', ()=> {
            if(player1) {
                player1.playerAttack('punch');
            }
        });
    
        keyE.on('down', ()=> {
            if(player2) {
                player2.playerAttack('punch');
            }
        });
    
        keyO.on('down', ()=> {
            if(player1) {
                player1.playerAttack('hook');
            }
        });
    
        keyR.on('down', ()=> {
            if(player2) {
                player2.playerAttack('hook');
            }
        });
    
        keyP.on('down', ()=> {
            if(player1) {
                player1.playerAttack('kick');
            }
        });
    
        keyT.on('down', ()=> {
            if(player2) {
                player2.playerAttack('kick');
            }
        });
    
        keyJ.on('down', ()=> {
            if(player1) {
                player1.playerAttack('uppercut');
            }
        });
    
        keyF.on('down', ()=> {
            if(player2) {
                player2.playerAttack('uppercut');
            }
        });
    
        keyK.on('down', ()=> {
            if(player1) {
                player1.playerAttack('crhook');
            }
        });
    
        keyG.on('down', ()=> {
            if(player2) {
                player2.playerAttack('crhook');
            }
        });
    
        keyL.on('down', ()=> {
            if(player1) {
                player1.playerAttack('roundhouse');
            }
        });
    
        keyH.on('down', ()=> {
            if(player2) {
                player2.playerAttack('roundhouse');
            }
        });
    

    }




}