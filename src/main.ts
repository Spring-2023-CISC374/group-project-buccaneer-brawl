import Phaser from 'phaser'

import FightScene from './Scenes/FightScene';
import InputScene from './Scenes/InputScene';
import LoadingScene from './Scenes/LoadingScene';
import TitleScene from './Scenes/TitleScene';

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
  scene: [LoadingScene, TitleScene, InputScene, FightScene],
};

export default new Phaser.Game(config)
