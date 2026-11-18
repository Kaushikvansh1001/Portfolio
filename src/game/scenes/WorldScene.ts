import Phaser from "phaser";
import { profile } from "@/data/profile";
import { freelancePortfolios } from "@/data/projects";
import { boulevardNpcs, locations, WORLD, type ClientId, type LocationId } from "@/data/world";
import { HERO_SHEET } from "../heroSheet";
import { NPC_SHEETS } from "../npcSheets";
import { BASE, FEATURES, groundAt, kindAt, slopeAt } from "../terrain";
import { SCALE } from "../scale";
import { gameApi, gameBus } from "../events";

const WALK_SPEED = SCALE.walkSpeed;
const RUN_SPEED = SCALE.runSpeed;
const GOLD = 0xc5a15b;
const TEAL = 0x55c9b5;
const VOID = 0x151719;
const PLAYER_HEIGHT = SCALE.playerHeight;
const NPC_HEIGHT = SCALE.npcHeight;
const NPC_STAND_OFF = 86;

function reachOf(width: number) {
  return Math.max(width * 0.5, 168);
}

const DEPTH = {
  sky: 0,
  stars: 1,
  mountains: 2,
  clouds: 3,
  forest: 4,
  water: 5,
  soil: 5.1,
  mid: 5.4,
  path: 6,
  edge: 6.3,
  structure: 6.7,
  glow: 7,
  building: 8,
  lamp: 9,
  shadow: 9.6,
  npc: 10,
  player: 11,
  label: 13,
  dim: 20,
};

const buildings = locations.filter((location): location is (typeof locations)[number] & { art: string } =>
  Boolean("art" in location && location.art),
);

type AnimState = "idle" | "walk" | "interact";

export class WorldScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Sprite;
  private shadow!: Phaser.GameObjects.Ellipse;
  private dim!: Phaser.GameObjects.Rectangle;
  private clouds!: Phaser.GameObjects.Image;
  private mountains!: Phaser.GameObjects.Image;
  private skyFade!: Phaser.GameObjects.Graphics;
  private trees!: Phaser.GameObjects.TileSprite;
  private walkVx = 0;
  private viewW = 0;
  private viewH = 0;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: Record<"A" | "D", Phaser.Input.Keyboard.Key>;
  private shift?: Phaser.Input.Keyboard.Key;
  private targetX: number | null = null;
  private near: LocationId | null = null;
  private focused: LocationId | null = null;
  private pendingOpen: LocationId | null = null;
  private pendingClient: ClientId | null = null;
  private nearNpc: ClientId | null = null;
  private focusedClient: ClientId | null = null;
  private animState: AnimState | null = null;
  private lastProgress = -1;
  private reduced = false;
  private markers: Phaser.GameObjects.Image[] = [];
  private labels: Phaser.GameObjects.Text[] = [];
  private glows: Phaser.GameObjects.Ellipse[] = [];
  private windows: Phaser.GameObjects.Ellipse[][] = [];
  private lightTweens: Phaser.Tweens.Tween[] = [];
  private npcs: Phaser.GameObjects.Sprite[] = [];
  private npcLabels: Phaser.GameObjects.Text[] = [];
  private npcGlows: Phaser.GameObjects.Ellipse[] = [];
  private npcShadows: Phaser.GameObjects.Ellipse[] = [];
  private playerScale = 1;
  private water?: Phaser.GameObjects.Image;
  private greeting?: Phaser.GameObjects.Container;
  private greetingGone = false;
  private lastAnchorKey = "";
  private tick = 0;
  private holdDir: -1 | 0 | 1 = 0;
  private readonly spawnX = 420;

  constructor() {
    super("world");
  }

  preload() {
    this.load.spritesheet("hero", "/vanshverse/hero-v4.png?v=paint2", {
      frameWidth: HERO_SHEET.frameWidth,
      frameHeight: HERO_SHEET.frameHeight,
      spacing: 0,
      margin: 0,
    });
    this.load.image("mountains", "/vanshverse/layer-mountains.jpg");
    this.load.image("trees", "/vanshverse/layer-trees.webp");
    this.load.image("clouds", "/vanshverse/layer-clouds.webp");
    this.load.image("sign-boulevard", "/vanshverse/sign-boulevard.webp");
    this.load.image("prop-lantern", "/vanshverse/prop-lantern.webp");
    this.load.image("prop-cobble", "/vanshverse/prop-cobble.webp");
    this.load.image("prop-bridge", "/vanshverse/prop-bridge.webp");
    this.load.image("prop-arch", "/vanshverse/prop-arch.webp");
    this.load.image("prop-water", "/vanshverse/prop-water.webp");
    this.load.image("prop-signpost", "/vanshverse/prop-signpost.webp");
    this.load.image("prop-rock", "/vanshverse/prop-rock.webp");
    this.load.image("prop-grass", "/vanshverse/prop-grass.webp");
    this.load.image("prop-barrel", "/vanshverse/prop-barrel.webp");
    this.load.image("prop-bench", "/vanshverse/prop-bench.webp");
    this.load.spritesheet("npc-priya", "/vanshverse/npc-priya.png?v=paint4", {
      frameWidth: NPC_SHEETS.priya.frameWidth,
      frameHeight: NPC_SHEETS.priya.frameHeight,
    });
    this.load.spritesheet("npc-radhika", "/vanshverse/npc-radhika.png?v=paint4", {
      frameWidth: NPC_SHEETS.radhika.frameWidth,
      frameHeight: NPC_SHEETS.radhika.frameHeight,
    });
    for (const location of buildings) {
      const bust = location.id === "career" || location.id === "lab" ? "?v=clear2" : "";
      this.load.image(location.id, `${location.art}${bust}`);
    }
  }

  create() {
    const { width, height } = WORLD;
    this.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    for (const key of ["hero", "npc-priya", "npc-radhika", ...buildings.map((item) => item.id)]) {
      this.textures.get(key)?.setFilter(Phaser.Textures.FilterMode.LINEAR);
    }

    this.mountains = this.add
      .image(0, 0, "mountains")
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setDepth(DEPTH.mountains)
      .setAlpha(0.92);
    this.skyFade = this.add.graphics().setScrollFactor(0).setDepth(DEPTH.mountains + 0.2);
    this.clouds = this.add
      .image(0, 8, "clouds")
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setDepth(DEPTH.clouds)
      .setAlpha(0.55);
    this.addStars();
    this.add
      .rectangle(0, BASE - 90, width, height - (BASE - 90), 0x1a1714)
      .setOrigin(0)
      .setDepth(DEPTH.forest - 0.2);
    this.trees = this.add
      .tileSprite(0, BASE - 52, WORLD.width, 176, "trees")
      .setOrigin(0, 1)
      .setScrollFactor(0.32)
      .setDepth(DEPTH.forest)
      .setAlpha(0.78);

    this.addTerrain();

    buildings.forEach((location, index) => {
      const gy = groundAt(location.x);
      const glow = this.add
        .ellipse(location.x, gy + 2, location.width * 0.72, 18, GOLD, 0.2)
        .setDepth(DEPTH.glow);
      this.glows.push(glow);

      const image = this.add.image(location.x, gy, location.id).setOrigin(0.5, 1).setDepth(DEPTH.building);
      const ratio = image.height / Math.max(image.width, 1);
      const w = location.width;
      const h = w * ratio;
      image.setDisplaySize(w, h);
      image.setInteractive({ useHandCursor: true });
      image.on("pointerover", () => this.hoverBuilding(index, true));
      image.on("pointerout", () => this.hoverBuilding(index, false));
      image.on("pointerup", () => this.approach(location.id, true));
      this.markers.push(image);

      const windowLights: Phaser.GameObjects.Ellipse[] = [];
      const spots = [
        { x: -0.18, y: 0.42, w: 10, h: 14 },
        { x: 0.16, y: 0.42, w: 10, h: 14 },
        { x: 0, y: 0.62, w: 12, h: 16 },
      ];
      const lampColor = location.id === "lab" ? TEAL : GOLD;
      spots.forEach((spot) => {
        const light = this.add
          .ellipse(
            location.x + location.width * spot.x,
            gy - image.displayHeight * spot.y,
            spot.w,
            spot.h,
            lampColor,
            location.id === "lab" ? 0.55 : 0.42,
          )
          .setDepth(DEPTH.lamp);
        windowLights.push(light);
        if (!this.reduced && windowLights.length === 1) {
          this.lightTweens.push(
            this.tweens.add({
              targets: light,
              alpha: 0.16,
              duration: 1800 + index * 160,
              yoyo: true,
              repeat: -1,
              ease: "Sine.easeInOut",
            }),
          );
        }
      });
      this.windows.push(windowLights);

      const label = this.add
        .text(location.x + w * 0.46, gy - 28, location.name.toUpperCase(), {
          fontFamily: "monospace",
          fontSize: "11px",
          color: "#E8DDC8",
          backgroundColor: "#151719cc",
          padding: { x: 7, y: 3 },
        })
        .setOrigin(0, 1)
        .setAlpha(0)
        .setDepth(DEPTH.label);
      this.labels.push(label);
    });

    this.shadow = this.add.ellipse(420, groundAt(420) + 2, 58, 16, 0x0b0c0d, 0.42).setDepth(DEPTH.shadow);

    this.createHeroAnims();
    this.player = this.add.sprite(420, groundAt(420), "hero", 0);
    this.player.setOrigin(0.5, 1);
    this.playerScale = PLAYER_HEIGHT / HERO_SHEET.frameHeight;
    this.player.setScale(this.playerScale);
    this.player.setDepth(DEPTH.player);
    this.playAnim("idle", true);
    this.breathe(this.player, this.playerScale);
    this.addGreeting();
    this.addBoulevard();

    this.addFireflies();
    this.addChimneySmoke();

    this.dim = this.add
      .rectangle(0, 0, this.scale.width, this.scale.height, VOID, 0.46)
      .setOrigin(0)
      .setScrollFactor(0)
      .setDepth(DEPTH.dim)
      .setAlpha(0)
      .setVisible(false);

    this.cameras.main.setBounds(0, 0, width, height);
    this.cameras.main.setBackgroundColor(VOID);
    this.layoutSky();
    this.followWalker();
    this.scale.on("resize", this.onResize, this);

    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
      this.wasd = {
        A: this.input.keyboard.addKey("A"),
        D: this.input.keyboard.addKey("D"),
      };
      this.shift = this.input.keyboard.addKey("SHIFT");
    }

    this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      if (this.focused || this.focusedClient) return;
      if (pointer.y > this.scale.height * 0.84) return;
      const hits = this.input.hitTestPointer(pointer);
      if (
        hits.some(
          (object) =>
            this.npcs.includes(object as Phaser.GameObjects.Sprite) ||
            this.markers.includes(object as Phaser.GameObjects.Image),
        )
      ) {
        return;
      }
      this.pendingOpen = null;
      this.pendingClient = null;
      const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
      this.targetX = Phaser.Math.Clamp(worldPoint.x, 120, width - 120);
    });

    gameApi.travelTo = (id) => this.approach(id, id !== "clients");
    gameApi.teleportTo = (id) => this.teleport(id);
    gameApi.focusLocation = (id) => this.focus(id);
    gameApi.focusClient = (id) => this.focusClient(id);
    gameApi.clearFocus = () => this.clearFocus();
    gameApi.openNear = () => this.openNear();
    gameApi.holdMove = (dir) => {
      this.holdDir = dir;
      if (dir === 0) return;
      this.targetX = null;
      this.pendingOpen = null;
      this.pendingClient = null;
    };
    gameBus.emit("game-ready", true);
    this.lastProgress = Phaser.Math.Clamp(this.player.x / WORLD.width, 0, 1);
    gameBus.emit("player-progress", this.lastProgress);
    (window as Window & { __world?: WorldScene }).__world = this;

    const onVis = () => {
      if (!this.sys?.isActive()) return;
      this.pauseAmbience(document.hidden);
    };
    document.addEventListener("visibilitychange", onVis);
    const dropVis = () => document.removeEventListener("visibilitychange", onVis);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      dropVis();
      this.scale.off("resize", this.onResize, this);
    });
    this.events.once(Phaser.Scenes.Events.DESTROY, dropVis);
  }

  update(time: number, delta: number) {
    this.tickNpcs(time);
    const dt = Math.min(delta, 33) / 1000;
    if (this.focused || this.focusedClient) {
      this.holdDir = 0;
      this.walkVx = 0;
      this.player.y = groundAt(this.player.x);
      this.shadow.setPosition(this.player.x, this.player.y + 3);
      this.dismissGreeting();
      return;
    }

    const left = Boolean(this.cursors?.left.isDown || this.wasd?.A.isDown || this.holdDir < 0);
    const right = Boolean(this.cursors?.right.isDown || this.wasd?.D.isDown || this.holdDir > 0);
    const running = Boolean(this.shift?.isDown);
    const grade = slopeAt(this.player.x);
    const speed = (running ? RUN_SPEED : WALK_SPEED) * (grade > 0.14 ? 0.7 : 1);
    let vx = 0;
    let wantMove = false;

    if (left) {
      vx = -speed;
      wantMove = true;
      this.targetX = null;
      this.pendingOpen = null;
      this.pendingClient = null;
    } else if (right) {
      vx = speed;
      wantMove = true;
      this.targetX = null;
      this.pendingOpen = null;
      this.pendingClient = null;
    } else if (this.targetX !== null) {
      const deltaX = this.targetX - this.player.x;
      if (Math.abs(deltaX) < 8) this.targetX = null;
      else {
        vx = Math.sign(deltaX) * speed;
        wantMove = true;
      }
    }

    this.walkVx = vx;
    this.player.x = Phaser.Math.Clamp(this.player.x + this.walkVx * dt, 120, WORLD.width - 120);
    const feet = groundAt(this.player.x);
    this.player.y = feet;
    this.tick += 1;
    this.emitHudAnchor();
    if (wantMove && vx !== 0) {
      const flip = vx < 0;
      const restart = this.animState !== "walk" || this.player.flipX !== flip;
      this.player.setFlipX(flip);
      this.playAnim("walk", restart);
      this.player.anims.timeScale = running ? 1.28 : 1;
    } else if (this.animState !== "idle") {
      this.playAnim("idle", true);
      this.player.anims.timeScale = 1;
    }

    this.shadow.setPosition(this.player.x, feet + 3);
    this.shadow.setScale(this.animState === "walk" ? 1.08 : 1);
    this.syncGreeting();

    const progress = Phaser.Math.Clamp(this.player.x / WORLD.width, 0, 1);
    if (Math.abs(progress - this.lastProgress) > 0.01) {
      this.lastProgress = progress;
      gameBus.emit("player-progress", progress);
    }

    const next = this.nearestLocation(this.player.x, this.near);
    if (next !== this.near) {
      this.near = next;
      gameBus.emit("location-near", next);
      this.refreshPresence();
      this.emitHudAnchor();
    }

    const nextNpc = this.near === "clients" ? this.nearestClient(this.player.x, this.nearNpc) : null;
    if (nextNpc !== this.nearNpc) {
      this.nearNpc = nextNpc;
      gameBus.emit("npc-near", nextNpc);
      this.refreshNpcs();
      this.emitHudAnchor();
    }

    if (this.pendingClient) {
      const npc = boulevardNpcs.find((item) => item.id === this.pendingClient);
      if (npc && Math.abs(this.player.x - this.standOffX(npc.x)) < 16) {
        const id = this.pendingClient;
        this.pendingClient = null;
        this.playAnim("interact", true);
        gameBus.emit("client-open", id);
      }
    }

    if (this.pendingOpen) {
      const loc = locations.find((item) => item.id === this.pendingOpen);
      if (loc && this.inReach(loc)) {
        const id = this.pendingOpen;
        this.pendingOpen = null;
        this.openLocation(id);
      }
    }
  }

  private createHeroAnims() {
    for (const key of ["idle", "walk", "interact"]) {
      if (this.anims.exists(key)) this.anims.remove(key);
    }

    this.anims.create({
      key: "idle",
      frames: this.anims.generateFrameNumbers("hero", { frames: [...HERO_SHEET.idle] }),
      frameRate: 1.6,
      repeat: -1,
      yoyo: true,
    });
    this.anims.create({
      key: "walk",
      frames: this.anims.generateFrameNumbers("hero", { frames: [...HERO_SHEET.walk] }),
      frameRate: 8,
      repeat: -1,
      skipMissedFrames: false,
    });
    this.anims.create({
      key: "interact",
      frames: this.anims.generateFrameNumbers("hero", { frames: [...HERO_SHEET.interact] }),
      frameRate: 6,
      repeat: 0,
    });
  }

  private breathe(sprite: Phaser.GameObjects.Sprite, baseScale: number) {
    if (this.reduced) return;
    this.tweens.add({
      targets: sprite,
      scaleY: baseScale * 1.03,
      duration: 2100,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
  }

  private tickNpcs(time: number) {
    this.npcs.forEach((sprite, index) => {
      const sheet = boulevardNpcs[index]?.sheet;
      if (!sheet) return;
      const base = NPC_HEIGHT / NPC_SHEETS[sheet].frameHeight;
      sprite.setScale(base);
      sprite.setAngle(0);
      if (this.reduced) {
        sprite.setFrame(0);
        return;
      }
      if (sprite.anims.isPlaying) sprite.anims.stop();
      const cycle = (time / 1000 + index * 2.4) % 5.4;
      let frame = 0;
      if (cycle < 1.35) frame = 0;
      else if (cycle < 3.35) frame = 1;
      else if (cycle < 5.05) frame = 2;
      else frame = 3;
      sprite.setFrame(frame);
    });
  }

  private playAnim(next: AnimState, force = false) {
    const anims = this.player?.anims;
    if (!anims) return;
    this.animState = next;
    const currentKey = anims.currentAnim?.key;
    if (!force && currentKey === next) {
      if (!anims.isPlaying) anims.restart();
      return;
    }
    if (this.anims.exists(next)) anims.play(next, true);
  }

  private greetingHeadY() {
    return this.player.y - PLAYER_HEIGHT - 10;
  }

  private addGreeting() {
    const boxW = 276;
    const title = this.add
      .text(0, 0, `Hey, I'm ${profile.name}`, {
        fontFamily: "Cormorant Garamond, Palatino Linotype, serif",
        fontSize: "18px",
        color: "#E8DDC8",
        align: "center",
      })
      .setOrigin(0.5, 0);
    const line = this.add
      .text(0, 0, "Let me walk you through my verse.", {
        fontFamily: "Sora, Segoe UI, sans-serif",
        fontSize: "12px",
        color: "#C9C0AE",
        align: "center",
        wordWrap: { width: boxW - 32 },
      })
      .setOrigin(0.5, 0);

    const pad = 12;
    const gap = 5;
    const boxH = pad + title.height + gap + line.height + pad;
    const boxY = -boxH - 10;
    title.y = boxY + pad;
    line.y = title.y + title.height + gap;

    const g = this.add.graphics();
    g.fillStyle(0x1a1c1e, 0.96);
    g.fillRoundedRect(-boxW / 2, boxY, boxW, boxH, 12);
    g.lineStyle(1.5, GOLD, 0.95);
    g.strokeRoundedRect(-boxW / 2, boxY, boxW, boxH, 12);
    g.fillStyle(0x1a1c1e, 0.96);
    g.fillRect(-9, -13, 18, 5);
    g.fillTriangle(-8, -10, 8, -10, 0, 4);
    g.lineStyle(1.5, GOLD, 0.95);
    g.beginPath();
    g.moveTo(-8, -10);
    g.lineTo(0, 4);
    g.moveTo(8, -10);
    g.lineTo(0, 4);
    g.strokePath();

    this.greeting = this.add.container(this.player.x, this.greetingHeadY(), [g, title, line]);
    this.greeting.setDepth(DEPTH.label);
    this.greeting.setAlpha(0);
    if (this.reduced) {
      this.greeting.setAlpha(1);
      return;
    }
    this.tweens.add({
      targets: this.greeting,
      alpha: 1,
      y: this.greetingHeadY() - 6,
      duration: 420,
      delay: 240,
      ease: "Sine.easeOut",
    });
  }

  private syncGreeting() {
    if (!this.greeting || this.greetingGone) return;
    this.greeting.x = this.player.x;
    if (this.greeting.alpha >= 1) this.greeting.y = this.greetingHeadY() - 6;
    if (Math.abs(this.player.x - this.spawnX) > 72) this.dismissGreeting();
  }

  private dismissGreeting() {
    if (!this.greeting || this.greetingGone) return;
    this.greetingGone = true;
    const bubble = this.greeting;
    this.tweens.add({
      targets: bubble,
      alpha: 0,
      y: this.greetingHeadY() - 18,
      duration: this.reduced ? 0 : 220,
      onComplete: () => {
        bubble.destroy(true);
        if (this.greeting === bubble) this.greeting = undefined;
      },
    });
  }

  private hoverBuilding(index: number, on: boolean) {
    if (this.focused) return;
    const nearHere = buildings[index].id === this.near;
    this.markers[index].setTint(on || nearHere ? 0xffe7c2 : 0xffffff);
    this.glows[index].setAlpha(on ? 0.5 : nearHere ? 0.4 : 0.18);
    this.setWindows(index, on || nearHere);
    if (!nearHere) {
      this.tweens.add({
        targets: this.labels[index],
        alpha: on ? 1 : 0,
        duration: this.reduced ? 0 : 150,
      });
    }
  }

  private refreshPresence() {
    this.labels.forEach((label, index) => {
      const active = buildings[index].id === this.near || buildings[index].id === this.focused;
      this.tweens.add({ targets: label, alpha: active ? 1 : 0, duration: this.reduced ? 0 : 160 });
      if (!this.focused && !this.focusedClient) {
        const nearHere = buildings[index].id === this.near;
        this.markers[index].setTint(nearHere ? 0xffe7c2 : 0xffffff);
        this.setWindows(index, nearHere);
        if (nearHere) {
          this.glows[index].setAlpha(0.7);
          this.tweens.add({
            targets: this.glows[index],
            alpha: 0.42,
            duration: this.reduced ? 0 : 520,
            ease: "Sine.easeOut",
          });
        } else {
          this.glows[index].setAlpha(0.18);
        }
      }
    });
  }

  private setWindows(index: number, bright: boolean) {
    this.windows[index]?.forEach((light) => light.setScale(bright ? 1.25 : 1));
  }

  private teleport(id: LocationId) {
    const location = locations.find((item) => item.id === id);
    if (!location) return;
    this.pendingOpen = null;
    this.pendingClient = null;
    this.targetX = null;
    this.dismissGreeting();
    this.player.x = location.x;
    this.player.y = groundAt(location.x);
    this.shadow.setPosition(this.player.x, this.player.y + 3);
    this.playAnim("idle", true);
    this.cameras.main.stopFollow();
    this.cameras.main.centerOn(this.player.x, this.player.y);
    this.followWalker();
    this.near = id;
    this.nearNpc = id === "clients" ? this.nearestClient(location.x, null) : null;
    this.lastAnchorKey = "";
    gameBus.emit("world-jump", id);
    gameBus.emit("location-near", this.near);
    gameBus.emit("npc-near", this.nearNpc);
    this.refreshPresence();
    this.refreshNpcs();
    this.emitHudAnchor();
  }

  private inReach(location: { x: number; width: number }, x = this.player.x) {
    return Math.abs(x - location.x) < reachOf(location.width);
  }

  private nearestLocation(x: number, current: LocationId | null): LocationId | null {
    let best: (typeof locations)[number] | null = null;
    let bestDist = Infinity;
    for (const location of locations) {
      const dist = Math.abs(x - location.x);
      const reach = reachOf(location.width);
      const hold = current === location.id ? reach * 1.22 : reach;
      if (dist < hold && dist < bestDist) {
        best = location;
        bestDist = dist;
      }
    }
    return best?.id ?? null;
  }

  private openLocation(id: LocationId) {
    if (this.focused || this.focusedClient) return;
    if (id === "clients") {
      this.approachNpc(this.nearestClient(this.player.x, this.nearNpc), true);
      return;
    }
    this.pendingOpen = null;
    this.pendingClient = null;
    this.targetX = null;
    this.playAnim("interact", true);
    gameBus.emit("location-open", id);
  }

  private approach(id: LocationId, open: boolean) {
    const location = locations.find((item) => item.id === id);
    if (!location) return;
    if (open && this.inReach(location)) {
      this.openLocation(id);
      return;
    }
    this.targetX = location.x;
    this.pendingOpen = open && id !== "clients" ? id : null;
  }

  private approachNpc(id: ClientId, open: boolean) {
    const npc = boulevardNpcs.find((item) => item.id === id);
    if (!npc) return;
    if (open) {
      if (this.focused || this.focusedClient) return;
      this.pendingClient = null;
      this.targetX = null;
      this.playAnim("interact", true);
      gameBus.emit("client-open", id);
      return;
    }
    this.targetX = this.standOffX(npc.x);
  }

  private nearestClient(x: number, current: ClientId | null): ClientId {
    let best = boulevardNpcs[0];
    let bestDist = Math.abs(x - best.x);
    for (const npc of boulevardNpcs) {
      const dist = Math.abs(x - npc.x);
      if (dist < bestDist) {
        best = npc;
        bestDist = dist;
      }
    }
    if (current) {
      const held = boulevardNpcs.find((item) => item.id === current);
      if (held && Math.abs(x - held.x) <= bestDist + 48) return current;
    }
    return best.id;
  }

  private standOffX(npcX: number) {
    const side = this.player.x >= npcX ? 1 : -1;
    return Phaser.Math.Clamp(npcX + side * NPC_STAND_OFF, 120, WORLD.width - 120);
  }

  private openNear() {
    if (this.focused || this.focusedClient) return;
    if (this.nearNpc) {
      this.approachNpc(this.nearNpc, true);
      return;
    }
    if (this.near) this.openLocation(this.near);
  }

  private focus(id: LocationId) {
    const location = locations.find((item) => item.id === id);
    if (!location) return;
    this.focused = id;
    this.pendingOpen = null;
    this.walkVx = 0;
    this.targetX = null;
    this.playAnim("interact", true);
    if (this.input.keyboard) this.input.keyboard.enabled = false;
    this.dim.setVisible(true);
    this.tweens.add({ targets: this.dim, alpha: 1, duration: this.reduced ? 0 : 280 });

    this.markers.forEach((image, index) => {
      const selected = buildings[index].id === id;
      image.setTint(selected ? 0xfff4dc : 0x7d8284);
      this.glows[index].setAlpha(selected ? 0.58 : 0.08);
      this.setWindows(index, selected);
    });
    this.refreshPresence();
    this.pauseAmbience(true);
    this.cameras.main.stopFollow();
    const marker = this.markers[buildings.findIndex((item) => item.id === id)];
    const lift = marker ? Math.min(320, marker.displayHeight * 0.42) : 240;
    this.cameras.main.pan(location.x, groundAt(location.x) - lift, this.reduced ? 0 : 420, "Sine.easeInOut");
    this.cameras.main.zoomTo(1, this.reduced ? 0 : 420);
  }

  private focusClient(id: ClientId) {
    const npc = boulevardNpcs.find((item) => item.id === id);
    if (!npc) return;
    this.focusedClient = id;
    this.focused = null;
    this.pendingClient = null;
    this.pendingOpen = null;
    this.walkVx = 0;
    this.targetX = null;
    this.playAnim("interact", true);
    if (this.input.keyboard) this.input.keyboard.enabled = false;
    this.dim.setVisible(true);
    this.tweens.add({ targets: this.dim, alpha: 0.72, duration: this.reduced ? 0 : 280 });
    this.npcs.forEach((sprite, index) => {
      const selected = boulevardNpcs[index].id === id;
      sprite.setTint(selected ? 0xfff4dc : 0x889099);
      sprite.setDepth(selected ? 16 : DEPTH.npc);
      this.npcGlows[index].setAlpha(selected ? 0.55 : 0.08);
    });
    this.refreshNpcs();
    this.pauseAmbience(true);
    this.cameras.main.stopFollow();
    this.cameras.main.pan(npc.x, groundAt(npc.x) - 220, this.reduced ? 0 : 380, "Sine.easeInOut");
    this.cameras.main.zoomTo(1, this.reduced ? 0 : 380);
  }

  private clearFocus() {
    this.focused = null;
    this.focusedClient = null;
    if (this.input.keyboard) this.input.keyboard.enabled = true;
    this.playAnim("idle", true);
    this.tweens.add({
      targets: this.dim,
      alpha: 0,
      duration: this.reduced ? 0 : 240,
      onComplete: () => this.dim.setVisible(false),
    });
    this.markers.forEach((image, index) => {
      image.clearTint();
      this.glows[index].setAlpha(0.18);
      this.setWindows(index, false);
    });
    this.npcs.forEach((sprite, index) => {
      sprite.clearTint();
      sprite.setDepth(DEPTH.npc);
      this.npcGlows[index].setAlpha(0.16);
    });
    this.refreshPresence();
    this.refreshNpcs();
    this.pauseAmbience(false);
    this.followWalker();
    this.cameras.main.zoomTo(SCALE.cameraZoom, this.reduced ? 0 : 360);
  }

  private onResize() {
    const w = Math.round(this.scale.width);
    const h = Math.round(this.scale.height);
    if (w === this.viewW && h === this.viewH) return;
    this.viewW = w;
    this.viewH = h;
    this.layoutSky();
    if (!this.focused && !this.focusedClient) this.fitCamera();
  }

  private layoutSky() {
    const w = Math.max(this.scale.width, 1);
    const mountainH = Math.max(this.scale.height * 0.64, w * 0.34);
    this.mountains?.setDisplaySize(w, Math.round(mountainH));
    this.clouds?.setDisplaySize(w, Math.max(160, Math.round(w * 0.16)));
    this.dim?.setSize(w, this.scale.height);
    this.skyFade?.clear();
    if (this.skyFade && this.mountains) {
      const top = this.mountains.displayHeight * 0.58;
      const fadeH = Math.max(90, this.mountains.displayHeight * 0.48);
      this.skyFade.fillGradientStyle(VOID, VOID, VOID, VOID, 0, 0, 1, 1);
      this.skyFade.fillRect(0, top, w, fadeH);
    }
  }

  private fitCamera() {
    const cam = this.cameras.main;
    const mobile = cam.width <= 640;
    const bottomPad = mobile
      ? Math.min(96, Math.max(76, cam.height * 0.11))
      : Math.min(64, Math.max(44, cam.height * 0.06));
    cam.setDeadzone(72, 24);
    cam.setFollowOffset(0, cam.height / 2 - bottomPad);
    cam.setZoom(SCALE.cameraZoom);
  }

  private followWalker() {
    if (this.focused || this.focusedClient) return;
    this.cameras.main.startFollow(this.player, true, 0.16, 0.1);
    this.fitCamera();
  }

  private screenOf(worldX: number, worldY: number) {
    const view = this.cameras.main.worldView;
    const snap = (value: number) => Math.round(value / 2) * 2;
    return {
      x: snap(((worldX - view.x) / Math.max(1, view.width)) * this.scale.width),
      y: snap(((worldY - view.y) / Math.max(1, view.height)) * this.scale.height),
    };
  }

  private emitHudAnchor() {
    const view = this.cameras.main.worldView;
    const px = this.scale.width / Math.max(1, view.width);
    const py = this.scale.height / Math.max(1, view.height);

    if (this.nearNpc) {
      const npc = boulevardNpcs.find((item) => item.id === this.nearNpc);
      if (!npc) return;
      const sprite = this.npcs[boulevardNpcs.findIndex((item) => item.id === npc.id)];
      const height = sprite?.displayHeight ?? NPC_HEIGHT;
      const width = sprite?.displayWidth ?? 64;
      const { x, y } = this.screenOf(npc.x, groundAt(npc.x) - height);
      const side: "left" | "right" = x < this.scale.width * 0.5 ? "right" : "left";
      const key = `client:${npc.id}:${x}:${y}`;
      if (key === this.lastAnchorKey) return;
      this.lastAnchorKey = key;
      const anchor = {
        kind: "client" as const,
        id: npc.id,
        side,
        x,
        y,
        width: Math.round(width * px),
        height: Math.round(height * py),
      };
      gameApi.lastAnchor = anchor;
      gameBus.emit("hud-anchor", anchor);
      return;
    }

    if (this.near) {
      const loc = locations.find((item) => item.id === this.near);
      if (!loc) return;
      const marker = this.markers[buildings.findIndex((item) => item.id === loc.id)];
      const height = marker?.displayHeight ?? (loc.id === "clients" ? 428 : 240);
      const width = marker?.displayWidth ?? loc.width;
      const { x, y } = this.screenOf(loc.x, groundAt(loc.x) - height);
      const side: "left" | "right" = x < this.scale.width * 0.5 ? "right" : "left";
      const key = `location:${loc.id}:${x}:${y}`;
      if (key === this.lastAnchorKey) return;
      this.lastAnchorKey = key;
      const anchor = {
        kind: "location" as const,
        id: loc.id,
        side,
        x,
        y,
        width: Math.round(width * px),
        height: Math.round(height * py),
      };
      gameApi.lastAnchor = anchor;
      gameBus.emit("hud-anchor", anchor);
      return;
    }

    if (this.lastAnchorKey) {
      this.lastAnchorKey = "";
      gameApi.lastAnchor = null;
      gameBus.emit("hud-anchor", null);
    }
  }

  private pauseAmbience(pause: boolean) {
    if (!this.sys?.isActive()) return;
    this.lightTweens.forEach((tween) => {
      if (!tween) return;
      if (pause) tween.pause();
      else tween.resume();
    });
    if (!pause && this.animState) this.playAnim(this.animState, true);
  }

  private addStars() {
    const stars = this.add.graphics().setScrollFactor(0).setDepth(DEPTH.stars);
    for (let i = 0; i < 16; i += 1) {
      stars.fillStyle(0xe8ddc8, 0.12 + Math.random() * 0.16);
      stars.fillCircle(40 + Math.random() * 1520, 18 + Math.random() * 170, 1);
    }
  }

  private addTerrain() {
    const { width, height } = WORLD;
    this.add.rectangle(0, BASE + 14, width, height - BASE, 0x171412).setOrigin(0, 0).setDepth(DEPTH.soil);
    this.add.rectangle(24, BASE - 4, width - 48, 22, 0x243028).setOrigin(0, 0).setDepth(DEPTH.soil + 0.05);

    this.fillRibbon();
    this.stampCobbles();
    this.stampEdgeGrass();

    const bridge = FEATURES.bridge;
    const mid = (bridge.x0 + bridge.x1) / 2;
    const span = bridge.x1 - bridge.x0;
    this.add
      .rectangle(mid, bridge.y + 8, span + 64, 58, 0x152024)
      .setOrigin(0.5, 0)
      .setDepth(DEPTH.water);
    this.water = this.add.image(mid, bridge.y + 34, "prop-water").setOrigin(0.5, 0.5).setDepth(DEPTH.water + 0.1);
    this.water.setDisplaySize(span + 18, 42);
    const bridgeH = Math.round((span + 48) * (270 / 720));
    this.add
      .image(mid, bridge.y + 6, "prop-bridge")
      .setOrigin(0.5, 0.8)
      .setDepth(DEPTH.structure)
      .setDisplaySize(span + 48, bridgeH);

    this.dressDistricts();
  }

  private fillRibbon() {
    const { width } = WORLD;
    this.add.rectangle(36, BASE - 7, width - 72, 18, 0x3a3732).setOrigin(0, 0).setDepth(DEPTH.path);
  }

  private stampCobbles() {
    const { width } = WORLD;
    for (let x = 90; x < width - 90; x += 168) {
      if (kindAt(x) === "bridge") continue;
      const wide = kindAt(x) === "plaza" ? 220 : 188;
      this.add
        .image(x, groundAt(x), "prop-cobble")
        .setOrigin(0.5, 0.22)
        .setDepth(DEPTH.path + 0.1)
        .setDisplaySize(wide, SCALE.cobbleHeight)
        .setAlpha(0.96);
    }
  }

  private stampEdgeGrass() {
    const spots = [
      560, 980, 1180, 1480, 1980, 2280, 3180, 4180, 4480, 4680, 5480, 6500, 6900, 7780,
    ];
    spots.forEach((x, i) => {
      if (kindAt(x) === "bridge") return;
      this.plant("prop-grass", x, 38 + (i % 3) * 4, 32 + (i % 2) * 4, DEPTH.edge);
    });
  }

  private plant(key: string, x: number, w: number, h: number, depth: number, originY = 1) {
    this.add.image(x, groundAt(x), key).setOrigin(0.5, originY).setDepth(depth).setDisplaySize(w, h);
  }

  private lantern(x: number, flameColor = GOLD) {
    this.add.image(x, groundAt(x), "prop-lantern").setOrigin(0.5, 1).setDepth(DEPTH.lamp).setDisplaySize(34, 168);
    const flame = this.add.ellipse(x, groundAt(x) - 128, 10, 14, flameColor, 0.5).setDepth(DEPTH.lamp + 0.1);
    if (!this.reduced) {
      this.lightTweens.push(
        this.tweens.add({
          targets: flame,
          alpha: 0.2,
          duration: 900 + (x % 400),
          yoyo: true,
          repeat: -1,
          ease: "Sine.easeInOut",
        }),
      );
    }
  }

  private dressDistricts() {
    this.plant("trees", 1080, 210, 92, DEPTH.mid);
    this.plant("trees", 2260, 190, 84, DEPTH.mid);
    this.plant("trees", 3180, 170, 78, DEPTH.mid);
    this.plant("trees", 4580, 180, 82, DEPTH.mid);
    this.plant("trees", 5480, 200, 88, DEPTH.mid);
    this.plant("trees", 6680, 186, 82, DEPTH.mid);

    this.plant("prop-grass", 640, 44, 36, DEPTH.edge);
    this.plant("prop-grass", 900, 40, 34, DEPTH.edge);
    this.plant("prop-bench", 540, 50, 28, DEPTH.edge);
    this.lantern(620);
    this.lantern(940);

    this.plant("prop-barrel", 1540, 28, 34, DEPTH.edge);
    this.plant("prop-barrel", 1860, 26, 32, DEPTH.edge);
    this.plant("prop-rock", 1600, 34, 22, DEPTH.edge);
    this.addSign(1480, "CODE STATION");

    this.lantern(2480);
    this.lantern(2960);
    this.plant("prop-bench", 2520, 52, 30, DEPTH.edge);
    this.plant("prop-bench", 2920, 50, 28, DEPTH.edge);
    this.addSign(2340, "PROJECT DISTRICT");

    this.add.ellipse(4220, groundAt(4220) - 110, 210, 96, TEAL, 0.16).setDepth(DEPTH.glow);
    this.lantern(4020, TEAL);
    this.lantern(4440, TEAL);
    this.plant("prop-barrel", 4080, 26, 32, DEPTH.edge);
    this.addSign(3980, "AI LABORATORY");

    this.lantern(4680);
    this.lantern(5260);
    this.addSign(4880, "CAREER TOWER");

    this.plant("prop-bench", 6940, 52, 30, DEPTH.edge);
    this.lantern(7000);
    this.lantern(7300);
    this.addSign(6860, "CONNECT HUB");
  }

  private addSign(x: number, title: string) {
    const gy = groundAt(x);
    this.add.image(x, gy, "prop-signpost").setOrigin(0.5, 1).setDisplaySize(42, 86).setDepth(DEPTH.edge);
    this.add
      .text(x, gy - 64, title, {
        fontFamily: "monospace",
        fontSize: "9px",
        color: "#E8DDC8",
        backgroundColor: "#151719aa",
        padding: { x: 4, y: 2 },
      })
      .setOrigin(0.5)
      .setDepth(DEPTH.label);
  }

  private addBoulevard() {
    const center = FEATURES.arch.x;
    const gy = (x: number) => groundAt(x);

    this.plant("prop-grass", center - 520, 44, 36, DEPTH.edge);
    this.plant("prop-grass", center + 520, 42, 36, DEPTH.edge);
    this.plant("prop-bench", center - 440, 50, 28, DEPTH.edge);
    this.plant("prop-bench", center + 440, 50, 28, DEPTH.edge);

    this.add
      .image(center, gy(center), "prop-arch")
      .setOrigin(0.5, 1)
      .setDepth(DEPTH.structure)
      .setDisplaySize(700, 428);

    const sign = this.add.image(center, gy(center), "sign-boulevard").setOrigin(0.5, 1).setDepth(DEPTH.building);
    sign.setDisplaySize(220, 220 * (sign.height / Math.max(sign.width, 1)));

    this.lantern(center - 480);
    this.lantern(center + 480);

    boulevardNpcs.forEach((npc, index) => {
      const glow = this.add.ellipse(npc.x, gy(npc.x) + 2, 54, 16, GOLD, 0.16).setDepth(DEPTH.glow);
      this.npcGlows.push(glow);
      const contact = this.add.ellipse(npc.x, gy(npc.x) + 3, 52, 14, 0x0b0c0d, 0.38).setDepth(DEPTH.shadow);
      this.npcShadows.push(contact);

      const sprite = this.add.sprite(npc.x, gy(npc.x), `npc-${npc.sheet}`, 0);
      sprite.setOrigin(0.5, 1);
      sprite.setFlipX(npc.flipX);
      const npcScale = NPC_HEIGHT / NPC_SHEETS[npc.sheet].frameHeight;
      sprite.setScale(npcScale);
      sprite.setDepth(DEPTH.npc);
      const fw = NPC_SHEETS[npc.sheet].frameWidth;
      const fh = NPC_SHEETS[npc.sheet].frameHeight;
      sprite.setInteractive(
        new Phaser.Geom.Rectangle(-Math.round(fw * 0.25), 0, Math.round(fw * 1.5), fh),
        Phaser.Geom.Rectangle.Contains,
      );
      if (sprite.input) sprite.input.cursor = "pointer";
      sprite.on("pointerover", () => this.hoverNpc(index, true));
      sprite.on("pointerout", () => this.hoverNpc(index, false));
      sprite.on("pointerup", () => this.approachNpc(npc.id, true));
      this.npcs.push(sprite);

      const clientName = freelancePortfolios.find((item) => item.id === npc.id)?.name ?? npc.id;
      const label = this.add
        .text(npc.x, gy(npc.x) - NPC_HEIGHT - 8, clientName.toUpperCase(), {
          fontFamily: "monospace",
          fontSize: "11px",
          color: "#E8DDC8",
          backgroundColor: "#151719cc",
          padding: { x: 8, y: 3 },
        })
        .setOrigin(0.5, 1)
        .setAlpha(0)
        .setDepth(DEPTH.label);
      this.npcLabels.push(label);
    });
  }

  private hoverNpc(index: number, on: boolean) {
    if (this.focused || this.focusedClient) return;
    const nearHere = boulevardNpcs[index].id === this.nearNpc;
    this.npcs[index].setTint(on || nearHere ? 0xffe7c2 : 0xffffff);
    this.npcGlows[index].setAlpha(on ? 0.42 : nearHere ? 0.32 : 0.16);
    if (!nearHere) {
      this.tweens.add({ targets: this.npcLabels[index], alpha: on ? 1 : 0, duration: this.reduced ? 0 : 140 });
    }
  }

  private refreshNpcs() {
    this.npcLabels.forEach((label, index) => {
      const show = boulevardNpcs[index].id === this.nearNpc || boulevardNpcs[index].id === this.focusedClient;
      this.tweens.add({ targets: label, alpha: show ? 1 : 0, duration: this.reduced ? 0 : 150 });
      if (!this.focusedClient) {
        const nearHere = boulevardNpcs[index].id === this.nearNpc;
        this.npcs[index].setTint(nearHere ? 0xfff1d0 : 0xffffff);
        this.npcGlows[index].setAlpha(nearHere ? 0.32 : 0.16);
      }
    });
  }

  private addChimneySmoke() {
    if (this.reduced) return;
    const home = locations[0];
    const marker = this.markers[0];
    const originX = home.x + home.width * 0.28;
    const originY = groundAt(home.x) - marker.displayHeight + 40;
    for (let i = 0; i < 1; i += 1) {
      const puff = this.add.ellipse(originX, originY, 8, 10, 0xc8c2b4, 0.16).setDepth(DEPTH.lamp);
      this.lightTweens.push(
        this.tweens.add({
          targets: puff,
          y: originY - 70,
          x: originX + 12,
          alpha: 0,
          scaleX: 1.8,
          scaleY: 1.6,
          duration: 3200 + i * 400,
          delay: i * 900,
          repeat: -1,
          ease: "Sine.easeOut",
        }),
      );
    }
  }

  private addFireflies() {
    if (this.reduced) return;
    for (let i = 0; i < 4; i += 1) {
      const x = 400 + Math.random() * (WORLD.width - 800);
      const y = groundAt(x) - 90 - Math.random() * 140;
      const bug = this.add.circle(x, y, 2, GOLD, 0.65).setDepth(DEPTH.player);
      this.lightTweens.push(
        this.tweens.add({
          targets: bug,
          x: x + Phaser.Math.Between(-40, 40),
          y: y + Phaser.Math.Between(-24, 24),
          alpha: 0.15,
          duration: 2200 + i * 180,
          yoyo: true,
          repeat: -1,
          ease: "Sine.easeInOut",
        }),
      );
    }
  }
}
