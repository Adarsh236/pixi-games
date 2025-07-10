import type { GameConfig } from "./type"

export const DEFAULT_CONFIG: GameConfig = {
  width: 630,
  height: 410,
  assets: {
    bg: "https://pixijs.com/assets/pond/displacement_BG.jpg",
    overlay: "https://pixijs.com/assets/pond/overlay.png",
    map: "https://pixijs.com/assets/pond/displacement_map.png",
    player1: "/assets/dog.png",
    player2: "/assets/cat.png",
  },
  displacementScale: 40,
  initialSpeed: 1,
}
