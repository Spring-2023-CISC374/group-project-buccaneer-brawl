import Phaser from 'phaser'

export default class Player {

    sprite: Phaser.Physics.Arcade.Sprite; //The actual sprite that moves, attacks, etc. Was previously the "player" variable
    timer: number; //Time remaining until player can perform an action
    action: string; //Action that the player intends to do
	health: number; //Pirates health; when it falls to 0 the pirate loses
	cooldown: boolean; //Handler for player collisions (one hit registering for 10+ hits); A player cannot hit another player while cooldown is false
	damage: number;

    constructor(sprite: Phaser.Physics.Arcade.Sprite, tint?: number) {
		this.sprite = sprite;
		this.health = 3;
		this.sprite.setCollideWorldBounds(true);
		this.action = "nothing";
		this.timer = 0;
		this.health = 100;
		this.cooldown = true;
		this.damage = 0;

		if (tint){
			this.sprite.setTint(tint);
		}
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
		if(this.sprite.body && this.sprite.body.velocity.y < 10) {
			this.sprite.setVelocityY(this.sprite?.body && this.sprite.body.velocity.y + 10);
		}
	}

    movePlayer(distance: number, moveType: string){
        if(moveType ==="walk_forward") {
			this.sprite.setVelocityX(0);
			this.sprite.setVelocityX(distance);
			this.sprite.anims.play('left', true);
			this.action = "walking"
			this.timer = 0;
			
		} else if (moveType == "walk_back") {
			this.sprite.setVelocityX(0);
			this.sprite.setVelocityX(-distance);
			this.sprite.anims.play('left', true);
			this.action = "walking"
			this.timer = 0;
			
		} else if (moveType=="jump") {
			this.sprite.setVelocityY(distance);
			this.sprite.anims.play('right', true);
			//Sets the jumping distance in the left direction
			this.sprite.setVelocityY(-distance);
			this.sprite.anims.play("left", true)
			this.action = "jumping";
		}
		else if (moveType==="jump_forward") {
			this.sprite.setVelocityY(-580);
			this.sprite.setVelocityX(distance);
			this.sprite.anims.play('right', true);
			this.action = "jumping";
		}
		else if (moveType==="jump_back") {
			this.sprite.setVelocityY(-580);
			this.sprite.setVelocityX(-distance);
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