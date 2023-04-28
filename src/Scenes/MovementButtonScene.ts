import Phaser from 'phaser';

export class MyScene extends Phaser.Scene {
    private button!: Phaser.GameObjects.Sprite;
    private dropdown!: Phaser.GameObjects.Sprite;
    private optionTexts!: Phaser.GameObjects.Text[];
  
    constructor() {
      super({ key: 'MovementButtonScene' });
      
    }
  
    create() {
      // Create the button sprite
      this.button = this.add.sprite(100, 100, 'buttonImage');
      this.button.setInteractive();
  
      // Create the dropdown sprite and options
      this.dropdown = this.add.sprite(100, 150, 'dropdownImage').setVisible(false);
      this.optionTexts = [];
      const options = ['wait', 'walk_forward', 'walk_back', 'jump', 'jump_forward', 'jump_back'];
      for (let i = 0; i < options.length; i++) {
        const optionText = this.add.text(100, 150 + (i + 1) * 20, options[i], {
          font: '16px Arial',
          color: '#000000'
        }).setInteractive();
        optionText.on('pointerdown', () => {
          this.handleMovement(options[i]);
          this.dropdown.setVisible(false);
        });
        this.optionTexts.push(optionText);
      }
  
      // Add a click event listener to the button to toggle the dropdown visibility
      this.button.on('pointerdown', () => {
        this.dropdown.setVisible(!this.dropdown.visible);
      });
    }
  
    private handleMovement(movement: string) {
      switch (movement) {
        case 'wait':
          // Handle "wait" movement
          break;
        case 'walk_forward':
          // Handle "walk_forward" movement
          break;
        case 'walk_back':
          // Handle "walk_back" movement
          break;
        case 'jump':
          // Handle "jump" movement
          break;
        case 'jump_forward':
          // Handle "jump_forward" movement
          break;
        case 'jump_back':
          // Handle "jump_back" movement
          break;
        default:
          break;
      }
    }
  }