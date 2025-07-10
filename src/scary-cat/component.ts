import { Container, Sprite, Texture, type Application, Text } from "pixi.js"

export class LevelUI extends Text {
  constructor(app: Application) {
    super({
      text: `Level: 1`,
      style: {
        fontSize: 24,
        fill: 0x4a4a4a,
      },
    })
    this.anchor.set(0.5)
    this.position.set(app.screen.width / 2, 20)
  }

  updateLevel(level: number) {
    this.text = `Level: ${level}`
  }
}

export class Player extends Container {
  private sprite: Sprite

  constructor(texture: Texture) {
    super()
    this.sprite = new Sprite(texture)
    this.sprite.anchor.set(0.5)
    this.addChild(this.sprite)
  }

  get radius(): number {
    return (this.sprite.width * this.sprite.scale.x) / 2
  }

  get boundingRadius(): number {
    // Get local bounds, apply scale
    const bounds = this.sprite.getLocalBounds()
    const halfWidth = (bounds.width * this.sprite.scale.x) / 2
    const halfHeight = (bounds.height * this.sprite.scale.y) / 2
    // Use circle circumscribing the rectangle
    return Math.hypot(halfWidth, halfHeight)
  }
}
