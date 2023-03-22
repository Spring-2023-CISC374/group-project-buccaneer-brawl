import Phaser, { Physics } from 'phaser'
import Player from './classes/player'


export default class HelloWorldScene extends Phaser.Scene 
{
	constructor() 
	{
		super('hello-world')
	}

	private platforms?: Phaser.Physics.Arcade.StaticGroup;
	private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
	private player1?: Player
	private player2?: Player
	private stars?: Phaser.Physics.Arcade.Group;
	private extraStars?: Phaser.Physics.Arcade.Group;
	private bombs?: Phaser.Physics.Arcade.Group;
	private hitboxes?: Phaser.Physics.Arcade.Group;

	private score = 0;
	private scoreText?: Phaser.GameObjects.Text;

	private gameOver = false;


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

	create() 
	{
		this.add.image(400, 300, 'pirateship').setScale(2);
		
		this.platforms = this.physics.add.staticGroup();
		const ground = this.platforms.create(400,569, 'ground') as Physics.Arcade.Sprite;
		ground.setScale(2).refreshBody();
		this.player1 = new Player(this.physics.add.sprite(100, 350, 'dude').setSize(54, 108).setOffset(0,12).setScale(2));
		this.player2 = new Player(this.physics.add.sprite(700, 350, 'dude').setSize(54, 108).setOffset(70,12).setScale(2), 0x0096ff);
		this.animationHandler();
		//this.player.setBounce(0.2);


		//Collisions for physics objects
		this.physics.add.collider(this.player1.sprite, this.platforms);
		this.physics.add.collider(this.player2.sprite, this.platforms);
		
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
		this.physics.add.overlap(this.player1.sprite, this.stars, this.handleCollectStar, undefined, this);
		this.physics.add.overlap(this.player2.sprite, this.stars, this.handleCollectStar, undefined, this);

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
		//this.physics.add.collider(this.player, this.bombs, this.handleHitBomb, undefined, this);



		this.handleKeyboardInputs();

		this.player1.sprite.anims.play('turn', true);	

	}

	update(time: number, delta: number) 
	{

		if(!this.cursors) {
			return;
		}

		//Go back to idle/next animation after the one thats playing ends.
		if(this.player1) {
			this.player1.performNextAction(delta);     
		}
		if(this.player2) {
			this.player2.performNextAction(delta);     
		}

		if(this.player1 && this.player2) {
			if(this.player1.sprite.body.x < this.player2.sprite.body.x) {
				this.player1.sprite.flipX = false;
				this.player2.sprite.flipX = true;
		
				this.player1.sprite.setOffset(0, 12);
				this.player2.sprite.setOffset(70, 12);
				this.attackRanges(this.player1, true);
				this.attackRanges(this.player2, false);
			} else {
				this.player1.sprite.flipX = true;
				this.player2.sprite.flipX = false;

				this.player1.sprite.setOffset(70, 12);
				this.player2.sprite.setOffset(0, 12);
				this.attackRanges(this.player1, false);
				this.attackRanges(this.player2, true);
			}
		}

		//Continously see if player1 is colliding with player2
		if(this.player1 && this.player2) {
			this.physics.overlap(this.player1.sprite, this.player2.sprite, this.hitCallback, undefined, this);
		}

	}

	/*private onAnimationEnd(player: Phaser.Physics.Arcade.Sprite) {
		if(player==this.player) {
			this.p1Timer = 0; 
			//this.p1Action = "nothing";
		}
		else {
			this.p2Timer = 0;
			//this.p2Action = "nothing";
		}
	}*/

	/*private performNextAction(player: Phaser.Physics.Arcade.Sprite, delta: number) {

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

	}*/

	/*private playerAttributes(player: Phaser.Physics.Arcade.Sprite) {
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
	}*/

	private attackRanges(player: Player, leftside: boolean) {
		const offset = (leftside)? 0 : 80;
		const rangeMul = (leftside)? 1: -1;

		const moveType = player.action.split('/')[1]

		if(moveType =='crhook' && player.timer > 200) {
			player.sprite.setOffset(30 * rangeMul + offset,12);
		}
		else if(moveType=='roundhouse' && player.timer > 400) {
			player.sprite.setOffset(30 * rangeMul + offset,12);
		} else if(moveType != 'crhook' && moveType != 'roundhouse') {
			player.sprite.setOffset(30 * rangeMul + offset,12);
		}	

	}

	/*private movePlayer(player: Phaser.Physics.Arcade.Sprite, distance: number, moveType: string) {
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
	}*/

	/*private playerAttack(player: Phaser.Physics.Arcade.Sprite, damage: number, moveType:string) {

		
		player?.anims.play(moveType, true);
		//console.log(this.p1Timer);

		//Adding range to some moves


		if(player == this.player) this.p1Action = "attack/" + moveType; else this.p2Action = "attack/" + moveType;
		this.hitboxes?.setVisible(true);
		
		this.onAnimationEnd(player);
	}*/

	/*private handleHitBomb(player: Phaser.GameObjects.GameObject, b: Phaser.GameObjects.GameObject) {
		this.physics.pause();

		this.player?.setTint(0xff0000);
		this.player?.anims.play('turn');

		this.gameOver = true;
	}*/

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

	private hitCallback(user: Phaser.GameObjects.GameObject, target: Phaser.GameObjects.GameObject) {
		console.log("Hitbox collided with target! " + this.player1?.action);
		const userSprite = user as Phaser.Physics.Arcade.Sprite;
		const targetSprite  = target as Phaser.Physics.Arcade.Sprite;

		if(this.player1 && this.player2) {
			if(this.player1.action.startsWith("attack")) {
				if(this.player1.sprite.body.x < this.player2.sprite.body.x) {
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
			if(this.player2.action.startsWith("attack")) {
				if(this.player1.sprite.body.x > this.player2.sprite.body.x) {
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
			if(this.player1?.sprite.body.touching.down) {
				this.player1?.movePlayer(260,"walk");
			}

		});

		keyA.on('down', ()=> {
			if(this.player2?.sprite.body.touching.down) {
				this.player2?.movePlayer(260,"walk");
			}

		});

		keyRight.on('down', ()=> {
			if(this.player1?.sprite.body.touching.down) {
				this.player1?.movePlayer(-260,"walk");
			}
		});
		keyD.on('down', ()=> {
			if(this.player2?.sprite.body.touching.down) {
				this.player2?.movePlayer(-260,"walk");
			}
		});

		keyUp.on('down', ()=> {
			if(this.player1?.sprite.body.touching.down) {
				this.player1?.movePlayer(-580,"jump");
			}

		});

		keyW.on('down', ()=> {
			if(this.player2?.sprite.body.touching.down) {
				this.player2?.movePlayer(-580,"jump");
			}
		});

		keyI.on('down', ()=> {
			if(this.player1) {
				this.player1.playerAttack(10, 'punch');
			}
		});

		keyE.on('down', ()=> {
			if(this.player2) {
				this.player2.playerAttack(10, 'punch');
			}
		});

		keyO.on('down', ()=> {
			if(this.player1) {
				this.player1.playerAttack(10, 'hook');
			}
		});

		keyR.on('down', ()=> {
			if(this.player2) {
				this.player2.playerAttack(10, 'hook');
			}
		});

		keyP.on('down', ()=> {
			if(this.player1) {
				this.player1.playerAttack(10, 'kick');
			}
		});

		keyT.on('down', ()=> {
			if(this.player2) {
				this.player2.playerAttack(10, 'kick');
			}
		});

		keyJ.on('down', ()=> {
			if(this.player1) {
				this.player1.playerAttack(10, 'uppercut');
			}
		});

		keyF.on('down', ()=> {
			if(this.player2) {
				this.player2.playerAttack(10, 'uppercut');
			}
		});

		keyK.on('down', ()=> {
			if(this.player1) {
				this.player1.playerAttack(10, 'crhook');
			}
		});

		keyG.on('down', ()=> {
			if(this.player2) {
				this.player2.playerAttack(10, 'crhook');
			}
		});

		keyL.on('down', ()=> {
			if(this.player1) {
				this.player1.playerAttack(10, 'roundhouse');
			}
		});

		keyH.on('down', ()=> {
			if(this.player2) {
				this.player2.playerAttack(10, 'roundhouse');
			}
		});

	}



}
