import Phaser, { Physics } from "phaser";
import Player from "../Classes/player";
import RegisterInput from "../Engine/registerInput";
import HealthBar from "../Classes/HealthBar";

export default class FightScene extends Phaser.Scene {
  constructor() {
    super({ key: "FightScene" });
  }

  private platforms?: Phaser.Physics.Arcade.StaticGroup;
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private player1?: Player;
  private player2?: Player;
  private coins?: Phaser.Physics.Arcade.Group;
  private cannonballs?: Phaser.Physics.Arcade.Group;
  private registerOne?: RegisterInput;
  private registerTwo?: RegisterInput;
  private p1_healthBar?: HealthBar;
  private p2_healthBar?: HealthBar;
  private savedTextP1?: string;
  private savedTextP2?: string;
  private p1_responseText?: string[];
  private p2_responseText?: string[];
  private msgBox1?: Phaser.GameObjects.Text;
  private msgBox2?: Phaser.GameObjects.Text;
  private roundTimer = 99;
  private roundTimerdelta = 0;
  private timeNumber?: number;
  private timerText?: Phaser.GameObjects.Text;

  init(data: {
    savedTextP1: string;
    savedTextP2: string;
    p1_responseText: string[] | undefined;
    p2_responseText: string[] | undefined;
  }) {
    this.savedTextP1 = data.savedTextP1;
    this.savedTextP2 = data.savedTextP2;
    this.p1_responseText = data.p1_responseText;
    this.p2_responseText = data.p2_responseText;
  }

  create() {
    this.add.image(400, 300, "pirateship").setScale(2);

    this.game.sound.stopAll();
    const music = this.sound.add("battlemusic");

    music.play();
    //music.setLoop(true);

    this.platforms = this.physics.add.staticGroup();
    const ground = this.platforms.create(
      400,
      569,
      "ground"
    ) as Physics.Arcade.Sprite;
    ground.setScale(2).refreshBody();
    this.player1 = new Player(
      this.physics.add
        .sprite(100, 350, "dude")
        .setSize(54, 108)
        .setOffset(0, 12)
        .setScale(2)
    );
    this.player2 = new Player(
      this.physics.add
        .sprite(700, 350, "dude")
        .setSize(54, 108)
        .setOffset(70, 12)
        .setScale(2),
      undefined,
      0x0096ff
    );

    this.msgBox1 = this.add.text(14, 80, "Player 1 Cannon Ready! Press Q", {
      fontSize: "20px",
      color: "#ffffff",
      backgroundColor: "#000000",
    });
    this.msgBox2 = this.add.text(430, 80, "Player 2 Cannon Ready! Press P", {
      fontSize: "20px",
      color: "#ffffff",
      backgroundColor: "#000000",
    });
    this.makeHealthBar(14, 60, 300, true);
    this.makeHealthBar(450, 60, 300, false);

    this.animationHandler();

    //Collisions for physics objects
    this.physics.add.collider(this.player1.sprite, this.platforms);
    this.physics.add.collider(this.player2.sprite, this.platforms);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.coins = this.physics.add.group({
      key: "star",
      repeat: 12,
      setXY: {
        x: Phaser.Math.Between(0, 100),
        y: 0,
        stepX: Phaser.Math.Between(70, 100),
      },
    });
    this.coins.children.iterate((c) => {
      const child = c as Phaser.Physics.Arcade.Image;
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    this.cannonballs = this.physics.add.group();
    this.physics.add.collider(
      this.cannonballs,
      this.platforms,
      (c) => {
        const cannonball = c as Phaser.Physics.Arcade.Image;
        cannonball.disableBody(true, true);
        //sound effect for boom placeholder
      },
      undefined,
      this
    );
    this.physics.add.collider(
      this.player1.sprite,
      this.cannonballs,
      this.handleHitCannonball,
      undefined,
      this
    );
    this.physics.add.collider(
      this.player2.sprite,
      this.cannonballs,
      this.handleHitCannonball,
      undefined,
      this
    );

    this.physics.add.collider(this.coins, this.platforms);
    this.physics.add.overlap(
      this.player1.sprite,
      this.coins,
      this.handleCollectCoin,
      undefined,
      this
    );
    this.physics.add.overlap(
      this.player2.sprite,
      this.coins,
      this.handleCollectCoin,
      undefined,
      this
    );
    this.timerText = this.add.text(316, 16, "Time: 99", {
      fontSize: "30px",
      color: "#000",
    });

    this.player1.sprite.anims.play("turn", true);
    this.player2.sprite.anims.play("turn", true);

    this.registerOne = new RegisterInput();
    this.registerTwo = new RegisterInput();

    this.roundTimer = 99;
    this.roundTimerdelta = 0;
  }

  update(time: number, delta: number) {
    if (!this.cursors) {
      return;
    }
    if (time > 0 && this.timeNumber) {
      this.timeNumber++;
    }

    if (this.p1_responseText === undefined) {
      this.p1_responseText = ["random"];
    }

    this.registerOne?.validInput(
      this.p1_responseText,
      delta,
      this.player1,
      this.player2
    );
    if (this.p2_responseText === undefined) {
      this.p2_responseText = ["random"];
    }
    this.registerTwo?.validInput(
      this.p2_responseText,
      delta,
      this.player2,
      this.player1
    );

    if (this.player1 && this.player2) {
      this.handleKeyboardInput();
      
      if(this.player1.action === "attack/fire_cannon" && this.player1.timer < 10) {
        console.log("CANNONS ARE FIRING");
        const rng = Phaser.Math.Between(0, 1);
        if(rng == 1) {
          this.fireCannon(this.player1, this.player2); 
        }
       
      } else if (this.player2.action === "attack/fire_cannon" && this.player2.timer < 10) {
        const rng = Phaser.Math.Between(0, 1);
        if(rng == 1) {
        this.fireCannon(this.player2, this.player1);
        }
      }





    }



    //Alter both player's traction and fall speed.
    this.player1?.setPlayerTraction();
    this.player1?.setPlayerFallSpeed();

    this.player2?.setPlayerFallSpeed();
    this.player2?.setPlayerTraction();

    //Go back to idle/next animation after the one thats playing ends.
    if (this.player1) {
      this.player1.performNextAction(delta);
    }
    if (this.player2) {
      this.player2.performNextAction(delta);
    }

    if (this.player1 && this.player2) {
      if(this.player1.action !== "fire_cannon") {
        if (this.player1.sprite.body.x < this.player2.sprite.body.x) {
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

    }

    if (this.player1) {
      this.player1.fallCounter += delta;
    }

    if (this.player2) {
      this.player2.fallCounter += delta;
    }

    if (this.player1 && this.player2) {
      if (this.player1.coins >= 20) {
        this.msgBox1?.setVisible(true);
      } else {
        this.msgBox1?.setVisible(false);
      }
      if (this.player2.coins >= 20) {
        this.msgBox2?.setVisible(true);
      } else {
        this.msgBox2?.setVisible(false);
      }
    }
    if (this.player1 && this.player2) {
      if (this.player1.fallCounter >= this.player1.fallTime) {
        if (this.player1.fallen) {
          this.player1.sprite.anims.play("turn");
          this.player1.sprite.clearTint();
          this.player1.setHitstun(false);
          this.player1.fallen = false;

          this.player1.action = "nothing";
          this.player1.fallCounter = 0;
        }
      }

      if (this.player2.fallCounter >= this.player2.fallTime) {
        if (this.player2.fallen) {
          this.player2.sprite.anims.play("turn");
          this.player2.sprite.setTint(0x0096ff);
          this.player2.setHitstun(false);
          this.player2.fallen = false;

          this.player2.action = "nothing";
          this.player2.fallCounter = 0;
        }
      }
    }

    //land check
    if (this.player1?.hitstun || this.player2?.hitstun) {
      if (this.player1?.hitstun && this.player1.sprite.body.touching.down) {
        if (!this.player1.fallen) {
          this.player1.sprite.anims.play("fall");
          this.player1.fallCounter = 0;
          this.player1.fallen = true;
        }
      }

      if (this.player2?.hitstun && this.player2.sprite.body.touching.down) {
        if (!this.player2.fallen) {
          this.player2.sprite.anims.play("fall");
          this.player2.fallCounter = 0;
          this.player2.fallen = true;
        }
      }
    }

    //Continously see if player1 is colliding with player2
    if (this.player1 && this.player2) {
      this.physics.overlap(
        this.player1.sprite,
        this.player2.sprite,
        this.hitCallback,
        undefined,
        this
      );
    }

    this.decrementRoundTimer(delta);
  }

  private attackRanges(player: Player, leftside: boolean) {
    const offset = leftside ? 0 : 80;
    const rangeMul = leftside ? 1 : -1;

    const moveType = player.action.split("/")[1];

    if (!player.hitstun) {
      if (
        moveType === "crhook" &&
        player.timer > 200 &&
        moveType !== undefined
      ) {
        player.action = "attack/" + moveType;
      } else if (
        moveType === "roundhouse" &&
        player.timer > 400 &&
        moveType !== undefined
      ) {
        player.action = "attack/" + moveType;
      } else if (
        moveType === "uppercut" &&
        player.timer > 50 &&
        moveType !== undefined
      ) {
        player.action = "attack/" + moveType;
      }

      if (moveType === "crhook" && player.timer > 200) {
        player.sprite.setOffset(30 * rangeMul + offset, 12);
      } else if (moveType === "roundhouse" && player.timer > 400) {
        player.sprite.setOffset(30 * rangeMul + offset, 12);
      } 
       else if (moveType !== "crhook" && moveType !== "roundhouse") {
        player.sprite.setOffset(30 * rangeMul + offset, 12);
      }
    }
  }
  //Creates a health bar at x,y with a lenght of fullWidth. The created health bar will be treated as player1/player2's health bar when p1 is true/false respectively
  private makeHealthBar(x: number, y: number, fullWidth: number, p1: boolean) {
    // background shadow
    const leftShadowCap = this.add
      .image(x, y, "left-cap-shadow")
      .setOrigin(0, 0.5);

    const middleShaddowCap = this.add
      .image(leftShadowCap.x + leftShadowCap.width, y, "middle-shadow")
      .setOrigin(0, 0.5);
    middleShaddowCap.displayWidth = fullWidth;

    this.add
      .image(
        middleShaddowCap.x + middleShaddowCap.displayWidth,
        y,
        "right-cap-shadow"
      )
      .setOrigin(0, 0.5);
    if (p1) {
      this.p1_healthBar = new HealthBar(this, x, y, fullWidth)
        .withLeftCap(this.add.image(0, 0, "left-cap-green"))
        .withMiddle(this.add.image(0, 0, "middle-green"))
        .withRightCap(this.add.image(0, 0, "right-cap-green"))
        .layout();
    } else {
      this.p2_healthBar = new HealthBar(this, x, y, fullWidth)
        .withLeftCap(this.add.image(0, 0, "left-cap-green"))
        .withMiddle(this.add.image(0, 0, "middle-green"))
        .withRightCap(this.add.image(0, 0, "right-cap-green"))
        .layout();
    }
  }

  private handleCollectCoin(
    player: Phaser.GameObjects.GameObject,
    s: Phaser.GameObjects.GameObject
  ) {
    const star = s as Phaser.Physics.Arcade.Image;
    star.disableBody(true, true);

    if (this.player1 && this.player2) {
      if (this.player1.sprite === player) {
        this.player1.coins++;
      } else {
        this.player2.coins++;
      }
    }
  }
  private handleHitCannonball(
    player: Phaser.GameObjects.GameObject,
    b: Phaser.GameObjects.GameObject
  ) {
    const cannonball = b as Phaser.Physics.Arcade.Image;
    cannonball.disableBody(true, true);
    if (this.player1 && this.player2) {
      if (this.player1.sprite === player) {
        console.log("cannon hit");
          this.player1.health -= 10;
          this.player1.sprite.setVelocityY(-780);
          this.p1_healthBar?.animate(this.player1.health / this.player1.maxHealth);
      } else {
        this.player2.health -= 10;
        this.player2.sprite.setVelocityY(-780);
        this.p2_healthBar?.animate(this.player2.health / this.player2.maxHealth);        
      }
      cannonball.destroy(true);
    }
  }

  private hitCallback(
    user: Phaser.GameObjects.GameObject,
    target: Phaser.GameObjects.GameObject
  ) {
    const userSprite = user as Phaser.Physics.Arcade.Sprite;
    const targetSprite = target as Phaser.Physics.Arcade.Sprite;

    // let player1priority = this.player1?.attackType === "punch" && this.player2?.attackType === "hook"

    if (this.player1 && this.player2) {
      if (
        this.player1.action.startsWith("attack") &&
        this.player1.cooldown &&
        !this.player1.hitstun &&
        !this.player2.invulnerable
      ) {
        this.player1.spamQueue.push(this.player1.action.split("/")[1]);
        if (this.player1.spamQueue.length > 10) this.player1.spamQueue.shift();

        let spamCount = this.player1.spamQueue.reduce(
          (acc, cur) =>
            cur === this.player1?.action.split("/")[1] ? acc + 1 : acc,
          0
        );
        if (spamCount <= 0) spamCount = 1;
        this.player1.damage /= spamCount;

        this.player2.sprite.setTint(0x0fffcb); //0xff0000

        this.player1.setCooldown(false);

        if (spamCount < 5) {
          this.player2.setHitstun(true);

          if (this.player1.sprite.body.x < this.player2.sprite.body.x) {
            userSprite.setVelocityX(-260 * (spamCount / 3));
            targetSprite.setVelocityX(this.player1.knockbackX);
            targetSprite.setVelocityY(-this.player1.knockbackY);
            targetSprite.anims.play("hit", true);
          } else {
            userSprite.setVelocityX(260 * (spamCount / 3));
            targetSprite.setVelocityX(-this.player1.knockbackX);
            targetSprite.setVelocityY(-this.player1.knockbackY);
            targetSprite.anims.play("hit", true);
          }

          //Game over placeholder
          if (this.player2.health <= 0) {
            this.player2.health = 0;
            this.physics.pause();
            this.scene.start("ResultScene", {
              p1_understandAmt: this.p1_understandAmt,
              p2_understandAmt: this.p2_understandAmt,
              who_won: "RedBeard",
            });
          }

          this.physics.add.group({
            key: "star",
            repeat: 12,
            setXY: {
              x: Phaser.Math.Between(0, 100),
              y: 0,
              stepX: Phaser.Math.Between(70, 100),
            },
          });

          this.coins?.children.iterate((c) => {
            const child = c as Phaser.Physics.Arcade.Image;
            child.enableBody(true, child.x, 0, true, true);
          });
        }

        //This makes it so that a hit only damages a player once every 0.3 seconds
        setTimeout(() => {
          if (this.player1) {
            this.player1?.setCooldown(true);
          }
        }, 300);

        //Game over placeholder
        if (this.player2.health <= 0) {
          this.player2.health = 0;
          this.physics.pause();
          this.scene.start("ResultScene", {
            savedTextP1: this.savedTextP1,
            savedTextP2: this.savedTextP2,
            who_won: "RedBeard",
          });
        }
        console.log(this.player1.spamQueue);
        console.log("damage", this.player1.damage);

        this.player2.health -= this.player1.damage;
        //HP bar drops to percentage of max HP
        this.p2_healthBar?.animate(
          this.player2.health / this.player2.maxHealth
        );
      }
      if (
        this.player2.action.startsWith("attack") &&
        this.player2.cooldown &&
        !this.player2.hitstun &&
        !this.player1.invulnerable
      ) {
        this.player2.spamQueue.push(this.player2.action.split("/")[1]);
        if (this.player2.spamQueue.length > 10) this.player2.spamQueue.shift();

        let spamCount = this.player2.spamQueue.reduce(
          (acc, cur) =>
            cur === this.player2?.action.split("/")[1] ? acc + 1 : acc,
          0
        );
        if (spamCount <= 0) spamCount = 1;
        this.player2.damage /= spamCount;

        this.player2.setCooldown(false);
        this.player1.sprite.setTint(0xff0000);

        if (spamCount < 5) {
          this.player1.setHitstun(true);

          if (this.player1.sprite.body.x > this.player2.sprite.body.x) {
            targetSprite.setVelocityX(-260 * (spamCount / 3));
            userSprite.setVelocityX(this.player2.knockbackX);
            userSprite.setVelocityY(-this.player2.knockbackY);
            userSprite.anims.play("hit", true);
          } else {
            targetSprite.setVelocityX(260 * (spamCount / 3));

            userSprite.setVelocityX(-this.player2.knockbackX);
            userSprite.setVelocityY(-this.player2.knockbackY);
            userSprite.anims.play("hit", true);
          }

          //Game over placeholder
          if (this.player1.health <= 0) {
            this.player1.health = 0;
            this.physics.pause();
            this.scene.start("ResultScene", {
              p1_understandAmt: this.p1_understandAmt,
              p2_understandAmt: this.p2_understandAmt,
              who_won: "BluBeard",
            });
          }

          this.physics.add.group({
            key: "star",
            repeat: 12,
            setXY: {
              x: Phaser.Math.Between(0, 100),
              y: 0,
              stepX: Phaser.Math.Between(70, 100),
            },
          });
          this.coins?.children.iterate((c) => {
            const child = c as Phaser.Physics.Arcade.Image;
            child.enableBody(true, child.x, 0, true, true);
          });
  
        }
        this.player1.health -= this.player2.damage;
        //HP bar drops to percentage of max HP
        this.p1_healthBar?.animate(
          this.player1.health / this.player1.maxHealth
        );

        //This makes it so that a hit only damages a player once every 0.3 seconds
        setTimeout(() => {
          if (this.player2) {
            this.player2?.setCooldown(true);
          }
        }, 300);

        //Game over placeholder
        if (this.player1.health <= 0) {
          this.player1.health = 0;
          this.physics.pause();
          this.scene.start("ResultScene", {
            savedTextP1: this.savedTextP1,
            savedTextP2: this.savedTextP2,
            who_won: "BluBeard",
          });
        }

        this.physics.add.group({
          key: "star",
          repeat: 12,
          setXY: {
            x: Phaser.Math.Between(0, 100),
            y: 0,
            stepX: Phaser.Math.Between(70, 100),
          },
        });

        this.coins?.children.iterate((c) => {
          const child = c as Phaser.Physics.Arcade.Image;
          child.enableBody(true, child.x, 0, true, true);
        });
      }
    }
  }

  private fireCannon(user: Player, target: Player) {
      //user.coins -= 20;
      if (user.sprite.x < target.sprite.x) {
        //fire to the left
        const cannonball: Phaser.Physics.Arcade.Image =
          this.cannonballs?.create(user.sprite.x, user.sprite.y + 20, "cannonball");
        cannonball.setScale(2, 2);
        cannonball.setCollideWorldBounds(true);
        cannonball.setVelocityX(1000);
        cannonball.setGravityY(10);
      } else {
        //fire to the right
        const cannonball: Phaser.Physics.Arcade.Image =
          this.cannonballs?.create(user.sprite.x, user.sprite.y + 20, "cannonball");
        cannonball.setScale(2, 2);
        cannonball.setCollideWorldBounds(true);
        cannonball.setVelocityX(1000);
        cannonball.setGravityY(10);
      }
    
  }

  decrementRoundTimer(delta: number) {
    this.roundTimerdelta += delta;

    if (this.roundTimerdelta > 900) {
      this.roundTimerdelta = 0;
      this.roundTimer--;
      this.timerText?.setText(`Time: ${this.roundTimer}`);
    }

    if (this.roundTimer <= 0) {
      let winner = "RedBeard";

      if (this.player1 && this.player2) {
        if (this.player1?.health < this.player2?.health) winner = "BluBeard";
      }

      this.scene.start("ResultScene", {
        savedTextP1: this.savedTextP1,
        savedTextP2: this.savedTextP2,
        who_won: winner,
      });
    }
  }

  handleKeyboardInput() {
    const keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
    const keyP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);

    keyQ.on("down", () => {
      if (this.player1 && this.player2)
        this.fireCannon(this.player1, this.player2);
    });
    keyP.on("down", () => {
      if (this.player1 && this.player2)
        this.fireCannon(this.player2, this.player1);
    });
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
      key: "roll_forward",
      frames: this.anims.generateFrameNumbers("roll", {
        start: 0,
        end: 10,
      }),
      frameRate: 20,
      repeat: -1,
    });
    this.anims.create({
      key: "roll_back",
      frames: this.anims.generateFrameNumbers("roll", {
        start: 10,
        end: 0,
      }),
      frameRate: 20,
      repeat: -1,
    });
    this.anims.create({
      key: "dodge",
      frames: this.anims.generateFrameNumbers("roll", {
        start: 0,
        end: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "rest",
      frames: this.anims.generateFrameNumbers("rest", {
        start: 0,
        end: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "dashkick",
      frames: this.anims.generateFrameNumbers("dash", {
        start: 0,
        end: 2,
      }),
      frameRate: 20,
      repeat: -1,
    });
    this.anims.create({
      key: "rising_uppercut",
      frames: this.anims.generateFrameNumbers("specials", {
        start: 0,
        end: 4,
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "fire_cannon",
      frames: this.anims.generateFrameNumbers("specials", {
        start: 5,
        end: 11,
      }),
      frameRate: 10,
      repeat: -1,
    });
  }
}
