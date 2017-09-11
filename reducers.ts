import { combineReducers, createSelector } from "@ngrx/store";
import * as game from './game.reducer';
import * as deck from './deck.reducer';
import * as draw from './draw-pile.reducer';
import * as player from './player.reducer';
import * as cards from './cards.reducer';
import * as board from './board.reducer';
import * as R from 'ramda';

export interface State {
  deck: deck.State;
  game: game.State;
  draw: draw.State;
  players: player.State;
  cards: cards.State;
  board: board.State;
}

export const reducer = combineReducers({
  deck: deck.reducer,
  game: game.reducer,
  draw: draw.reducer,
  players: player.reducer,
  cards: cards.reducer,
  board: board.reducer
});

export const getPlayerState = (state: State) => state.players;
export const getGameState = (state: State) => state.game;
export const getCardState = (state: State) => state.cards;
export const getDeckState = (state: State) => state.deck;

export const getPlayerEntities = createSelector(
  getPlayerState,
  player.getEntities
);

export const getAllPlayers = createSelector(getPlayerState, player.getAll);
export const getPlayerIds = createSelector(getPlayerState, player.getIds);

export const getCurrentPlayerId = createSelector(
  getGameState,
  game.getCurrentPlayerId
);

export const isRoundOver = createSelector(
  getGameState,
  game.isRoundOver
)
export const getRoundNumber = createSelector(
  getGameState,
  game.getRoundNumber
)

export const getCurrentPlayer = createSelector(
  getPlayerEntities,
  getCurrentPlayerId,
  (entities, currentPlayer) => entities[currentPlayer]
);

export const getCardEntities = createSelector(getCardState, cards.getEntities);
export const getAllCardIds = createSelector(getCardState, cards.getIds);
export const getAllDragonIds = createSelector(getCardState, cards.getDragons);

export const getTopCard = createSelector(getDeckState, deck.getTopCard);

export const toString = (state: State) => {
  console.log(`Players: ${JSON.stringify(state.players, null, "  ")}`);
}