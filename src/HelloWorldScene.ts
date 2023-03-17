import Phaser, { Physics } from 'phaser'


/*Main Game Class, where the pirates fight
*
*/
export default class HelloWorldScene extends Phaser.Scene 
{
	constructor() 
	{
		super('hello-world')
	}

	private platforms?: Phaser.Physics.Arcade.StaticGroup;
	private player?: Phaser.Physics.Arcade.Sprite;
	private player2?: Phaser.Physics.Arcade.Sprite;
	private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
	private stars?: Phaser.Physics.Arcade.Group;
	private extraStars?: Phaser.Physics.Arcade.Group;
	private bombs?: Phaser.Physics.Arcade.Group;
	private hitboxes?: Phaser.Physics.Arcade.Group;

	private score = 0;
	private scoreText?: Phaser.GameObjects.Text;

	private gameOver = false;

	private p1Timer = 0;
	private p2Timer = 0;
	private p1Action= "nothing";
	private p2Action = "nothing";


	/*Preload all assets from public/assets
	*
	*/
	preload() 
	{
		this.load.image('pirateship', 'assets/pirateship.png');
		this.load.image('ground', 'assets/platform.png');
		this.load.image('star', 'assets/star.png');
		this.load.image('bomb', 'assets/bomb.png');
		this.load.spritesheet('dude', 'assets/dude.png', {
			frameWidth: 128, frameHeight: 128
		});
	}


	/* Create all physics objects, such as player1, player2, the coints, and the ground.
	* Also sets the players collisions boxes.
	*
	*/
	create() 
	{
		this.add.image(400, 300, 'pirateship').setScale(2);
		
		this.platforms = this.physics.add.staticGroup();
		const ground = this.platforms.create(400,569, 'ground') as Physics.Arcade.Sprite;
		ground.setScale(2).refreshBody();

		this.player = this.physics.add.sprite(100, 350, 'dude').setSize(54, 108).setOffset(0,12).setScale(2);
		this.player2 = this.physics.add.sprite(700, 350, 'dude').setSize(54, 108).setOffset(70,12).setScale(2);
		//this.player.setBounce(0.2);
		this.player.setCollideWorldBounds(true);
		this.player2.setCollideWorldBounds(true);
		this.player2?.setTint(0x0096ff); //player 2 demo

		this.animationHandler();

		//Collisions for physics objects
		this.physics.add.collider(this.player, this.platforms);
		this.physics.add.collider(this.player2, this.platforms);
		
		this.cursors = this.input.keyboard.createCursorKeys();
		
		this.stars = this.physics.add.group({
			key: 'star',
			repeat: 12,
			setXY: {x: Phaser.Math.Between(0 , 100), y: 0, stepX: Phaser.Math.Between(70 , 100)}
		});
		this.stars.children.iterate(c => {
			const child = c as Phaser.Physics.Arcade.Image;
			child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8))
		});

		this.physics.add.collider(this.stars, this.platforms);
		this.physics.add.overlap(this.player, this.stars, this.handleCollectStar, undefined, this);
		this.physics.add.overlap(this.player2, this.stars, this.handleCollectStar, undefined, this);

		this.scoreText = this.add.text(16,16, 'score: 0', {
			fontSize: '32 px',
			color: '#000'
		});

		//Create bomb
		this.bombs = this.physics.add.group();
		//Create hitbox
		this.hitboxes = this.physics.add.group({
			immovable: true,
			allowGravity: false
		});
		//Allow collision between physics objects and ground
		this.physics.add.collider(this.bombs, this.platforms);
		this.physics.add.collider(this.player, this.bombs, this.handleHitBomb, undefined, this);



		this.handleKeyboardInputs();

		this.player?.anims.play('turn', true);	

	}


	/*Update function
	*
	*
	*/
	update(time: number, delta: number) 
	{
		//If we cant find input then return
		if(!this.cursors) {
			return;
		}

		//Set Player stats, such as traction
		if(this.player) {
			this.playerAttributes(this.player);
		}
		if(this.player2) {
			this.playerAttributes(this.player2);
		}

		//Go back to idle/next animation after the one thats playing ends.
		if(this.player) {
			this.performNextAction(this.player, delta);
		}
		if(this.player2) {
			this.performNextAction(this.player2, delta);
		}


		//Switch player sides if they are on the opposite side code.
		if(this.player && this.player2) {
			if(this.player.body.x < this.player2.body.x) {
				this.player.flipX = false;
				this.player2.flipX = true;
		
				this.player.setOffset(0, 12);
				this.player2.setOffset(70, 12);
				this.attackRanges(this.player, true);
				this.attackRanges(this.player2, false);
			} else {
				this.player.flipX = true;
				this.player2.flipX = false;

				this.player.setOffset(70, 12);
				this.player2.setOffset(0, 12);
				this.attackRanges(this.player, false);
				this.attackRanges(this.player2, true);
			}
		}

		//Continously see if player1 is colliding with player2
		if(this.player && this.player2) {
			this.physics.overlap(this.player, this.player2, this.hitCallback, undefined, this);
		}

	}

	private onAnimationEnd(player: Phaser.Physics.Arcade.Sprite) {
		//Reset player timer. the timer resets to 0 when idle
		if(player==this.player) {
			this.p1Timer = 0; 
			//this.p1Action = "nothing";
		}
		else {
			this.p2Timer = 0;
			//this.p2Action = "nothing";
		}
	}


	/*Whenever a player does a move, the timer goes off and the player will stay in the new animation
	* until the timer reaches 500. Once that happens the player returns to the idle state.
	*/
	private performNextAction(player: Phaser.Physics.Arcade.Sprite, delta: number) {

		if(player==this.player) {
			if(this.p1Action != "nothing") this.p1Timer += delta;

			while (this.p1Timer > 500) {
				//this.timer -= 1000;
				this.p1Timer = 0;
	
				this.p1Action = "nothing"
				player?.anims.play('turn', true);
			}

		} else {

			if(this.p2Action != "nothing") this.p2Timer += delta;

			while (this.p2Timer > 500) {
				//this.timer -= 1000;
				this.p2Timer = 0;
	
				this.p2Action = "nothing"
				player?.anims.play('turn', true);
			}

		}

	}

	/*Set player attributes such as traction whenever you dash.
	*
	*/
	private playerAttributes(player: Phaser.Physics.Arcade.Sprite) {
		if (player?.body && player.body.velocity.x > 10) {
			player?.setVelocityX(player?.body && player.body.velocity.x-5);
		} else if ( player?.body && player?.body.velocity.x < -10) {
			player?.setVelocityX(player?.body && player.body.velocity.x+5);
		} else {
			player?.setVelocityX(0);
		}

		if(player?.body && player.body.velocity.y < 10) {
			player.setVelocityY(player?.body && player.body.velocity.y + 10);
		}
	}

	/*Expand player collision box when doing moves that have a lot of range
	* (i.e. crouching hook, roundhouse kick)
	*/
	private attackRanges(player: Phaser.Physics.Arcade.Sprite, leftside: boolean) {
		const offset = (leftside)? 0 : 80;
		const rangeMul = (leftside)? 1: -1;

		const moveType = this.p1Action.split('/')[1]

		if(moveType =='crhook' && this.p1Timer > 200) {
			player.setOffset(30 * rangeMul + offset,12);
		}
		else if(moveType=='roundhouse' && this.p1Timer > 400) {
			player.setOffset(30 * rangeMul + offset,12);
		} else if(moveType != 'crhook' && moveType != 'roundhouse') {
			player.setOffset(30 * rangeMul + offset,12);
		}	

	}

	/*Script to move the player, theres a walk forward, backward, and a jump.
	*
	*/
	private movePlayer(player: Phaser.Physics.Arcade.Sprite, distance: number, moveType: string) {
		if(moveType=="walk") {
			player?.setVelocityX(0);
			player?.setVelocityX(-distance);
			player?.anims.play('left', true);
			if(player == this.player) this.p1Action = "walking"; else this.p2Action = "walking";

			this.onAnimationEnd(player);
			
		} else if (moveType=="jump") {
			player?.setVelocityY(distance);
			player?.anims.play('right', true);
			if(player == this.player) this.p1Action = "jumping"; else this.p2Action = "jumping";

			this.onAnimationEnd(player);
		}
	}

	/*Sets player attack to use, calls the function to play the animation given via the moveType parameter
	*
	*/
	private playerAttack(player: Phaser.Physics.Arcade.Sprite, damage: number, moveType:string) {

		
		player?.anims.play(moveType, true);
		//console.log(this.p1Timer);

		//Adding range to some moves


		if(player == this.player) this.p1Action = "attack/" + moveType; else this.p2Action = "attack/" + moveType;
		this.hitboxes?.setVisible(true);
		
		this.onAnimationEnd(player);
	}



	private handleHitBomb(player: Phaser.GameObjects.GameObject, b: Phaser.GameObjects.GameObject) {
		this.physics.pause();

		this.player?.setTint(0xff0000);
		this.player?.anims.play('turn');

		this.gameOver = true;
	}

	private handleCollectStar(player: Phaser.GameObjects.GameObject, s: Phaser.GameObjects.GameObject) {
		const star = s as Phaser.Physics.Arcade.Image;
		star.disableBody(true, true);

		this.score += 10;
		this.scoreText?.setText(`Score: ${this.score}`);

		//this.speedUp += 0.1;

		/*
		if(this.stars?.countActive(true) === 0) {
			this.stars.children.iterate(c => {
				const child = c as Phaser.Physics.Arcade.Image;
				child.enableBody(true, child.x, 0, true, true);
			})
		
		}
		*/
	}

	/*Fires whenever the player collides with another player and one of them is attacking.
	*Makes the opponent fly in the air if hit.
	*/
	private hitCallback(user: Phaser.GameObjects.GameObject, target: Phaser.GameObjects.GameObject) {
		console.log("Hitbox collided with target! " + this.p1Action);
		const userSprite = user as Phaser.Physics.Arcade.Sprite;
		const targetSprite  = target as Phaser.Physics.Arcade.Sprite;

		if(this.player && this.player2) {
			if(this.p1Action.startsWith("attack")) {
				if(this.player.body.x < this.player2.body.x) {
					userSprite.setVelocityX(-260);
					targetSprite.setVelocityX(260);
					targetSprite.setVelocityY(-460);
					targetSprite.anims.play('hit', true);
				} else {
					userSprite.setVelocityX(260);
					targetSprite.setVelocityX(-260);
					targetSprite.setVelocityY(-460);
					targetSprite.anims.play('hit', true);
				}	

				this.extraStars = this.physics.add.group({
					key: 'star',
					repeat: 12,
					setXY: {x: Phaser.Math.Between(0 , 100), y: 0, stepX: Phaser.Math.Between(70 , 100)}
				});

				this.stars?.children.iterate(c => {
					const child = c as Phaser.Physics.Arcade.Image;
					child.enableBody(true, child.x, 0, true, true);
				})
			}
			if(this.p2Action.startsWith("attack")) {
				if(this.player.body.x > this.player2.body.x) {
					targetSprite.setVelocityX(-260);
					userSprite.setVelocityX(260);
					userSprite.setVelocityY(-460);
					userSprite.anims.play('hit', true);
				} else {
					targetSprite.setVelocityX(260);
					userSprite.setVelocityX(-260);
					userSprite.setVelocityY(-460);
					userSprite.anims.play('hit', true);
				}

				this.extraStars = this.physics.add.group({
					key: 'star',
					repeat: 12,
					setXY: {x: Phaser.Math.Between(0 , 100), y: 0, stepX: Phaser.Math.Between(70 , 100)}
				});

				this.stars?.children.iterate(c => {
					const child = c as Phaser.Physics.Arcade.Image;
					child.enableBody(true, child.x, 0, true, true);
				})
			}
		}
	}
	
	/*All the animations for the pirates added in the game in one function
	*
	*/
	private animationHandler() {
		this.anims.create({
			key: 'left',
			frames: this.anims.generateFrameNumbers('dude', {
				start: 3, end: 5
			}),
			frameRate: 20,
			repeat: -1 //-1 for infinite repeats
		});

		this.anims.create({
			key: 'turn',
			frames: this.anims.generateFrameNumbers('dude', {
				start: 0, end: 3
			}),
			frameRate: 10,
			repeat: -1 //-1 f
		})

		this.anims.create({
			key: 'right',
			frames: this.anims.generateFrameNumbers('dude', {
				start: 3, end: 5
			}), 
			frameRate: 20,
			repeat: -1
		})

		this.anims.create({
			key: 'punch',
			frames: this.anims.generateFrameNumbers('dude', {
				start: 9, end: 10
			}),
			frameRate: 10,
			repeat: -1 //-1 for infinite repeats
		});

		this.anims.create({
			key: 'hook',
			frames: this.anims.generateFrameNumbers('dude', {
				start: 11, end: 12
			}),
			frameRate: 10,
			repeat: -1 //-1 for infinite repeats
		});

		this.anims.create({
			key: 'kick',
			frames: this.anims.generateFrameNumbers('dude', {
				start: 13, end: 14
			}),
			frameRate: 10,
			repeat: -1 //-1 for infinite repeats
		});

		this.anims.create({
			key: 'uppercut',
			frames: this.anims.generateFrameNumbers('dude', {
				start: 20, end: 24
			}),
			frameRate: 10,
			repeat: -1 //-1 for infinite repeats
		});

		this.anims.create({
			key: 'crhook',
			frames: this.anims.generateFrameNumbers('dude', {
				start: 25, end: 30
			}),
			frameRate: 10,
			repeat: -1 //-1 for infinite repeats
		});

		this.anims.create({
			key: 'roundhouse',
			frames: this.anims.generateFrameNumbers('dude', {
				start: 14, end: 19
			}),
			frameRate: 10,
			repeat: -1 //-1 for infinite repeats
		});

		this.anims.create({
			key: 'hit',
			frames: this.anims.generateFrameNumbers('dude', {
				start: 6, end: 6
			}),
			frameRate: 10,
			repeat: -1 //-1 for infinite repeats
		});
	}

	/*All the keyboard inputs in the game in one function
	*
	*/
	private handleKeyboardInputs() {
		// Handle the 'o' key press
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
			if(this.player?.body.touching.down) {
				this.movePlayer(this.player, 260, "walk");
			}

		});

		keyA.on('down', ()=> {
			if(this.player2?.body.touching.down) {
				this.movePlayer(this.player2, 260, "walk");
			}

		});

		keyRight.on('down', ()=> {
			if(this.player?.body.touching.down) {
				this.movePlayer(this.player, -260, "walk");
			}
		});
		keyD.on('down', ()=> {
			if(this.player2?.body.touching.down) {
				this.movePlayer(this.player2, -260, "walk");
			}
		});

		keyUp.on('down', ()=> {
			if(this.player?.body.touching.down) {
				this.movePlayer(this.player, -580, "jump");
			}

		});

		keyW.on('down', ()=> {
			if(this.player2?.body.touching.down) {
				this.movePlayer(this.player2, -580, "jump");
			}

		});

		keyI.on('down', ()=> {
			if(this.player) {
				this.playerAttack(this.player, 10, 'punch');
			}
		});

		keyE.on('down', ()=> {
			if(this.player2) {
				this.playerAttack(this.player2, 10, 'punch');
			}
		});

		keyO.on('down', ()=> {
			if(this.player) {
				this.playerAttack(this.player, 10, 'hook');
			}
		});

		keyR.on('down', ()=> {
			if(this.player2) {
				this.playerAttack(this.player2, 10, 'hook');
			}
		});

		keyP.on('down', ()=> {
			if(this.player) {
				this.playerAttack(this.player, 10, 'kick');
			}
		});

		keyT.on('down', ()=> {
			if(this.player2) {
				this.playerAttack(this.player2, 10, 'kick');
			}
		});

		keyJ.on('down', ()=> {
			if(this.player) {
				this.playerAttack(this.player, 10, 'uppercut');
			}
		});

		keyF.on('down', ()=> {
			if(this.player2) {
				this.playerAttack(this.player2, 10, 'uppercut');
			}
		});

		keyK.on('down', ()=> {
			if(this.player) {
				this.playerAttack(this.player, 10, 'crhook');
			}
		});

		keyG.on('down', ()=> {
			if(this.player2) {
				this.playerAttack(this.player2, 10, 'crhook');
			}
		});

		keyL.on('down', ()=> {
			if(this.player) {
				this.playerAttack(this.player, 10, 'roundhouse');
			}
		});

		keyH.on('down', ()=> {
			if(this.player2) {
				this.playerAttack(this.player2, 10, 'roundhouse');
			}
		});

	}



}
