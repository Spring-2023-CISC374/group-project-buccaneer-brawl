import Phaser from 'phaser'

import FightScene from './FightScene'

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
	scene: [FightScene],
}

export default new Phaser.Game(config)
