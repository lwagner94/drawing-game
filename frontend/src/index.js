import _ from 'lodash'
import MainView from './MainView.js'
import Controller from './Controller'
import GameLobbyView from './GameLobbyView.js';
import TitleScreenView from './TitleScreenView.js';
import Model from './Model.js';

function init() {
  const element = document.getElementById('content');
  

  const model = new Model();
  const gameLobbyView = new GameLobbyView(model);
  const titleScreenView = new TitleScreenView(model);
  const mainView = new MainView(model, titleScreenView, gameLobbyView);
  

  const controller = new Controller(model, mainView, titleScreenView, gameLobbyView);

  element.innerHTML = mainView.inject();
  mainView.visible = true;
  console.log("foobar");
}
  
init();