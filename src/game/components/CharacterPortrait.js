import { COLORS } from '../config.js';

/** Phaser Graphics portraits keep the game playable without external image assets. */
export function drawPortrait(scene, x, y, character, scale = 1) {
  const g = scene.add.graphics().setDepth(12);
  g.setPosition(x, y).setScale(scale);
  if (character === 'ASTRO') {
    g.fillStyle(0x7ce7ef); g.fillCircle(0, 0, 42);
    g.fillStyle(0xeefbff); g.fillRoundedRect(-33, -30, 66, 60, 20);
    g.fillStyle(0x18385c); g.fillRoundedRect(-24, -13, 48, 26, 10);
    g.fillStyle(COLORS.cyan); g.fillCircle(-10, -1, 5); g.fillCircle(10, -1, 5);
    g.lineStyle(3, 0x4eafc3); g.strokeRoundedRect(-33, -30, 66, 60, 20);
    g.fillStyle(0xf3c96a); g.fillCircle(0, 28, 5);
  } else if (character === 'CAPTAIN NOVA') {
    g.fillStyle(0xe4a982); g.fillCircle(0, -2, 24);
    g.fillStyle(0x342843); g.fillEllipse(0, -18, 45, 24);
    g.fillStyle(0x243b67); g.fillRoundedRect(-31, 19, 62, 34, 12);
    g.fillStyle(0xffd36b); g.fillCircle(0, 25, 5);
    g.fillStyle(0x322b37); g.fillCircle(-8, -4, 2); g.fillCircle(8, -4, 2);
    g.lineStyle(2, 0xffe5d5); g.beginPath(); g.arc(0, 3, 7, 0.15, Math.PI - 0.15); g.strokePath();
  } else {
    g.fillStyle(0x79b9f0); g.fillCircle(0, -3, 25);
    g.fillStyle(0xeff8ff); g.fillRoundedRect(-34, 16, 68, 38, 14);
    g.fillStyle(0x4b79a7); g.fillRoundedRect(-27, 22, 54, 22, 8);
    g.fillStyle(0x273e60); g.fillCircle(-8, -4, 3); g.fillCircle(8, -4, 3);
    g.lineStyle(2, 0x273e60); g.beginPath(); g.arc(0, 2, 8, 0.2, Math.PI - 0.2); g.strokePath();
    g.fillStyle(0xffd66e); g.fillCircle(0, 31, 5);
  }
  return g;
}
