import Phaser from 'phaser'
import DemoScene from './Scenes/DemoScene';
import FightScene from './Scenes/FightScene';
import InputScene from './Scenes/InputScene';
import LoadingScene from './Scenes/LoadingScene';
import TitleScene from './Scenes/TitleScene';
import InstructionScene from './Scenes/InstructionScene';
import ResultScene from './Scenes/ResultScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'app',
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 1200 }
      debug: false,
    },
  },
  scene: [LoadingScene, TitleScene, InputScene, InstructionScene, FightScene, ResultScene, DemoScene],
};

export default new Phaser.Game(config)
