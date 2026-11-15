/** Optional audio registry. Missing recordings are silently skipped. */
export class AudioManager {
  constructor(scene) {
    this.scene = scene;
    this.musicEnabled = true;
    this.effectsEnabled = true;
    this.voiceEnabled = true;
    this.currentVoice = null;
    this.music = null;
  }

  playVoice(key) {
    this.stopVoice();

    if (
      !this.voiceEnabled ||
      !key ||
      !this.scene.cache.audio.exists(key)
    ) {
      return null;
    }

    const voice = this.scene.sound.add(key);
    this.currentVoice = voice;

    voice.once('complete', () => {
      if (this.currentVoice === voice) {
        this.currentVoice = null;
      }
    });

    voice.play();

    return voice;
  }

  /** Register supplied recordings with Phaser's loader. Empty paths are ignored. */
  preload(manifest) {
    for (const [key, path] of Object.entries(manifest)) {
      if (typeof path === 'string' && path.length) this.scene.load.audio(key, path);
    }
  }

  stopVoice() {
    if (this.currentVoice) this.currentVoice.stop();
    this.currentVoice?.destroy();
    this.currentVoice = null;
  }

  setVoiceEnabled(enabled) {
    this.voiceEnabled = enabled;
    if (!enabled) this.stopVoice();
  }

  playEffect(key) {
    if (this.effectsEnabled && this.scene.cache.audio.exists(key)) this.scene.sound.play(key);
  }

  playMusic(key, { loop = true, volume = 0.35 } = {}) {
    if (!this.scene.cache.audio.exists(key)) return null;
    if (this.music) { this.music.stop(); this.music.destroy(); }
    this.music = this.scene.sound.add(key, { loop, volume });
    if (this.musicEnabled) this.music.play();
    return this.music;
  }

  setMusicEnabled(enabled) {
    this.musicEnabled = enabled;
    if (!enabled && this.music?.isPlaying) this.music.pause();
    if (enabled && this.music?.isPaused) this.music.resume();
  }
}
