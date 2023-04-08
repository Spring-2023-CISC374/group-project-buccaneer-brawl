import Phaser from 'phaser'

export default class Player {

    sprite: Phaser.Physics.Arcade.Sprite; //The actual sprite that moves, attacks, etc. Was previously the "player" variable
    timer: number; //Time remaining until player can perform an action
    action: string; //Action that the player intends to do

    constructor(sprite: Phaser.Physics.Arcade.Sprite, tint?: number) {
      this.sprite = sprite;
      this.sprite.setCollideWorldBounds(true);
      this.action = "nothing";
      this.timer = 0;
      if (tint){
        this.sprite.setTint(tint);
      }
    }

    setPlayerTraction(){
        if (this.sprite.body && this.sprite.body.velocity.x > 10) {
			this.sprite.setVelocityX(this.sprite.body && this.sprite.body.velocity.x-5);
		} else if (this.sprite.body && this.sprite.body.velocity.x < -10) {
			this.sprite.setVelocityX(this.sprite?.body && this.sprite.body.velocity.x+5);
		} else {
			this.sprite.setVelocityX(0);
		}
    }

	setPlayerFallSpeed() {
		if(this.sprite.body && this.sprite.body.velocity.y < 10) {
			this.sprite.setVelocityY(this.sprite?.body && this.sprite.body.velocity.y + 10);
		}
	}

    movePlayer(distance: number, moveType: string){
        if(moveType=="walk") {
			this.sprite.setVelocityX(0);
			this.sprite.setVelocityX(-distance);
			this.sprite.anims.play('left', true);
			this.action = "walking"
			this.timer = 0;
			
		} else if (moveType=="jump") {
			this.sprite.setVelocityY(distance);
			this.sprite.anims.play('right', true);
			this.action = "jumping";
		}
    }
    playerAttack(damage: number, moveType: string){
        this.action = "attack/" + moveType;
        this.sprite.anims.play(moveType, true);

    }
    performNextAction(delta: number) {
		if(this.action != "nothing") this.timer += delta;
        
        while (this.timer > 500) {  	
			//this.timer -= 1000;
			this.timer = 0;

			this.action = "nothing"
			this.sprite.anims.play('turn', true);
		}
	}
	
}