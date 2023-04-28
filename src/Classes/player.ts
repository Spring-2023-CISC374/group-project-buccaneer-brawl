import Phaser from "phaser";

export default class Player {
  sprite: Phaser.Physics.Arcade.Sprite; //The actual sprite that moves, attacks, etc. Was previously the "player" variable
  timer: number; //Time remaining until player can perform an action
  action: string; //Action that the player intends to do
  maxHealth: number; //The max amount of health the pirate can have (used for percentage checks etc). The pirate starts the game at this health
  health: number; //Pirate's health. This is the number that actually decreases/increases as a pirate fights
  coins: number; //Amount of coins the pirate has. Having
  cooldown: boolean; //Handler for player collisions (one hit registering for 10+ hits); A player cannot hit another player while cooldown is false
  hitstun: boolean; //If hitstun is set to true, movePlayer and playerAttack cannot be called until the player hits the ground. A player is put into hitstun when an opposing character's attack damages them
  damage: number; //Damage of the player intended action
  invulnerable: boolean;
  knockbackX: number;
  knockbackY: number;
  fallTime: number;
  fallCounter: number;
  fallen: boolean;
  player1: boolean;

  constructor(sprite: Phaser.Physics.Arcade.Sprite, health?: number, tint?: number) {
    this.sprite = sprite;
    this.health = 3;
    this.coins = 0;
    this.sprite.setCollideWorldBounds(true);
    this.action = "nothing";
    this.timer = 0;
    if (health){
      this.maxHealth = health;
      this.health = health;
    }
    //default is 100
    else{
      this.maxHealth = 100;
      this.health = 100; 
    }
    this.cooldown = true;
    this.hitstun = false;
    this.damage = 0;
    this.invulnerable = false;
    this.knockbackX = 260;
    this.knockbackY = 460;
    this.fallTime = 800;
    this.fallCounter = 0;
    this.fallen = false;
    this.player1 = true;
  

    if (tint) {
      this.sprite.setTint(tint);
      this.player1 = false;
    }
  }
  setHitstun(b: boolean) {
    this.hitstun = b;
  }
  setCooldown(b: boolean) {
    this.cooldown = b;
  }
  setPlayerTraction() {
    if (this.sprite.body && this.sprite.body.velocity.x > 10) {
      this.sprite.setVelocityX(
        this.sprite.body && this.sprite.body.velocity.x - 5
      );
    } else if (this.sprite.body && this.sprite.body.velocity.x < -10) {
      this.sprite.setVelocityX(
        this.sprite?.body && this.sprite.body.velocity.x + 5
      );
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

  movePlayer(distance: number, moveType: string, opponent?: Player) {
    if (this.hitstun) {
      console.log("in hitstun");
      return;
    }
    //console.log(moveType);
    if (opponent === undefined) return;

    if(this.player1) {
      this.sprite.setTint(0xffffff);
    } else {
      this.sprite.setTint(0x0096ff);
    }

    const dist =
      this.sprite.body.x > opponent.sprite.body.x ? -distance : distance;
    if (moveType === "walk_forward") {
      this.sprite.setVelocityX(0);
      this.sprite.setVelocityX(dist);
      this.sprite.anims.play("left", true);
      this.action = "walking";
      this.timer = 0;
    } else if (moveType === "walk_back") {
      this.sprite.setVelocityX(0);
      this.sprite.setVelocityX(-dist);
      this.sprite.anims.play("left", true);
      this.action = "walking";
      this.timer = 0;
    } else if (moveType === "jump") {
      this.sprite.anims.play("right", true);
      //Sets the jumping distance in the left direction
      this.sprite.setVelocityY(-580);
      this.sprite.anims.play("left", true);
      this.action = "jumping";
    } else if (moveType === "jump_forward") {
      this.sprite.setVelocityY(-580);
      this.sprite.setVelocityX(dist);
      this.sprite.anims.play("right", true);
      this.action = "jumping";
    } else if (moveType === "jump_back") {
      this.sprite.setVelocityY(-580);
      this.sprite.setVelocityX(-dist);
      this.sprite.anims.play("right", true);
      this.action = "jumping";
    } else if(moveType === "dodge") {
      this.sprite.setVelocityX(0);
      this.sprite.setVelocityX(0);
      this.sprite.anims.play("dodge", true);
      this.action = "dodge";
      this.invulnerable = true;
      
      const rng = Phaser.Math.Between(0, 1);
      console.log(rng);
      if(rng==1) {
        this.invulnerable = false;
        this.sprite.setTint(0x000000);
      }

    }
    else if(moveType === "roll_forward") {
      this.sprite.setVelocityX(0);
      this.sprite.setVelocityX(dist/2);
      this.sprite.anims.play("roll_forward", true);
      this.action = "roll_forward";
      this.invulnerable = true;

      const rng = Phaser.Math.Between(0, 1);
      console.log(rng);
      if(rng==1) {
        this.invulnerable = false;
        this.sprite.setTint(0x000000);
      }
    }
    else if(moveType === "roll_back") {
      this.sprite.setVelocityX(0);
      this.sprite.setVelocityX(-dist/2);
      this.sprite.anims.play("roll_back", true);
      this.action = "roll_back";
      this.invulnerable = true;

      const rng = Phaser.Math.Between(0, 1);
      console.log(rng);
      if(rng==1) {
        this.invulnerable = false;
        this.sprite.setTint(0x000000);
      }
    }
     else {
		this.action = "waiting";
	}
  }

  playerAttack(moveType: string) {
    if (this.hitstun) {
      console.log("in hitstun");
      return;
    }

    if(this.player1) {
      this.sprite.setTint(0xffffff);
    } else {
      this.sprite.setTint(0x0096ff);
    }

	this.action = "attack/" + moveType;	

    if (
      moveType === "crhook" ||
      moveType === "uppercut" ||
      moveType === "roundhouse"
    ) {
		this.action = "startup/" + moveType;
	}

    switch (moveType) {
      case "punch":
        this.damage = 5;
		this.knockbackX = 50;
		this.knockbackY = 0;
        break;
      case "hook":
        this.damage = 7;
		this.knockbackX = 180;
		this.knockbackY = 0;
        break;
      case "kick":
        this.damage = 9;
		this.knockbackX = 50;
		this.knockbackY = 200;
        break;
      case "uppercut":
        this.damage = 15;
		this.knockbackX = 20;
		this.knockbackY = 560;
        break;
      case "roundhouse":
        this.damage = 21;
		this.knockbackX = 360;
		this.knockbackY = 460;
        break;
      case "crhook":
        this.damage = 27;
		this.knockbackX = 80;
		this.knockbackY = 0;
        break;
      default:
        break;
    }

    this.sprite.anims.play(moveType, true);
  }

  performNextAction(delta: number) {
    if (this.action != "nothing") this.timer += delta;

    const moveType = this.action.split('/')[1];
    let nextMoveTime = 500;
    if(moveType === "punch" || moveType ==="kick" || moveType === "hook") nextMoveTime = 250;

    while (this.timer > nextMoveTime) {
      //this.timer -= 1000;
      this.timer = 0;

      this.action = "nothing";
      this.sprite.anims.play("turn", true);
    }
  }
}
