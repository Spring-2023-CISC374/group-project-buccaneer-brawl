import Phaser from 'phaser';

export default class Player {

    sprite: Phaser.Physics.Arcade.Sprite; //The actual sprite that moves, attacks, etc. Was previously the "player" variable
    timer: number; //Time remaining until player can perform an action
    action: string; //Action that the player intends to do
	health: number; //Pirates health; when it falls to 0 the pirate loses
	cooldown: boolean; //Handler for player collisions (one hit registering for 10+ hits). When true a player is "on cooldown"; they cannot hit another player 
	hitstun: boolean; //If hitstun is set to true, movePlayer and playerAttack cannot be called until the player hits the ground. A player is put into hitstun when an opposing character's attack damages them
	damage: number; //Damage of the player intended action

    constructor(sprite: Phaser.Physics.Arcade.Sprite, tint?: number) {
		this.sprite = sprite;
		this.health = 3;
		this.sprite.setCollideWorldBounds(true);
		this.action = "nothing";
		this.timer = 0;
		this.health = 100;
		this.cooldown = false;
		this.hitstun = false;
		this.damage = 0;

		if (tint){
			this.sprite.setTint(tint);
		}
	}
	setHitstun(b: boolean){
		this.hitstun = b;
	}
	setCooldown(b: boolean){
		this.cooldown = b;
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
    if (this.sprite.body && this.sprite.body.velocity.y < 10) {
      this.sprite.setVelocityY(
        this.sprite?.body && this.sprite.body.velocity.y + 10
      );
    }
  }

    movePlayer(distance: number, moveType: string, opponent?: Player){
		if (this.hitstun){
			return;
		}
		if(opponent === undefined) return;
		const dist = (this.sprite.body.x > opponent.sprite.body.x)? -distance: distance;

        if(moveType ==="walk_forward") {
			this.sprite.setVelocityX(0);
			this.sprite.setVelocityX(dist);
			this.sprite.anims.play('left', true);
			this.action = "walking"
			this.timer = 0;
			
		} else if (moveType === "walk_back") {
			this.sprite.setVelocityX(0);
			this.sprite.setVelocityX(-dist);
			this.sprite.anims.play('left', true);
			this.action = "walking"
			this.timer = 0;
			
		} else if (moveType==="jump") {
			this.sprite.anims.play('right', true);
			//Sets the jumping distance in the left direction
			this.sprite.setVelocityY(-580);
			this.sprite.anims.play("left", true)
			this.action = "jumping";
		}
		else if (moveType==="jump_forward") {
			this.sprite.setVelocityY(-580);
			this.sprite.setVelocityX(dist);
			this.sprite.anims.play('right', true);
			this.action = "jumping";
		}
		else if (moveType==="jump_back") {
			this.sprite.setVelocityY(-580);
			this.sprite.setVelocityX(-dist);
			this.sprite.anims.play('right', true);
			this.action = "jumping";
		}
    }
 	playerAttack(moveType: string){
		if (this.hitstun){
			return;
		}
        this.action = "attack/" + moveType;
		switch(moveType){
			case 'punch':
				this.damage = 10;
				break;
			case 'hook':
				this.damage = 10;
				break;
			case 'kick':
				this.damage = 10;
				break;
			case 'uppercut':
				this.damage = 20;
				break;
			case 'roundhouse':
				this.damage = 20;
				break;
			case 'crhook':
				this.damage = 20;
				break;
			default:
				break;
		}

		this.sprite.anims.play(moveType, true);

    }
    performNextAction(delta: number) {
		if(this.action != "nothing") this.timer += delta;
		
		while (this.timer > 500) {  	
			//this.timer -= 1000;
			this.timer = 0;

      this.action = 'nothing';
      this.sprite.anims.play('turn', true);
    }
  }
}
