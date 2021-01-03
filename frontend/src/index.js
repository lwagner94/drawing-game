import Controller from './Controller.js'
import GameLobbyView from './GameLobbyView.js';
import GameView from './GameView.js'
import TitleScreenView from './TitleScreenView.js';
import Model from './Model.js';
import CreateGameView from './CreateGameView.js';
import ManageWordlistsView from './ManageWordlistsView.js';
// import css from "./style.css"

function init() {
  const model = new Model();
  const gameLobbyView = new GameLobbyView(model);
  const titleScreenView = new TitleScreenView(model);
  const gameView = new GameView(model)
  const createGameView = new CreateGameView(model);
  const manageWordlistsView = new ManageWordlistsView(model);
  const controller = new Controller(model, titleScreenView, manageWordlistsView, createGameView, gameLobbyView, gameView);
}
  
init();