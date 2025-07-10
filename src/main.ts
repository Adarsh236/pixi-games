import { ScaryCatGame } from "./scary-cat/scary-cat"
import "./style.css"
;(async () => {
  const game = new ScaryCatGame()
  await game.start()
})()
