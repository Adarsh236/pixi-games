import { PondGame } from "./pond-game/pond-game"
import "./style.css"
;(async () => {
  const game = new PondGame()
  await game.start()
})()
