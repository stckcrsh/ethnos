import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as game from './game.reducer';
import * as deck from './deck.reducer';
import * as draw from './draw-pile.reducer';
import * as player from './players.reducer';
import * as cards from './cards.reducer';
import * as board from './board.reducer';
import * as fromRoot from '../../reducers/index';
import * as R from 'ramda';

export interface GameState {
  deck: deck.State;
  game: game.State;
  draw: draw.State;
  players: player.State;
  cards: cards.State;
  board: board.State;
}

export const reducers = {
  deck: deck.reducer,
  game: game.reducer,
  draw: draw.reducer,
  players: player.reducer,
  cards: cards.reducer,
  board: board.reducer
};

export interface State extends fromRoot.State {
  'game': GameState;
}

export const getGameFeature = createFeatureSelector<GameState>('game');

export const getPlayerState = createSelector(
  getGameFeature,
  (state: GameState) => state.players
);
export const getGameState = createSelector(
  getGameFeature,
  (state: GameState) => state.game
);
export const getCardState = createSelector(
  getGameFeature,
  (state: GameState) => state.cards
);
export const getDeckState = createSelector(
  getGameFeature,
  (state: GameState) => state.deck
);

export const getBoardState = createSelector(
  getGameFeature,
  (state: GameState) => state.board
);

export const getDrawState = createSelector(
  getGameFeature,
  (state: GameState) => state.draw
);

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

export const isRoundOver = createSelector(getGameState, game.isRoundOver);
export const isGameOver = createSelector(getGameState, game.isGameOver);
export const getRoundNumber = createSelector(getGameState, game.getRoundNumber);

export const getCurrentPlayer = createSelector(
  getPlayerEntities,
  getCurrentPlayerId,
  (entities, currentPlayer) => entities[currentPlayer]
);

export const getCardEntities = createSelector(getCardState, cards.getEntities);
export const getAllCardIds = createSelector(getCardState, cards.getIds);
export const getAllDragonIds = createSelector(getCardState, cards.getDragons);

export const getTopCard = createSelector(getDeckState, deck.getTopCard);

export const getAllSpaces = createSelector(getBoardState, board.getAll);

export const getDrawPile = createSelector(
  getDrawState,
  getCardEntities,
  (draw, card) => draw.map(id => card[id])
);

export const getBoardScores = createSelector(
  getGameState,
  getPlayerState,
  getBoardState,
  (_game, _player, _board) => {
    const playerScores = _player.ids.reduce(
      (acc, id) => ({ ...acc, [id]: 0 }),
      {}
    );

    const era = _game.round;
    // const era = 1;
    const types = Object.keys(_board);

    types.forEach(type => {
      const space = _board[type];

      // group the players into tiers by number of pieces
      const players = Object.keys(space.pieces);
      const groupedPlayers = R.groupWith(
        (a, b) => space.pieces[a] === space.pieces[b],
        players.sort((a, b) => space.pieces[b] - space.pieces[a])
      );

      let i = 0;
      let idx = 0;
      const scores = space.scores.slice(0, era + 1);
      while (
        idx <= era &&
        groupedPlayers.length > 0 &&
        i < groupedPlayers.length
      ) {
        const len = groupedPlayers[i].length;
        const combinedScores = scores
          .sort((a, b) => b - a)
          .slice(idx, idx + len)
          .reduce((a, b) => a + b);

        // distribute scores
        groupedPlayers[i].forEach(player => {
          playerScores[player] += Math.floor(combinedScores / len);
        });

        idx += len;
        i++;
      }
    });

    return playerScores;
  }
);

export const getSetScores = createSelector(
  getPlayerState,
  getCardState,
  (_players, _cards) => {

    const setScoring = [0, 1, 3, 6, 10, 15];
    return _players.ids
      .reduce((acc, id) => {
        const player = _players.entities[id];
        console.log(player);
        return {
          ...acc,
          [id]: player.sets.reduce(
            (score, set) => score + setScoring[set.cards.length - 1],
            0
          )
        };
      }, {});
  }
);

export const getScores = createSelector(
  getBoardScores,
  getSetScores,
  (boardScores, setScores) =>
    R.mapObjIndexed((score, key) => score + (boardScores[key] || 0), setScores)
);
