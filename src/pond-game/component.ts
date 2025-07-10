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
}
