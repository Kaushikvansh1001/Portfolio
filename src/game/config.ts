import Phaser from "phaser";
import { WORLD } from "@/data/world";
import { WorldScene } from "./scenes/WorldScene";

export function createGame(parent: HTMLElement) {
  return new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    backgroundColor: "#151719",
    pixelArt: false,
    antialias: true,
    roundPixels: true,
    fps: {
      target: 60,
      smoothStep: true,
    },
    render: {
      antialias: true,
      roundPixels: true,
      antialiasGL: true,
      powerPreference: "high-performance",
      batchSize: 4096,
      clearBeforeRender: true,
      mipmapFilter: "LINEAR",
    },
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 1600,
      height: 900,
    },
    scene: [WorldScene],
    audio: { noAudio: true },
    banner: false,
    callbacks: {
      preBoot: (game) => {
        game.registry.set("world", WORLD);
      },
    },
  });
}
