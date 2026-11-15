import Phaser from 'phaser';
import { COLORS, GAME_WIDTH as W, GAME_HEIGHT as H } from '../config.js';
import { INITIAL_RESOURCES, MISSIONS, RESOURCE_INFO } from '../data/missions.js';
import { ResourceManager } from '../systems/ResourceManager.js';
import { AudioManager } from '../systems/AudioManager.js';
import { drawPortrait } from '../components/CharacterPortrait.js';
import { ResourceDisplay } from '../components/ResourceDisplay.js';

const FONT = 'Trebuchet MS, Arial, sans-serif';

export class RedHorizonScene extends Phaser.Scene {
  constructor() { super('RedHorizon'); }


preload() {
  // Background music
  this.load.audio(
    'backgroundMusic',
    '/assets/audio/music/red-horizon-theme.mp3'
  );

  // Background image
  this.load.image(
    'marsTitle',
    '/assets/backgrounds/mars-title.png'
  );

  // ASTRO voice-over recordings (ASTRO1–ASTRO14)
  for (let i = 1; i <= 14; i++) {
    this.load.audio(
      `astro${i}`,
      `/assets/audio/voice-over/astro/ASTRO${i}.mp3`
    );
  }

  // JUNIOR COMMANDER typing sound
  this.load.audio(
    'commanderTyping',
    '/assets/audio/voice-over/junior-commander/COMMANDER.mp3'
  );

  // ASTRO idle animation spritesheet
  this.load.spritesheet(
    'astroIdle',
    '/assets/characters/astro/astro-idle.png',
    {
      frameWidth: 362,
      frameHeight: 724
    }
  );
}


  create() {
    this.resources = new ResourceManager();
    this.audio = new AudioManager(this);
    this.audio.setMusicEnabled(true);
    this.missionIndex = 0;
    this.soundOn = true;
    this.phase = 'menu';
    // ASTRO idle animation
this.anims.create({
    key: 'astro-idle',
    frames: this.anims.generateFrameNumbers('astroIdle', {
        start: 0,
        end: 5
    }),
    frameRate: 6,
    repeat: -1
});
    this.buildStars();
    this.showMenu();

    this.buildStars();
this.showMenu();

// Display animated ASTRO
this.astroSprite = this.add.sprite(906, 535, 'astroIdle');

this.astroSprite
    .setScale(0.40)
    .setDepth(50)
    .play('astro-idle');

// Floating animation
this.tweens.add({
    targets: this.astroSprite,
    y: 540,
    duration: 1200,
    yoyo: true,
    repeat: -1,
    ease: 'Sine.easeInOut'
});

this.scale.on('resize', () => {});

  }

  buildStars() {
    this.stars = this.add.graphics().setDepth(-10);
    for (let i = 0; i < 65; i++) {
      const x = Phaser.Math.Between(15, W - 15), y = Phaser.Math.Between(14, H - 170);
      const radius = Phaser.Math.FloatBetween(0.6, 1.8);
      this.stars.fillStyle(0xc3e5ff, Phaser.Math.FloatBetween(0.18, 0.75)).fillCircle(x, y, radius);
    }
    this.add.rectangle(W / 2, H / 2, W, H, 0x111b38).setDepth(-12);
    // Reposition stars above the background while keeping them behind scene art.
    this.stars.setDepth(-9);
    this.add.ellipse(1040, 160, 140, 140, 0xdd7658, 0.18).setDepth(-8);
    this.add.ellipse(1040, 160, 102, 102, 0xe69a6a, 0.5).setDepth(-8);
  }

  clearStage() {
    this.audio?.stopVoice();
    this.audio?.stopTyping();
    this.tweens.killAll();
    this.dialogueTimer?.remove(false);
    if (this.resourceDisplay) { this.resourceDisplay.destroy(); this.resourceDisplay = null; }
    const persistent = [this.stars];
    this.children.list.slice().forEach(child => {
      if (!persistent.includes(child) && child !== this.children.list[0]) child.destroy();
    });
    // Keep a freshly painted base and stars on every screen.
    this.children.list.filter(c => c.type === 'Ellipse' && c.depth === -8).forEach(c => c.setVisible(true));
  }


  baseScreen() {
    this.clearStage();

    // New illustrated Mars background
    this.add.image(W / 2, H / 2, 'marsTitle')
        .setDisplaySize(W, H)
        .setDepth(-20);
}


  text(x, y, value, size = 24, color = '#fff5df', opts = {}) {
    return this.add.text(x, y, value, {
      fontFamily: FONT, fontSize: `${size}px`, color, align: 'left',
      lineSpacing: 5, ...opts,
    });
  }

  button(x, y, w, h, label, callback, options = {}) {
    const bg = this.add.graphics().setDepth(options.depth ?? 20);
    const draw = (hover = false, down = false) => {
      bg.clear().fillStyle(options.color ?? 0x25647c).fillRoundedRect(x, y, w, h, 17);
      if (hover || down) bg.fillStyle(0xffffff, hover ? 0.1 : 0.18).fillRoundedRect(x, y, w, h, 17);
      bg.lineStyle(hover ? 2 : 1, options.stroke ?? 0x71e5ef, hover ? 1 : 0.65).strokeRoundedRect(x, y, w, h, 17);
    };
    draw();
    const txt = this.text(x + w / 2, y + h / 2, label, options.fontSize ?? 20, options.textColor ?? '#fff7e8', {
      align: 'center', fontStyle: 'bold', wordWrap: { width: w - 24 },
    }).setOrigin(0.5).setDepth((options.depth ?? 20) + 1);
    bg.setInteractive(new Phaser.Geom.Rectangle(x, y, w, h), Phaser.Geom.Rectangle.Contains)
      .on('pointerover', () => draw(true)).on('pointerout', () => draw())
      .on('pointerdown', () => draw(true, true)).on('pointerup', () => { draw(true); this.clickSound(); callback(); });
    return { bg, txt };
  }

  clickSound() { /* Hook point for optional recorded/ licensed UI effects. */ }

  panel(x, y, w, h, alpha = 0.94) {
    const g = this.add.graphics().setDepth(-1);
    g.fillStyle(COLORS.deep, alpha).fillRoundedRect(x, y, w, h, 24);
    g.lineStyle(1.5, 0x7797c5, 0.4).strokeRoundedRect(x, y, w, h, 24);
    return g;
  }

  showMenu() {
    this.baseScreen(); this.phase = 'menu';
    this.text(72, 66, 'RED', 70, '#fff3dc', { fontStyle: 'bold', letterSpacing: 4 }).setShadow(0, 5, '#361e37', 10, true, true);
    this.text(72, 131, 'HORIZON', 70, '#ff9b67', { fontStyle: 'bold', letterSpacing: 4 }).setShadow(0, 5, '#361e37', 10, true, true);
    this.text(78, 220, 'JUNIOR ASTRONAUT MISSION TRAINER', 18, '#9ce9f0', { fontStyle: 'bold', letterSpacing: 2 });
    this.text(78, 258, 'Every choice counts. Every decision teaches.', 19, '#d8e5f1');
    this.panel(55, 312, 531, 280, 0.75);
    this.text(83, 342, 'A new home on Mars needs a clever Commander.', 22, '#fff5df', { wordWrap: { width: 455 } });
    this.text(83, 391, 'Three missions. Three resources. Your choices shape the journey.', 18, '#bfd0e3', { wordWrap: { width: 455 } });
    this.button(84, 470, 230, 62, 'START MISSION  →', () => this.showPrologue(), { color: 0x287a81, fontSize: 20 });
    this.button(330, 470, 205, 62, 'HOW TO PLAY', () => this.showHowTo(), { color: 0x293e68, stroke: 0x80a9dc, fontSize: 18 });
    this.button(80, 548, 112, 35, `${this.soundOn ? '♫ SOUND ON' : '♫ SOUND OFF'}`, () => { this.soundOn = !this.soundOn; this.audio.setMusicEnabled(this.soundOn); this.audio.effectsEnabled = this.soundOn; this.showMenu(); }, { color: 0x263959, stroke: 0x7183a8, fontSize: 13 });
    drawPortrait(this, 740, 512, 'JUNIOR COMMANDER', 1.42);
    drawPortrait(this, 740, 512, 'JUNIOR COMMANDER', 1.42);
drawPortrait(this, 1065, 507, 'CAPTAIN NOVA', 1.28);
    this.text(740, 586, 'COMMANDER', 14, '#cce1f4', { fontStyle: 'bold' }).setOrigin(0.5);
    this.text(906, 650, 'ASTRO', 14, '#cce1f4', { fontStyle: 'bold' }).setOrigin(0.5);
    this.text(1065, 586, 'CAPTAIN NOVA', 14, '#cce1f4', { fontStyle: 'bold' }).setOrigin(0.5);
    this.text(76, 656, 'MISSION CONTROL  •  MARS OUTPOST 01', 12, '#a5b4c8', { letterSpacing: 2 });
    this.tweens.add({ targets: this.children.list.filter(c => c.type === 'Graphics').slice(-3), y: '-=5', duration: 1300, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
  }

  showHowTo() {
    this.baseScreen(); this.phase = 'howto';
    this.panel(244, 102, 792, 510);
    this.text(292, 140, 'HOW TO PLAY', 34, '#8deaf0', { fontStyle: 'bold', letterSpacing: 2 });
    this.text(292, 210, 'Your mission', 20, '#ffcb75', { fontStyle: 'bold' });
    this.text(292, 242, 'Complete three Mars emergencies and keep the outpost running.', 21, '#fff5df', { wordWrap: { width: 660 } });
    this.text(292, 308, 'Three resources', 20, '#ffcb75', { fontStyle: 'bold' });
    this.text(292, 340, '⚡ Power  •  💧 Water  •  🌱 Food', 23, '#eaf7ff');
    this.text(292, 395, 'Each choice lowers exactly one resource by 15%. The values carry on\nfrom mission to mission, and every choice has a trade-off.', 19, '#c5d6e7', { lineSpacing: 11 });
    this.text(292, 478, 'Choose carefully, learn the science, and help your crew.', 18, '#c5d6e7');
    this.button(292, 535, 210, 54, 'BACK TO MENU', () => this.showMenu(), { color: 0x293e68, stroke: 0x80a9dc, fontSize: 17 });
  }

  showPrologue() {
    this.audio.playMusic('backgroundMusic', {
    loop: true,
    volume: 0.25
    });
    this.resources.reset();
    this.missionIndex = 0;
    this.selectedMission = undefined;
    this.showStory('prologue', [
      {
        who: 'ASTRO',
        text: "Welcome to Mars, Commander! I'm ASTRO, your robot buddy. We have an important mission: keep our Mars base safe and running!",
        voiceKey: 'astro1'
      },
      {
        who: 'JUNIOR COMMANDER',
        text: "Let's do this!"
      },
      {
        who: 'ASTRO',
        text: 'But remember, our resources are limited. Every decision matters!',
        voiceKey: 'astro2'
      },
    ], () => this.startMission(0), 'WELCOME TO MARS!');
  }

  showStory(type, lines, onComplete, heading) {
    this.baseScreen(); this.phase = type;
    this.panel(170, 84, 940, 532, 0.91);
    this.text(218, 112, heading, 25, '#89e7ef', { fontStyle: 'bold', letterSpacing: 1 });
    const skipButton = this.text(
      1050, 112,
      'SKIP  ››',
      19,
      '#b9cee1',
      {
        fontStyle: 'bold',
        backgroundColor: '#293e68',
        padding: { left: 14, right: 14, top: 9, bottom: 9 }
      }
    )
    .setOrigin(0.5, 0)
    .setInteractive({ useHandCursor: true })
    .on('pointerdown', onComplete);
    skipButton.setDepth(12);
    this.storyLines = lines; this.storyIndex = 0; this.storyComplete = onComplete;
    this.renderStoryLine();
  }

  renderStoryLine() {
    if (this.storyIndex >= this.storyLines.length) return this.storyComplete();
    const line = this.storyLines[this.storyIndex];
    this.clearDialogueArea();
    // Play typing sound only for JUNIOR COMMANDER
    if (line.who === 'JUNIOR COMMANDER') {
      this.audio.playTyping();
    }
    this.dialogueObjects = [];
    const portrait = drawPortrait(this, 278, 330, line.who, 1.18); portrait.setDepth(12); this.dialogueObjects.push(portrait);
    const name = this.text(350, 260, line.who, 15, '#81e7ee', { fontStyle: 'bold', letterSpacing: 2 }).setDepth(13); this.dialogueObjects.push(name);
    const copy = this.text(350, 296, '', 23, '#fff5df', { wordWrap: { width: 675 }, lineSpacing: 9 }).setDepth(13);
    this.dialogueObjects.push(copy);
    const voice = line.voiceKey
      ? this.audio.playVoice(line.voiceKey)
      : null;
    this.typeText(copy, line.text, voice?.duration);
    const button = this.button(856, 520, 192, 52, this.storyIndex === this.storyLines.length - 1 ? 'LET’S GO  →' : 'CONTINUE  →', () => {
      if (!this.typingDone) { this.revealTyping(); return; }
      this.storyIndex++; this.renderStoryLine();
    }, { color: 0x287a81, fontSize: 18 });
    this.dialogueObjects.push(button.bg, button.txt);
    const zone = this.add.zone(706, 419, 730, 145).setOrigin(0).setDepth(14).setInteractive().on('pointerdown', () => this.revealTyping());
    this.dialogueObjects.push(zone);
  }

  clearDialogueArea() {
    this.audio?.stopTyping();
    this.dialogueTimer?.remove(false); this.typingDone = true;
    this.dialogueObjects?.forEach(o => o.destroy()); this.dialogueObjects = [];
    // Portrait and text added in each line are tagged for clean removal.
    this.children.list.slice().filter(c => c.getData?.('dialogue')).forEach(c => c.destroy());
  }

  typeText(target, fullText, audioDuration = null) {
    this.typingDone = false;
    this.typeIndex = 0;
    this.typeTarget = target;
    this.typeFull = fullText;

    const delay = audioDuration > 0
      ? Phaser.Math.Clamp(
          (audioDuration * 1000) / Math.max(fullText.length, 1),
          12,
          60
        )
      : 20;

    this.dialogueTimer = this.time.addEvent({
      delay,
      repeat: fullText.length,
      callback: () => {
        if (!this.typeTarget?.active) return;

        this.typeIndex++;
        this.typeTarget.setText(
          this.typeFull.slice(0, this.typeIndex)
        );
        if (this.typeIndex >= this.typeFull.length) {
          this.typingDone = true;
          this.audio.stopTyping();
        }
      }
    });
  }

  revealTyping() {
    if (!this.typingDone && this.typeTarget?.active) {
      this.dialogueTimer?.remove(false); this.typeTarget.setText(this.typeFull); this.typingDone = true;
      this.audio.stopVoice();
      this.audio.stopTyping();
    }
  }

  startMission(index) {
    this.missionIndex = index;
    const mission = MISSIONS[index];
    this.baseScreen(); this.phase = 'mission';
    this.drawMissionBackdrop(mission);
    this.drawMissionHeader(mission);
    this.resourceDisplay = new ResourceDisplay(this);
    this.resourceDisplay.create(500, 22, this.resources.snapshot());
    this.button(1172, 29, 72, 42, 'Ⅱ', () => this.showPause(), { color: 0x263959, stroke: 0x748cad, fontSize: 23 });
    const soundButton = this.button(1090, 29, 68, 42, this.soundOn ? '♫' : '♪', () => {
      this.soundOn = !this.soundOn;
      this.audio.setMusicEnabled(this.soundOn);
      this.audio.effectsEnabled = this.soundOn;
      soundButton.txt.setText(this.soundOn ? '♫' : '♪');
    }, { color: 0x263959, stroke: 0x748cad, fontSize: 21 });
    this.drawMissionSceneArt(mission);
    this.showMissionIntro(mission);
  }

  drawMissionHeader(mission) {
    this.text(42, 28, `${mission.icon}  ${mission.title.toUpperCase()}`, 25, '#fff5df', { fontStyle: 'bold', letterSpacing: 1 });
    this.text(43, 66, `MISSION ${this.missionIndex + 1} OF 3`, 13, '#9fe8ed', { fontStyle: 'bold', letterSpacing: 2 });
    for (let i = 0; i < 3; i++) {
      this.add.circle(189 + i * 22, 74, 4, i <= this.missionIndex ? 0x79e2e6 : 0x667792).setDepth(8);
    }
  }

  drawMissionBackdrop(mission) {
    const g = this.add.graphics().setDepth(-6);
    if (mission.scene === 'storm') {
      g.lineStyle(3, 0xffc375, 0.8);
      for (let i = 0; i < 7; i++) g.beginPath().moveTo(810 + i * 45, 0).lineTo(670 + i * 37, 155).strokePath();
      const glow = this.add.ellipse(1032, 176, 470, 225, 0xff8e65, 0.11).setDepth(-5);
      this.tweens.add({ targets: glow, alpha: 0.28, duration: 1000, yoyo: true, repeat: -1 });
      g.fillStyle(0x26395b).fillRoundedRect(820, 373, 132, 98, 20);
      g.fillStyle(0x36577d).fillRoundedRect(840, 338, 92, 56, 28);
      g.lineStyle(3, 0x70d9e6).strokeRoundedRect(819, 372, 134, 100, 20);
      g.fillStyle(0x72dce7, 0.18).fillRoundedRect(850, 402, 74, 40, 12);
      g.fillStyle(0xffd17c).fillRoundedRect(770, 460, 30, 48, 8); g.fillStyle(0xffdf8b).fillRoundedRect(967, 459, 29, 48, 8);
      this.text(829, 509, 'RADIATION SHELTER', 12, '#cce7f6', { fontStyle: 'bold' });
      this.drawAlert('SOLAR STORM', 1015, 277, 0xffa866);
    } else if (mission.scene === 'power') {
      for (let i = 0; i < 3; i++) {
        const x = 755 + i * 106;
        g.fillStyle(0x1e4567).fillRoundedRect(x, 360 + (i % 2) * 20, 93, 60, 7);
        g.lineStyle(2, 0x6ac6de).strokeRoundedRect(x, 360 + (i % 2) * 20, 93, 60, 7);
        for (let j = 1; j < 4; j++) g.lineStyle(1, 0x6ac6de, 0.65).lineBetween(x + j * 18, 363 + (i % 2) * 20, x + j * 18, 417 + (i % 2) * 20);
        g.lineStyle(1, 0x6ac6de, 0.65).lineBetween(x + 2, 390 + (i % 2) * 20, x + 91, 390 + (i % 2) * 20);
        g.fillStyle(0xc27b54, 0.55).fillEllipse(x + 20, 371 + (i % 2) * 20, 30, 8);
      }
      this.drawAlert('POWER LOW', 1006, 294, 0xff7578);
      for (let i = 0; i < 13; i++) {
        const dust = this.add.circle(740 + (i * 63) % 390, 307 + (i * 31) % 170, 2 + (i % 3), 0xd89b71, 0.48).setDepth(-3);
        this.tweens.add({ targets: dust, x: '+=18', y: '-=6', alpha: 0.1, duration: 1600 + i * 70, yoyo: true, repeat: -1 });
      }
    } else {
      // Transparent greenhouse arch, garden rows, animated drip line.
      g.lineStyle(5, 0x88d7d9, 0.58).strokeRoundedRect(739, 244, 420, 274, 78);
      g.lineStyle(3, 0x98dce2, 0.3).lineBetween(950, 249, 950, 510);
      g.fillStyle(0x326f58).fillRoundedRect(754, 442, 385, 55, 16);
      for (let i = 0; i < 8; i++) {
        const px = 783 + i * 45;
        g.lineStyle(4, 0x75cc91).lineBetween(px, 448, px, 394 - (i % 3) * 14);
        g.fillStyle(0x8ce3a1).fillEllipse(px - 7, 411 - (i % 3) * 14, 21, 10);
        g.fillStyle(0x8ce3a1).fillEllipse(px + 8, 398 - (i % 3) * 14, 20, 10);
      }
      g.lineStyle(5, 0x52bcdd).lineBetween(772, 341, 1117, 341);
      g.lineStyle(3, 0x52bcdd).lineBetween(898, 341, 898, 374);
      this.drawAlert('WATER LEAK', 1006, 295, 0xff797a);
      const drop = this.add.ellipse(900, 375, 8, 12, 0x71def2).setDepth(6);
      this.tweens.add({ targets: drop, y: 432, alpha: 0.15, duration: 720, repeat: -1, onRepeat: () => { drop.y = 375; drop.alpha = 1; } });
    }
  }

  drawAlert(label, x, y, color) {
    const g = this.add.graphics().setDepth(2);
    const dot = this.add.circle(x + 14, y + 17, 6, color).setDepth(3);
    g.fillStyle(0x18233c, 0.88).fillRoundedRect(x, y, 175, 36, 12);
    g.lineStyle(1, color, 0.75).strokeRoundedRect(x, y, 175, 36, 12);
    this.text(x + 28, y + 9, label, 12, '#ffe6cb', { fontStyle: 'bold', letterSpacing: 1 }).setDepth(3);
    this.tweens.add({ targets: dot, alpha: 0.25, scale: 0.7, duration: 500, yoyo: true, repeat: -1 });
  }

  drawMissionSceneArt(mission) {
    this.missionSceneObjects = [];

    // ASTRO stays in the environment, behind dialogue panels
    const astro = drawPortrait(this, 618, 373, 'ASTRO', 0.92)
      .setDepth(-2);
    this.missionSceneObjects.push(astro);

    // Radio behind panels
    const radio = this.add.graphics().setDepth(-2);
    radio.fillStyle(0x1c3558).fillRoundedRect(589, 414, 59, 24, 7);
    radio.fillStyle(0x78dfe8).fillRoundedRect(603, 421, 31, 4, 2);
    this.missionSceneObjects.push(radio);

    // ASTRO label behind panels
    const name = this.text(
      580, 455, 'ASTRO', 12, '#cff0f2',
      { fontStyle: 'bold', letterSpacing: 1 }
    ).setDepth(-2);

    this.missionSceneObjects.push(name);

    this.tweens.add({
      targets: radio,
      y: '-=3',
      duration: 850,
      yoyo: true,
      repeat: -1
    });
  }

  showMissionIntro(mission) {
    this.phase = 'missionIntro';

    // Keep track of all introduction elements
    this.missionIntroObjects = [];

    // Dialogue panel
    const panel = this.panel(45, 536, 1190, 148, 0.96);
    this.missionIntroObjects.push(panel);

    // ASTRO portrait
    const portrait = drawPortrait(this, 111, 600, 'ASTRO', 0.55)
      .setDepth(12);
    this.missionIntroObjects.push(portrait);

    // Speaker name
    const name = this.text(160, 552, 'ASTRO', 12, '#82e8ef', {
      fontStyle: 'bold',
      letterSpacing: 2
    }).setDepth(12);
    this.missionIntroObjects.push(name);

    // Dialogue subtitle
    const copy = this.text(160, 574, '', 18, '#fff5df', {
      wordWrap: { width: 830 },
      lineSpacing: 5
    }).setDepth(12);
    this.missionIntroObjects.push(copy);

    const voice = this.audio.playVoice(mission.voiceIntro);
    this.typeText(copy, mission.intro, voice?.duration);

    // Continue button
    const button = this.button(1030, 601, 166, 48, 'CONTINUE  →', () => {
      if (!this.typingDone) {
        this.revealTyping();
        return;
      }
      this.showChoices(mission);
    }, { color: 0x287a81, fontSize: 16 });

    this.missionIntroObjects.push(button.bg, button.txt);

    // Clickable dialogue area
    const zone = this.add.zone(160, 570, 835, 96)
      .setOrigin(0)
      .setDepth(15)
      .setInteractive()
      .on('pointerdown', () => this.revealTyping());

    this.missionIntroObjects.push(zone);
  }

  showChoices(mission) {
    if (this.phase === 'choices' || this.phase === 'consequence' || this.phase === 'science') return;
    // Remove the previous mission introduction
    this.missionIntroObjects?.forEach(object => object.destroy());
    this.missionIntroObjects = [];
    this.audio.stopVoice();
    this.phase = 'choices';
    this.choiceOverlay = this.add.container(0, 0).setDepth(16);
    const backing = this.add.graphics();
    backing.fillStyle(0x111c37, 0.96).fillRoundedRect(151, 501, 978, 191, 22);
    backing.lineStyle(1.5, 0x6e8eb2, 0.7).strokeRoundedRect(151, 501, 978, 191, 22);
    this.choiceOverlay.add(backing);
    const q = this.text(182, 518, mission.question, 19, '#88e6eb', { fontStyle: 'bold' }); this.choiceOverlay.add(q);
    mission.choices.forEach((choice, index) => {
      const x = 181 + index * 471;
      const y = 555;
      const bg = this.add.graphics();
      const paint = (hover = false) => {
        bg.clear().fillStyle(index === 0 ? 0x274869 : 0x2d4a57).fillRoundedRect(x, y, 437, 100, 15);
        if (hover) bg.fillStyle(0xffffff, 0.09).fillRoundedRect(x, y, 437, 100, 15);
        bg.lineStyle(1.3, index === 0 ? 0x75c1dd : 0x82d1ae, 0.75).strokeRoundedRect(x, y, 437, 100, 15);
      };
      paint(); this.choiceOverlay.add(bg);
      const letter = this.text(x + 18, y + 13, `OPTION ${index ? 'B' : 'A'}`, 11, index ? '#a9e6be' : '#a9ddf4', { fontStyle: 'bold', letterSpacing: 1 }); this.choiceOverlay.add(letter);
      const label = this.text(x + 18, y + 35, choice.label, 16, '#fff5df', { fontStyle: 'bold', wordWrap: { width: 395 }, lineSpacing: 2 }); this.choiceOverlay.add(label);
      bg.setInteractive(new Phaser.Geom.Rectangle(x, y, 437, 100), Phaser.Geom.Rectangle.Contains)
        .on('pointerover', () => paint(true)).on('pointerout', () => paint())
        .on('pointerup', () => this.selectChoice(index));
    });
  }

  selectChoice(index) {
    if (this.phase !== 'choices' || this.selectedMission === this.missionIndex) return;
    this.selectedMission = this.missionIndex;
    const mission = MISSIONS[this.missionIndex]; const choice = mission.choices[index];
    const value = this.resources.deduct(choice.resource, 15);
    this.resourceDisplay.update(this.resources.snapshot());
    this.showConsequence(mission, choice, value);
  }

  showConsequence(mission, choice, value) {
    this.phase = 'consequence';
    this.choiceOverlay?.destroy();

    // Track all Decision Log elements
    this.consequenceObjects = [];

    // Decision Log panel
    const panel = this.panel(206, 196, 868, 365, 0.98);
    this.consequenceObjects.push(panel);

    // ASTRO portrait
    const portrait = drawPortrait(this, 310, 336, 'ASTRO', 1.05);
    this.consequenceObjects.push(portrait);

    // Decision Log heading
    const heading = this.text(
      385, 234, 'DECISION LOG', 13, '#83e5eb',
      { fontStyle: 'bold', letterSpacing: 2 }
    );
    this.consequenceObjects.push(heading);

    // Outcome explanation
    const outcome = this.text(
      385, 265, '', 20, '#fff5df',
      { wordWrap: { width: 625 }, lineSpacing: 7 }
    );
    this.consequenceObjects.push(outcome);

    // Play voice-over and synchronise the typewriter effect
    const voice = this.audio.playVoice(choice.voiceKey);
    this.typeText(outcome, choice.outcome, voice?.duration);

    const info = RESOURCE_INFO[choice.resource];

    // Resource change
    const change = this.text(
      385, 391, `${info.icon}  ${choice.change}`,
      20, '#ffc978', { fontStyle: 'bold' }
    );
    this.consequenceObjects.push(change);

    // Remaining resource value
    const remaining = this.text(
      385, 432, `${info.label}: ${value}%`,
      16, '#bbd4e4'
    );
    this.consequenceObjects.push(remaining);

    // Science Lesson button
    const button = this.button(
      816, 490, 210, 48, 'SCIENCE LESSON  →',
      () => this.showScience(mission),
      { color: 0x287a81, fontSize: 15 }
    );

    this.consequenceObjects.push(button.bg, button.txt);
  }


  showScience(mission) {
    this.phase = 'science';
    // Remove the previous Decision Log screen
    this.consequenceObjects?.forEach(object => object.destroy());
    this.consequenceObjects = [];
    this.audio.stopVoice();
    this.panel(178, 128, 924, 470, 0.98);
    this.text(230, 170, 'MISSION SCIENCE', 14, '#82e6ec', { fontStyle: 'bold', letterSpacing: 2 });
    this.text(230, 205, 'A little science for the journey', 29, '#fff5df', { fontStyle: 'bold' });
    this.text(230, 273, mission.science, 21, '#d8e4f0', { wordWrap: { width: 820 }, lineSpacing: 9 });
    this.text(230, 405, 'LEARN MORE', 12, '#82e6ec', { fontStyle: 'bold', letterSpacing: 2 });
    mission.sources.forEach((source, i) => {
      const link = this.text(230, 433 + i * 25, `↗  ${source.label}`, 16, '#9fd9ff', { fontStyle: 'bold' }).setInteractive({ useHandCursor: true });
      link.on('pointerover', () => link.setColor('#ffffff')).on('pointerout', () => link.setColor('#9fd9ff'));
      link.on('pointerdown', () => window.open(source.url, '_blank', 'noopener,noreferrer'));
    });
    const final = this.missionIndex === MISSIONS.length - 1;
    this.button(820, 526, 229, 52, final ? 'MISSION REPORT  →' : 'NEXT MISSION  →', () => {
      if (final) this.showFinal(); else { this.missionIndex++; this.startMission(this.missionIndex); }
    }, { color: 0x287a81, fontSize: 17 });
  }

  showPause() {
    if (this.phase === 'paused') return;
    this.pausedPhase = this.phase; this.phase = 'paused';
    this.pauseOverlay = this.add.container(0, 0).setDepth(80);
    const shade = this.add.rectangle(W / 2, H / 2, W, H, 0x080f23, 0.72);
    this.pauseOverlay.add(shade);
    const p = this.panel(405, 154, 470, 430, 1); this.pauseOverlay.add(p);
    const title = this.text(640, 196, 'MISSION PAUSED', 28, '#8ae5eb', { fontStyle: 'bold' }).setOrigin(0.5); this.pauseOverlay.add(title);
    const resume = this.button(507, 247, 266, 52, 'RESUME MISSION', () => { this.pauseOverlay.destroy(); this.phase = this.pausedPhase; }, { color: 0x287a81, fontSize: 17 });
    const toggles = [
      { y: 314, label: () => `VOICE ${this.audio.voiceEnabled ? 'ON' : 'OFF'}`, flip: () => this.audio.setVoiceEnabled(!this.audio.voiceEnabled) },
      { y: 374, label: () => `MUSIC ${this.audio.musicEnabled ? 'ON' : 'OFF'}`, flip: () => this.audio.setMusicEnabled(!this.audio.musicEnabled) },
      { y: 434, label: () => `SOUND EFFECTS ${this.audio.effectsEnabled ? 'ON' : 'OFF'}`, flip: () => { this.audio.effectsEnabled = !this.audio.effectsEnabled; } },
    ];
    const toggleButtons = toggles.map(toggle => this.button(507, toggle.y, 266, 44, toggle.label(), () => {
      toggle.flip(); this.pauseOverlay.destroy(); this.phase = this.pausedPhase; this.showPause();
    }, { color: 0x293e68, stroke: 0x80a9dc, fontSize: 14 }));
    const menu = this.button(507, 493, 266, 48, 'MAIN MENU', () => { this.pauseOverlay.destroy(); this.showMenu(); }, { color: 0x293e68, stroke: 0x80a9dc, fontSize: 16 });
    this.pauseOverlay.add([resume.bg, resume.txt, menu.bg, menu.txt, ...toggleButtons.flatMap(b => [b.bg, b.txt])]);
  }

  showFinal() {
    this.showStory('finalStory', [
      {
        who: 'ASTRO',
        text: "Commander, we did it! All three missions are complete! You've helped protect our astronauts, manage our electricity and save our greenhouse!",
        voiceKey: 'astro12'
      },
      {
        who: 'JUNIOR COMMANDER',
        text: 'We make a great team, ASTRO!'
      },
      {
        who: 'ASTRO',
        text: 'Absolutely! Remember, every resource is important, and every decision has consequences. Great work, Commander!',
        voiceKey: 'astro13'
      },
    ], () => this.showFinalReport(), 'MISSION COMPLETED!');
  }

  showFinalReport() {
    this.baseScreen(); this.phase = 'final';
    const values = this.resources.snapshot();
    this.panel(156, 64, 968, 592, 0.96);
    this.drawCelebration();
    drawPortrait(this, 300, 165, 'ASTRO', 1.0).setDepth(1);
    this.text(370, 102, 'MISSION COMPLETED!', 30, '#9be8b2', { fontStyle: 'bold', letterSpacing: 2 });
    // ASTRO14 final congratulations
    const finalMessage = this.text(370, 150, '', 18, '#fff5df', {wordWrap: { width: 700 }, lineSpacing: 6});
    const voice = this.audio.playVoice('astro14');
    this.typeText(finalMessage, 'Congratulations, Commander! You have completed all three Mars missions and kept the base operational.', voice?.duration);
    this.text(228, 270, 'FINAL RESOURCE REPORT', 14, '#82e6eb', { fontStyle: 'bold', letterSpacing: 2 });
    const resourceRows = Object.entries(RESOURCE_INFO);
    resourceRows.forEach(([key, info], index) => {
      const y = 310 + index * 55;
      this.text(232, y, `${info.icon}  ${info.label}`, 17, '#e5eef5', { fontStyle: 'bold' });
      const bar = this.add.graphics();
      bar.fillStyle(0xffffff, 0.12).fillRoundedRect(431, y + 5, 376, 17, 8);
      bar.fillStyle(info.color, 1).fillRoundedRect(431, y + 5, 376 * values[key] / 100, 17, 8);
      this.text(839, y, `${values[key]}%`, 18, '#fff5df', { fontStyle: 'bold' });
    });
    this.text(228, 490, 'Thank you for exploring Mars with ASTRO!', 18, '#cbdbe8');
    this.button(818, 585, 144, 48, 'PLAY AGAIN', () => this.showPrologue(), { color: 0x287a81, fontSize: 14 });
    this.button(973, 585, 126, 48, 'MAIN MENU', () => this.showMenu(), { color: 0x293e68, stroke: 0x80a9dc, fontSize: 14 });
    this.time.delayedCall(1000, () => { if (this.phase === 'final') this.drawCelebration(true); });
  }

  drawCelebration(extra = false) {
    const g = this.add.graphics().setDepth(30);
    const count = extra ? 18 : 26;
    for (let i = 0; i < count; i++) {
      const c = [0x71e5ef, 0xffc866, 0x92e7a7, 0xff9b67][i % 4];
      const x = 190 + (i * 79) % 900, y = 72 + (i * 47) % 160;
      const bit = this.add.rectangle(x, y, 7, 12, c).setDepth(31);
      bit.setRotation(i * 0.7);
      this.tweens.add({ targets: bit, y: y + Phaser.Math.Between(18, 55), angle: bit.angle + 135, alpha: 0.15, duration: 800 + i * 27, delay: i * 14, onComplete: () => bit.destroy() });
    }
    g.destroy();
  }
}
