import { COLORS } from '../config.js';
import { RESOURCE_INFO } from '../data/missions.js';

export class ResourceDisplay {
  constructor(scene) { this.scene = scene; this.items = {}; }

  create(x, y, values) {
    const { scene } = this;
    const bg = scene.add.graphics().setDepth(8);
    bg.fillStyle(0x101d39, 0.93).fillRoundedRect(x, y, 520, 66, 18);
    this.items.background = bg;
    Object.entries(RESOURCE_INFO).forEach(([key, info], index) => {
      const px = x + 20 + index * 164;
      scene.add.text(px, y + 10, info.icon, { fontFamily: 'Arial', fontSize: '21px' }).setDepth(9);
      scene.add.text(px + 29, y + 11, info.label, { fontFamily: 'Arial', fontSize: '12px', fontStyle: 'bold', color: '#c4d4e7', letterSpacing: 1 }).setDepth(9);
      const value = scene.add.text(px + 143, y + 10, `${values[key]}%`, { fontFamily: 'Arial', fontSize: '15px', fontStyle: 'bold', color: '#fff6e8' }).setOrigin(1, 0).setDepth(9);
      const bar = scene.add.graphics().setDepth(9);
      this.items[key] = { value, bar, color: info.color, x: px + 1, y: y + 40, width: 142, currentWidth: 142 * values[key] / 100 };
      this.drawBar(key, values[key], false);
    });
  }

  drawBar(key, value, animate) {
    const item = this.items[key];
    const width = item.width * value / 100;

    // Draw the background track
    const draw = (progressWidth) => {
      item.bar.clear();

      // Background
      item.bar.fillStyle(0xffffff, 0.12)
        .fillRoundedRect(item.x, item.y, item.width, 8, 4);

      // Coloured progress fill
      if (progressWidth > 0) {
        item.bar.fillStyle(item.color, 1)
          .fillRoundedRect(item.x, item.y, progressWidth, 8, 4);
      }
    };

    // Update the percentage
    item.value.setText(`${value}%`);

    if (animate) {
      // Animate the existing graphics object
      const progress = {
        width: item.currentWidth ?? item.width
      };

      this.scene.tweens.add({
        targets: progress,
        width,
        duration: 500,
        ease: 'Cubic.Out',
        onUpdate: () => {
          draw(progress.width);
        },
        onComplete: () => {
          item.currentWidth = width;
          draw(width);
        }
      });
    } else {
      item.currentWidth = width;
      draw(width);
    }
  }

  update(values) { for (const key of Object.keys(RESOURCE_INFO)) this.drawBar(key, values[key], true); }
  destroy() {
    Object.values(this.items).forEach(item => { if (item?.destroy) item.destroy(); else { item?.value?.destroy(); item?.bar?.destroy(); } });
    this.items = {};
  }
}
