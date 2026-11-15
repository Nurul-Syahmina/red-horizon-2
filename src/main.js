import Phaser from 'phaser';
import { RedHorizonScene } from './game/scenes/RedHorizonScene.js';
import { GAME_WIDTH, GAME_HEIGHT } from './game/config.js';
import './styles/game.css';

new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  backgroundColor: '#101b38',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    min: { width: 320, height: 180 },
  },
  render: { antialias: true, roundPixels: true },
  scene: [RedHorizonScene],
  audio: { noAudio: false },
});
