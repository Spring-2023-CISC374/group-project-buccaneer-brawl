import Phaser from 'phaser';

import FightScene from './Scenes/FightScene';
import InputScene from './Scenes/InputScene';
import LoadingScene from './Scenes/LoadingScene';
import TitleScene from './Scenes/TitleScene';
import InstructionScene from './Scenes/InstructionScene';
import ResultScene from './Scenes/ResultScene';
import SPFightSceneLevel1 from './Scenes/SPFightSceneLevel1';
import SPFightSceneLevel2 from './Scenes/SPFightSceneLevel2';
import SPFightSceneLevel3 from './Scenes/SPFightSceneLevel3';
import SPResultScene from './Scenes/SPResultScene';
import SPInputScene from './Scenes/SPInputScene';

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
  scene: [
    LoadingScene,
    TitleScene,
    InputScene,
    InstructionScene,
    FightScene,
    ResultScene,
    SPFightSceneLevel1,
    SPFightSceneLevel2,
    SPFightSceneLevel3,
    SPResultScene,
    SPInputScene,
  ],
};

export default new Phaser.Game(config);
