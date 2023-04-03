import Phaser from 'phaser';

import HelloWorldScene from './HelloWorldScene';
import InputScene from './moves/InputScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'app',
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 1200 },
    },
  },
  scene: [InputScene, HelloWorldScene],
};

export default new Phaser.Game(config);
