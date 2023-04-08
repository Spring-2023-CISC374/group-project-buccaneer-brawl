import Phaser, { Physics } from 'phaser'
import KeyboardInput from './Classes/keyboardinput';
import Player from './Classes/player';


export default class FightScene extends Phaser.Scene 
{
	constructor() 
	{
		super('hello-world')
	}

	private platforms?: Phaser.Physics.Arcade.StaticGroup;
	private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
	private player1?: Player
	private player2?: Player
	private coins?: Phaser.Physics.Arcade.Group;
	private extraStars?: Phaser.Physics.Arcade.Group;
	private keyInputs?: KeyboardInput;

	private score = 0;
	private scoreText?: Phaser.GameObjects.Text;
	private P1_HPText?: Phaser.GameObjects.Text;
	private P2_HPText?: Phaser.GameObjects.Text;


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


		//Collisions for physics objects
		this.physics.add.collider(this.player1.sprite, this.platforms);
		this.physics.add.collider(this.player2.sprite, this.platforms);
		
		this.cursors = this.input.keyboard.createCursorKeys();
		
		this.coins = this.physics.add.group({
			key: 'star',
			repeat: 12,
			setXY: {x: Phaser.Math.Between(0 , 100), y: 0, stepX: Phaser.Math.Between(70 , 100)}
		});
		this.coins.children.iterate(c => {
			const child = c as Phaser.Physics.Arcade.Image;
			child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8))
		});

		this.physics.add.collider(this.coins, this.platforms);
		this.physics.add.overlap(this.player1.sprite, this.coins, this.handleCollectCoin, undefined, this);
		this.physics.add.overlap(this.player2.sprite, this.coins, this.handleCollectCoin, undefined, this);

		this.P1_HPText = this.add.text(16,16, 'Player 1 HP: 0', {
			fontSize: '30px',
			color: '#000'
		});
		this.P2_HPText = this.add.text(510,16, 'Player 2 HP: 0', {
			fontSize: '30px',
			color: '#000'
		});

		this.P1_HPText?.setText(`Player 1 HP: ${this.player1.health}`);
		this.P2_HPText?.setText(`Player 2 HP: ${this.player2.health}`);
		this.handleKeyboardInputs();

		this.player1.sprite.anims.play('turn', true);	
		this.player2.sprite.anims.play('turn', true);	

	}

	update(time: number, delta: number) 
	{

		if(!this.cursors) {
			return;
		}

		//Alter both player's traction and fall speed.
		this.player1?.setPlayerTraction();
		this.player1?.setPlayerFallSpeed();

		this.player2?.setPlayerFallSpeed();
		this.player2?.setPlayerTraction();

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
			this.physics.overlap(this.player1.sprite, this.player2.sprite, this.hitCallback, this.checkCooldown, this);
		}

	}

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

	private handleCollectCoin(player: Phaser.GameObjects.GameObject, s: Phaser.GameObjects.GameObject) {
		const star = s as Phaser.Physics.Arcade.Image;
		star.disableBody(true, true);

		//this.score += 10;
		//this.scoreText?.setText(`Score: ${this.score}`);
		
	}
	
	private checkCooldown(){
		return this.player1?.cooldown && this.player2?.cooldown
	}

	private hitCallback(user: Phaser.GameObjects.GameObject, target: Phaser.GameObjects.GameObject) {
		console.log("Hitbox collided with target! " + this.player1?.action);

		const userSprite = user as Phaser.Physics.Arcade.Sprite;
		const targetSprite  = target as Phaser.Physics.Arcade.Sprite;
		
		if(this.player1 && this.player2) {
			if(this.player1.action.startsWith("attack") && this.player1.cooldown) {
				this.player1.setCooldown(false);
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

				this.player2.health -= this.player1.damage;
				this.P2_HPText?.setText(`Player 2 HP: ${this.player2.health}`);

				//This makes it so that a hit only damages a player once every second
				setTimeout(() => {
					this.player1?.setCooldown(true);
					console.log("attack ready!");
				}, 1000);

				//Game over placeholder
				if (this.player2.health <= 0){
					this.player2.health = 0;
					this.physics.pause();
					this.player2.sprite.setTint(0xff0000);
				}

				this.extraStars = this.physics.add.group({
					key: 'star',
					repeat: 12,
					setXY: {x: Phaser.Math.Between(0 , 100), y: 0, stepX: Phaser.Math.Between(70 , 100)}
				});

				this.coins?.children.iterate(c => {
					const child = c as Phaser.Physics.Arcade.Image;
					child.enableBody(true, child.x, 0, true, true);
				})
			}
			if(this.player2.action.startsWith("attack")) {
				this.player2.setCooldown(false);

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
				this.player1.health -= this.player2.damage;
				this.P1_HPText?.setText(`Player 1 HP: ${this.player1.health}`);

				//This makes it so that a hit only damages a player once every second
				setTimeout(() => {
					this.player2?.setCooldown(true);
					console.log("attack ready!");
				}, 1000);

				//Game over placeholder
				if (this.player1.health <= 0){
					this.player1.health = 0;
					this.physics.pause();
					this.player1.sprite.setTint(0xff0000);
				}

				this.extraStars = this.physics.add.group({
					key: 'star',
					repeat: 12,
					setXY: {x: Phaser.Math.Between(0 , 100), y: 0, stepX: Phaser.Math.Between(70 , 100)}
				});

				this.coins?.children.iterate(c => {
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
                this.player1.playerAttack(15, 'hook');
            }
        });
    
        keyR.on('down', ()=> {
            if(this.player2) {
                this.player2.playerAttack(15, 'hook');
            }
        });
    
        keyP.on('down', ()=> {
            if(this.player1) {
                this.player1.playerAttack(20, 'kick');
            }
        });
    
        keyT.on('down', ()=> {
            if(this.player2) {
                this.player2.playerAttack(20, 'kick');
            }
        });
    
        keyJ.on('down', ()=> {
            if(this.player1) {
                this.player1.playerAttack(30, 'uppercut');
            }
        });
    
        keyF.on('down', ()=> {
            if(this.player2) {
                this.player2.playerAttack(30, 'uppercut');
            }
        });
    
        keyK.on('down', ()=> {
            if(this.player1) {
                this.player1.playerAttack(45, 'crhook');
            }
        });
    
        keyG.on('down', ()=> {
            if(this.player2) {
                this.player2.playerAttack(45, 'crhook');
            }
        });
    
        keyL.on('down', ()=> {
            if(this.player1) {
                this.player1.playerAttack(60, 'roundhouse');
            }
        });
    
        keyH.on('down', ()=> {
            if(this.player2) {
                this.player2.playerAttack(60, 'roundhouse');
            }
        });
    
	}



}
