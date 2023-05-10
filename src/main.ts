
import Phaser from 'phaser'
import DemoScene from './Scenes/DemoScene';
import GamemodeScene from './Scenes/GamemodeScene';
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
import Photo1Scene from './Scenes/Photo1Scene';
import Photo2Scene from './Scenes/Photo2Scene';
import Photo3Scene from './Scenes/Photo3Scene';
import Photo4Scene from './Scenes/Photo4Scene';


const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'app',
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 1200 },
      debug: false,
    },
  },

  scene: [LoadingScene, TitleScene, InputScene, GamemodeScene, InstructionScene, FightScene, ResultScene, DemoScene, Photo1Scene, Photo2Scene, Photo3Scene, Photo4Scene, SPFightSceneLevel1, SPFightSceneLevel2, SPFightSceneLevel3, SPResultScene, SPInputScene,],
};

export default new Phaser.Game(config);
