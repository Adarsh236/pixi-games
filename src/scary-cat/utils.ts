import { Assets } from "pixi.js"
import { DEFAULT_CONFIG } from "./constant"

export class AssetManager {
  static async load(resources: Record<string, string>): Promise<void> {
    const urls = Object.values(resources)
    await Assets.load(urls)
  }

  static get(key: string): any {
    return Assets.get(DEFAULT_CONFIG.assets[key])
  }
}
