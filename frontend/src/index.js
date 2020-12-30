import Controller from './Controller.js'
import GameLobbyView from './GameLobbyView.js';
import GameView from './GameView.js'
import TitleScreenView from './TitleScreenView.js';
import Model from './Model.js';
// import css from "./style.css"

function init() {
  const model = new Model();
  const gameLobbyView = new GameLobbyView(model);
  const titleScreenView = new TitleScreenView(model);
  const gameView = new GameView(model)
  const controller = new Controller(model, titleScreenView, gameLobbyView, gameView);
}
  
init();