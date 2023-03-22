import Phaser, { Physics } from 'phaser';

export default class RegisterInput extends Phaser.Scene {
  private keys: { [key: string]: Phaser.Input.Keyboard.Key };

  constructor() {
    super('InputRegistered');
    this.keys = {};
  }

  create() {
    const inputKeys: string[] = [
      'walk_forward',
      'walk_back',
      'jump_forward',
      'kick',
      'punch',
      'uppercut',
      'crhook',
      'roundhouse',
    ];
    this.registerInput(inputKeys);
  }

  private registerInput(input: string[]) {
    for (const key of input) {
      this.keys[key] = this.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes[
          key.toUpperCase() as keyof typeof Phaser.Input.Keyboard.KeyCodes
        ]
      );
    }
  }
}
