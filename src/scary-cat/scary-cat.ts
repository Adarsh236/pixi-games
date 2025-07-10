import {
  Application,
  Assets,
  Container,
  DisplacementFilter,
  TilingSprite,
  Sprite,
  Texture,
} from "pixi.js"
import { LevelUI, Player } from "./component"
import { DEFAULT_CONFIG } from "./constant"
import type { GameConfig } from "./type"
import { AssetManager } from "./utils"

export class ScaryCatGame {
  private app: Application
  private config: GameConfig
  private container: Container
  private overlay!: TilingSprite
  private dispSprite!: Sprite
  private dispFilter!: DisplacementFilter
  private players!: { main: Player; mover: Player }
  private levelUI!: LevelUI
  private speed: number
  private level: number = 1

  constructor(config: Partial<GameConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }
    this.speed = this.config.initialSpeed
    this.app = new Application()

    this.container = new Container()

    // Center canvas on resize
    window.addEventListener("resize", () => this.centerCanvas())
  }

  public async start(): Promise<void> {
    await this.app.init({
      width: this.config.width,
      height: this.config.height,
      antialias: true,
    })
    document.getElementById("app")?.appendChild(this.app.canvas)
    this.centerCanvas()

    await AssetManager.load(this.config.assets)
    this.setupScene()
    this.app.ticker.add(({ deltaTime }) => this.update(deltaTime))
    this.app.canvas.addEventListener("pointerdown", () => this.onPointerDown())
  }

  private centerCanvas(): void {
    const canvasStyle = this.app.canvas.style
    canvasStyle.position = "absolute"
    canvasStyle.top = `${(window.innerHeight - this.config.height) / 2}px`
    canvasStyle.left = `${(window.innerWidth - this.config.width) / 2}px`
  }

  private setupScene(): void {
    // Background
    const bg = Sprite.from(this.config.assets.bg)

    // Displacement filter
    const map = Assets.get(this.config.assets.map) as Texture
    map.source.wrapMode = "repeat"
    this.dispSprite = new Sprite(map)
    this.dispFilter = new DisplacementFilter({
      sprite: this.dispSprite,
      scale: this.config.displacementScale,
    })

    this.container.filters = [this.dispFilter]

    // Water overlay
    this.overlay = TilingSprite.from(this.config.assets.overlay, {
      width: this.config.width,
      height: this.config.height,
    })

    // Players
    const mainPlayer = new Player(Assets.get(this.config.assets.player1))
    mainPlayer.width = 200
    mainPlayer.height = 200
    mainPlayer.position.set(this.config.width / 2, this.config.height / 2)

    const mover = new Player(Assets.get(this.config.assets.player2))
    mover.width = 50
    mover.height = 50
    mover.position.set(mover.width / 2, this.config.height / 2)

    this.players = { main: mainPlayer, mover }

    // UI
    this.levelUI = new LevelUI(this.app)

    // Assemble
    this.container.addChild(
      bg,
      this.dispSprite,
      mainPlayer,
      mover,
      this.overlay
    )
    this.app.stage.addChild(this.container, this.levelUI)
  }

  private update(delta: number): void {
    this.overlay.tilePosition.x += 0.5 * delta
    this.overlay.tilePosition.y += 0.5 * delta
    // Move the actual displacement sprite
    this.dispSprite.x += 0.5 * delta
    this.dispSprite.y += 0.5 * delta
    // Maintain filter scale
    this.dispFilter.scale.x = this.dispFilter.scale.y =
      this.config.displacementScale

    // Move and bounce
    this.players.mover.x += this.speed * delta
    if (
      this.players.mover.x <= this.players.mover.width / 2 ||
      this.players.mover.x >= this.config.width - this.players.mover.width / 2
    ) {
      this.speed *= -1
    }
  }

  private onPointerDown(): void {
    const dx = this.players.main.x - this.players.mover.x
    const dy = this.players.main.y - this.players.mover.y
    const distance = Math.hypot(dx, dy)
    const collisionDist = 50 + 25

    if (distance <= collisionDist) {
      this.level++
      this.speed = this.level
      this.players.main.scale.set(this.players.main.scale.x * 0.8)
      this.players.mover.x = this.players.mover.width / 2
    } else if (this.level !== 1) {
      this.level--
      this.speed = this.level
      this.players.main.scale.set(this.players.main.scale.x / 0.8)
    }

    this.levelUI.updateLevel(this.level)
  }
}
